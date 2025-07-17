import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { MessageType, OperationType, OutputType, TriggerEventType } from '../../../help/type/enums';
import { larkApiRequestMessageResourceData } from '../../GenericFunctions';

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
	name: 'Parse Message Content | 解析消息中的内容',
	value: OperationType.ParseMessageContent,
	options: [
		{
			displayName: 'Message Type(消息类型)',
			name: 'messageTypes',
			type: 'multiOptions',
			options: [
				{
					name: 'Image(图片)',
					value: MessageType.Image,
					description: MessageType.Image,
				},
				{
					name: 'File(文件)',
					value: MessageType.File,
					description: MessageType.File,
				},
				{
					name: 'Rich Text(富文本)',
					value: MessageType.RichText,
					description: MessageType.RichText,
				},
				{
					name: 'Audio(音频)',
					value: MessageType.Audio,
					description: MessageType.Audio,
				},
				{
					name: 'Video(视频)',
					value: MessageType.Video,
					description: MessageType.Video,
				},
				{
					name: 'Card(卡片)',
					value: MessageType.Card,
					description: MessageType.Card,
				},
				{
					name: '位置(Location)',
					value: MessageType.Location,
					description: MessageType.Location,
				},
				{
					name: 'Todo(任务)',
					value: MessageType.Todo,
					description: MessageType.Todo,
				},
				{
					name: 'Calendar Event(日程)',
					value: MessageType.CalendarEvent,
					description: MessageType.CalendarEvent,
				},
				{
					name: 'Text(文本)',
					value: MessageType.Text,
					description: MessageType.Text,
				},
			],
			required: true,
			default: [MessageType.Text],
		},
		{
			displayName: 'Whether Download Resource(是否下载资源)',
			name: 'downloadResource',
			type: 'boolean',
			default: false,
			required: true,
			description: 'Whether to download resources such as images, files, etc',
			displayOptions: {
				show: {
					messageTypes: [
						MessageType.Image,
						MessageType.File,
						MessageType.Audio,
						MessageType.Video,
						MessageType.RichText,
					],
				},
			},
		},
	],

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
