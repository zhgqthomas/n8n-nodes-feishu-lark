import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

const MessageEditOperate: ResourceOperation = {
	name: 'Edit Message | 编辑消息',
	value: 'message:edit',
	options: [
		{
			displayName: 'Message ID(消息ID)',
			name: 'message_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/update#pathParams',
		},
		{
			displayName: 'Message Type(消息类型)',
			name: 'msg_type',
			type: 'options',
			options: [
				{ name: 'Text(文本)', value: 'text' },
				{ name: 'Rich Text(富文本)', value: 'post' },
			],
			required: true,
			default: 'text',
		},
		{
			displayName: 'Message Content(消息内容)',
			name: 'content',
			type: 'json',
			default: '{"text":"test content"}',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/update#requestBody',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const msg_type = this.getNodeParameter('msg_type', index) as string;
		const content = this.getNodeParameter('content', index) as string;

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/im/v1/messages/${message_id}`,
			body: {
				msg_type,
				content,
			},
		});
		if (code !== 0) {
			throw new Error(`Edit message failed, code: ${code}, message: ${msg}`);
		}
		return data as IDataObject;
	},
};

export default MessageEditOperate;
