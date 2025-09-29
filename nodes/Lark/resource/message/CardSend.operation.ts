import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import { OBJECT_JSON } from '../../../help/description/base';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.SendMessageCard,
	value: OperationType.SendMessageCard,
	order: 182,
	options: [
		{
			displayName: `Only work with Tenant Access Token`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
		DESCRIPTIONS.CHAT_ID,
		{
			displayName: 'User ID Type(用户 ID 类型)',
			name: 'user_id_type',
			type: 'options',
			options: [
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'User ID', value: 'user_id' },
				{ name: 'Email', value: 'email' },
			],
			default: 'open_id',
		},
		{
			displayName: 'ID',
			name: 'id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Message Card(消息卡片)',
			...OBJECT_JSON,
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message-card/send-message-cards-that-are-only-visible-to-certain-people">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const chat_id = this.getNodeParameter('chat_id', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const id = this.getNodeParameter('id', index, '') as string;
		const content = NodeUtils.getObjectData(this, index);

		const openId = user_id_type === 'open_id' ? id : undefined;
		const userId = user_id_type === 'user_id' ? id : undefined;
		const email = user_id_type === 'email' ? id : undefined;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/ephemeral/v1/send`,
			body: {
				chat_id,
				...(openId && { open_id: openId }),
				...(userId && { user_id: userId }),
				...(email && { email }),
				msg_type: 'interactive',
				card: content,
			},
		});

		return data;
	},
} as ResourceOperation;
