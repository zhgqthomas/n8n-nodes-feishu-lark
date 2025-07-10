import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Send Message | 发送消息',
	value: 'message:send',
	options: [
		{
			displayName: 'Receiver ID Type(接收者ID类型)',
			name: 'receive_id_type',
			type: 'options',
			options: [
				{
					name: 'Chat ID',
					value: 'chat_id',
					description: 'Identifies group chats by chat_id',
				},
				{
					name: 'Email',
					value: 'email',
					description: 'Identifies users by "email"',
				},
				{
					name: 'Open ID',
					value: 'open_id',
					description: 'Identifies a user to an app',
				},
				{
					name: 'Union ID',
					value: 'union_id',
					description: 'Identifies a user to a tenant that acts as a developer',
				},
				{
					name: 'User ID',
					value: 'user_id',
					description: 'Identifies a user to a tenant',
				},
			],
			required: true,
			default: 'open_id',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/create#queryParams',
		},
		{
			displayName: 'Receiver ID(接收者ID)',
			name: 'receive_id',
			type: 'string',
			default: '',
			description:
				'The ID type should consistent with the value of the query parameter receive_id_type',
		},
		{
			displayName: 'Message Type(消息类型)',
			name: 'msg_type',
			type: 'options',
			options: [
				{ name: 'Audio(语音)', value: 'audio' },
				{ name: 'File(文件)', value: 'file' },
				{ name: 'Image(图片)', value: 'image' },
				{ name: 'Interactive Card(卡片)', value: 'interactive' },
				{ name: 'Rich Text(富文本)', value: 'post' },
				{ name: 'Share Chat(分享群名片)', value: 'share_chat' },
				{ name: 'Share User(分享个人名片)', value: 'share_user' },
				{ name: 'Sticker(表情包)', value: 'sticker' },
				{ name: 'System Message(系统消息)', value: 'system' },
				{ name: 'Text(文本)', value: 'text' },
				{ name: 'Video(视频)', value: 'media' },
			],
			description:
				'Https://open.feishu.cn/document/server-docs/im-v1/message-content-description/create_json',
			required: true,
			default: 'text',
		},
		{
			displayName: 'UUID(去重ID)',
			name: 'uuid',
			type: 'string',
			default: '',
			description:
				'A custom unique string sequence used to request deduplication when sending messages',
		},
		{
			displayName: 'Message Content(消息内容)',
			name: 'content',
			type: 'json',
			default: '{"text":"test content"}',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/create#requestBody',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const receive_id_type = this.getNodeParameter('receive_id_type', index) as string;
		const receive_id = this.getNodeParameter('receive_id', index) as string;
		const msg_type = this.getNodeParameter('msg_type', index) as string;
		const content = this.getNodeParameter('content', index) as object;
		const uuid = this.getNodeParameter('uuid', index) as string;

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages`,
			qs: {
				receive_id_type,
			},
			body: {
				receive_id,
				msg_type,
				content,
				...(uuid && { uuid }),
			},
		});
		if (code !== 0) {
			throw new Error(`Send message failed, code: ${code}, message: ${msg}`);
		}
		return data as IDataObject;
	},
} as ResourceOperation;
