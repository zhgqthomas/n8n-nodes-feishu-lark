import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Forward Message | 转发消息',
	value: 'message:forward',
	options: [
		{
			displayName: 'Message ID(消息ID)',
			name: 'message_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/forward#pathParams',
		},
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
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/forward#queryParams',
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
			displayName: 'UUID(去重ID)',
			name: 'uuid',
			type: 'string',
			default: '',
			description:
				'A custom unique string sequence used to request deduplication when sending messages',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const receive_id_type = this.getNodeParameter('receive_id_type', index) as string;
		const receive_id = this.getNodeParameter('receive_id', index) as string;
		const uuid = this.getNodeParameter('uuid', index) as string;

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages/${message_id}/forward`,
			qs: { receive_id_type, ...(uuid && { uuid }) },
			body: { receive_id },
		});
		if (code !== 0) {
			throw new Error(`Forward message failed, code: ${code}, message: ${msg}`);
		}
		return data as IDataObject;
	},
} as ResourceOperation;
