import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.SendMessage,
	value: OperationType.SendMessage,
	order: 200,
	options: [
		DESCRIPTIONS.RECEIVE_ID_TYPE,
		{
			...DESCRIPTIONS.MEMBER_ID,
			displayName: 'Receive ID(接收者ID)',
			name: 'receive_id',
		},
		DESCRIPTIONS.MESSAGE_TYPE,
		DESCRIPTIONS.MESSAGE_CONTENT,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.REQUEST_ID],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const receive_id_type = this.getNodeParameter('receive_id_type', index, 'open_id') as string;
		const receive_id = this.getNodeParameter('receive_id', index, undefined, {
			extractValue: true,
		}) as string;
		const msg_type = this.getNodeParameter('msg_type', index, 'text') as string;
		const content = this.getNodeParameter('content', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const uuid = options.request_id as string | undefined;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages`,
			qs: {
				receive_id_type,
			},
			body: {
				receive_id,
				msg_type,
				content: JSON.stringify(content),
				...(uuid && { uuid }),
			},
		});

		return data;
	},
} as ResourceOperation;
