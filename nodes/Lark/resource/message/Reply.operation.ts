import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Reply Message | 回复消息',
	value: 'reply',
	options: [
		{
			displayName: 'Message ID(消息ID)',
			name: 'message_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/reply#pathParams',
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
			displayName: 'Whether Reply in Thread(是否以话题形式回复)',
			name: 'reply_in_thread',
			type: 'boolean',
			default: false,
			description:
				'Whether to reply in thread form. If the value is true, the reply will be in thread form.',
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
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/reply#requestBody',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const msg_type = this.getNodeParameter('msg_type', index) as string;
		const content = this.getNodeParameter('content', index) as string;
		const uuid = this.getNodeParameter('uuid', index) as string;
		const reply_in_thread = this.getNodeParameter('reply_in_thread', index) as boolean;

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages/${message_id}/reply`,
			body: {
				msg_type,
				content,
				...(uuid && { uuid }),
				...(reply_in_thread && { reply_in_thread }),
			},
		});
		if (code !== 0) {
			throw new Error(`Reply message failed, code: ${code}, message: ${msg}`);
		}
		return data as IDataObject;
	},
} as ResourceOperation;
