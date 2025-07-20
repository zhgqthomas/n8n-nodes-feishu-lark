import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { MessageType, OperationType, OutputType, TriggerEventType } from '../../../help/type/enums';
import { larkApiRequestMessageResourceData } from '../../GenericFunctions';
import { WORDING } from '../../../help/wording';
import { DESCRIPTIONS } from '../../../help/description';

interface IMessageContent {
	event_id?: string;
	token?: string;
	create_time?: string;
	event_type?: string;
	tenant_key?: string;
	ts?: string;
	uuid?: string;
	type?: string;
	app_id?: string;
	sender: {
		sender_id?: {
			union_id?: string;
			user_id?: string;
			open_id?: string;
		};
		sender_type: string;
		tenant_key?: string;
	};
	message: {
		message_id: string;
		root_id?: string;
		parent_id?: string;
		create_time: string;
		update_time?: string;
		chat_id: string;
		thread_id?: string;
		chat_type: string;
		message_type: string;
		content: string | IDataObject;
		mentions?: Array<{
			key: string;
			id: { union_id?: string; user_id?: string; open_id?: string };
			name: string;
			tenant_key?: string;
		}>;
		user_agent?: string;
	};
}

export default {
	name: WORDING.ParseMessageContent,
	value: OperationType.ParseMessageContent,
	order: 201,
	options: [DESCRIPTIONS.RECEIVE_MESSAGE_TYPES, DESCRIPTIONS.DOWNLOAD_RESOURCE],

	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const inputData = this.getInputData() as INodeExecutionData[];
		if (inputData.length === 0) {
			throw new NodeOperationError(this.getNode(), 'No input data found');
		}

		const item = inputData[index].json as unknown as IMessageContent;
		if (item.event_type !== TriggerEventType.ReceiveMessage) {
			this.logger.debug('Unsupported event type for parse message content', {
				eventType: item.event_type,
				itemIndex: index,
			});
			return {
				outputType: OutputType.None,
			};
		}

		const messageTypes = this.getNodeParameter('messageTypes', index, []) as string[];
		const downloadResource = this.getNodeParameter('downloadResource', index, false) as boolean;
		const returnData: INodeExecutionData[][] = Array.from(
			{ length: messageTypes.length },
			() => [],
		);
		const { message } = item;
		message.content = JSON.parse((message.content as string) || '{}');
		if (downloadResource) {
			switch (message.message_type) {
				case MessageType.Image:
					// Handle image content parsing
					const imageContent = message.content as IDataObject;
					const imageData = await larkApiRequestMessageResourceData.call(this, {
						type: 'image',
						messageId: message.message_id,
						key: imageContent.image_key as string,
					});
					message.content = { ...imageContent, data: imageData };
					break;
				case MessageType.File:
				case MessageType.Audio:
				case MessageType.Video:
					// Handle file content parsing
					const fileContent = message.content as IDataObject;
					const fileData = await larkApiRequestMessageResourceData.call(this, {
						type: 'file',
						messageId: message.message_id,
						key: fileContent.file_key as string,
					});
					message.content = { ...fileContent, data: fileData };
					break;
				case MessageType.RichText:
					// Handle rich text content parsing
					message.content = await handleRichTextContent.call(this, message);
					break;
				default:
			}
		}
		const outputIndex = messageTypes.indexOf(message.message_type);
		if (outputIndex === -1) {
			this.logger.debug('Message type not selected for parsing', {
				messageType: message.message_type,
				itemIndex: index,
			});
			return {
				outputType: OutputType.None,
			};
		}

		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray({ ...item }),
			{ itemData: { item: index } },
		);
		returnData[outputIndex].push(...executionData);

		return {
			outputType: OutputType.Multiple,
			outputData: returnData,
		};
	},
} as ResourceOperation;

async function handleRichTextContent(
	this: IExecuteFunctions,
	message: IDataObject,
): Promise<IDataObject> {
	const richTextContent = message.content as IDataObject;
	if (Array.isArray(richTextContent.content)) {
		const processedContent = await Promise.all(
			richTextContent.content
				.filter((line: any[]) => line.length > 0)
				.map(async (line: any[]) => {
					return await Promise.all(
						line.map(async (element: IDataObject) => {
							const { tag } = element;

							if (tag !== 'img' && tag !== 'media') {
								return element; // Skip non-resource elements
							}

							let type = '';
							let key = '';
							if (tag === 'img') {
								type = 'image';
								key = element.image_key as string;
							} else if (tag === 'media') {
								type = 'file';
								key = element.file_key as string;
							}

							const data = await larkApiRequestMessageResourceData.call(this, {
								type,
								messageId: message.message_id as string,
								key,
							});

							return {
								...element,
								data,
							};
						}),
					);
				}),
		);
		return { ...richTextContent, content: processedContent };
	}

	return richTextContent;
}
