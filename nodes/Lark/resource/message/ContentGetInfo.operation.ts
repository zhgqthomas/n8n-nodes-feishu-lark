import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetMessageContentInfo,
	value: OperationType.GetMessageContentInfo,
	order: 194,
	options: [
		DESCRIPTIONS.MESSAGE_ID,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message/get">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const user_id_type = (options.user_id_type as string) || 'open_id';

		const {
			data: { items },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/im/v1/messages/${message_id}`,
			qs: {
				user_id_type,
			},
		});

		return items || [];
	},
} as ResourceOperation;
