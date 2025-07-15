import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { MessageType, OperationType, OutputType, TriggerEventType } from '../../../help/type/enums';

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
		content: string;
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
		const returnData: INodeExecutionData[][] = Array.from(
			{ length: messageTypes.length },
			() => [],
		);
		const { message } = item;
		message.content = JSON.parse(message.content || '{}');
		// switch (message.message_type) {
		// 	case MessageType.Image:
		// 	case MessageType.File:
		// 	case MessageType.RichText:
		// 	case MessageType.Audio:
		// 	case MessageType.Video:
		// 	case MessageType.Card:
		// 	case MessageType.Location:
		// 	case MessageType.Todo:
		// 	case MessageType.CalendarEvent:
		// 	case MessageType.Text:
		// 	default:
		// 		throw new NodeOperationError(this.getNode(), `Unsupported message type: ${type}`);
		// }
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
