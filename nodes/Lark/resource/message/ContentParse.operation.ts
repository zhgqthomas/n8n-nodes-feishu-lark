import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { OperationType, OutputType, TriggerEventType } from '../../../help/type/enums';
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
	order: 100,
	options: [DESCRIPTIONS.RECEIVE_MESSAGE_TYPES],

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
		const returnData: INodeExecutionData[][] = Array.from(
			{ length: messageTypes.length },
			() => [],
		);
		const { message } = item;
		message.content = JSON.parse((message.content as string) || '{}');
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
