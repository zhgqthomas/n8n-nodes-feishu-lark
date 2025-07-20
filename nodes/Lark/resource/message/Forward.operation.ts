import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.ForwardMessage,
	value: OperationType.ForwardMessage,
	order: 197,
	options: [
		DESCRIPTIONS.MESSAGE_ID,
		DESCRIPTIONS.RECEIVE_ID_TYPE,
		DESCRIPTIONS.MEMBER_ID,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.REQUEST_ID],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message/forward">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const receive_id_type = this.getNodeParameter('receive_id_type', index) as string;
		const receive_id = this.getNodeParameter('member_id', index, undefined, {
			extractValue: true,
		}) as string;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const uuid = options.request_id as string | undefined;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages/${message_id}/forward`,
			qs: { receive_id_type, ...(uuid && { uuid }) },
			body: { receive_id },
		});

		return data;
	},
} as ResourceOperation;
