import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

export default {
	name: 'Batch Send Messages | 批量发送消息',
	value: 'batchSend',
	options: [
		{
			displayName: 'Message Type(消息类型)',
			name: 'msg_type',
			type: 'options',
			options: [
				{ name: 'Image(图片)', value: 'image' },
				{ name: 'Interactive Card(卡片)', value: 'interactive' },
				{ name: 'Rich Text(富文本)', value: 'post' },
				{ name: 'Share Chat(分享群名片)', value: 'share_chat' },
				{ name: 'Text(文本)', value: 'text' },
			],
			description:
				'Https://open.feishu.cn/document/server-docs/im-v1/batch_message/send-messages-in-batches#1b8abd5d',
			required: true,
			default: 'text',
		},
		{
			displayName: 'Message Content(消息内容)',
			name: 'content',
			type: 'json',
			default: '{"text":"test content"}',
			description: 'Only when the value of msg_type is not interactive',
			displayOptions: {
				show: {
					msg_type: ['text', 'image', 'post', 'share_chat'],
				},
			},
		},
		{
			displayName: 'Card Content(卡片内容)',
			name: 'card',
			type: 'json',
			default:
				'{"elements":[{"tag":"div","text":{"content":"This is the plain text","tag":"plain_text"}}],"header":{"template":"blue","title":{"content":"This is the title","tag":"plain_text"}}}',
			description: 'Only when the value of msg_type is interactive',
			displayOptions: {
				show: {
					msg_type: ['interactive'],
				},
			},
		},
		{
			displayName: 'Department IDs(部门 ID 列表)',
			name: 'department_ids',
			type: 'json',
			default: '[]',
			description: 'The list supports the department_id and open_department_id',
		},
		{
			displayName: 'Open IDs(用户 Open_id 列表)',
			name: 'open_ids',
			type: 'json',
			default: '[]',
			description: 'The list of user open IDs',
		},
		{
			displayName: 'User IDs(用户 User_id 列表)',
			name: 'user_ids',
			type: 'json',
			default: '[]',
			description: 'The list of user IDs',
		},
		{
			displayName: 'Union IDs(用户 Union_id 列表)',
			name: 'union_ids',
			type: 'json',
			default: '[]',
			description: 'The list of user union IDs',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const msg_type = this.getNodeParameter('msg_type', index) as string;
		const content = NodeUtils.getNodeJsonData(this, 'content', index, null) as object;
		const card = NodeUtils.getNodeJsonData(this, 'card', index, null) as object;
		const department_ids = NodeUtils.getNodeJsonData(this, 'department_ids', index) as [];
		const open_ids = NodeUtils.getNodeJsonData(this, 'open_ids', index) as [];
		const user_ids = NodeUtils.getNodeJsonData(this, 'user_ids', index) as [];
		const union_ids = NodeUtils.getNodeJsonData(this, 'union_ids', index) as [];

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/message/v4/batch_send/',
			body: {
				msg_type,
				...(msg_type === 'interactive' ? { card } : { content }),
				...(department_ids?.length ? { department_ids } : {}),
				...(open_ids?.length ? { open_ids } : {}),
				...(user_ids?.length ? { user_ids } : {}),
				...(union_ids?.length ? { union_ids } : {}),
			},
		});
		if (code !== 0) {
			throw new Error(`Batch send messages failed, code: ${code}, message: ${msg}`);
		}
		return data as IDataObject;
	},
} as ResourceOperation;
