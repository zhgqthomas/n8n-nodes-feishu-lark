import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.BatchCreateBaseTables,
	value: OperationType.BatchCreateBaseTable,
	order: 195,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/batch_create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const body = this.getNodeParameter('body', index, {
			ensureType: 'json',
		}) as IDataObject;
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = options.user_id_type as string;

		const {
			data: { table_ids },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/batch_create`,
			qs: {
				user_id_type,
			},
			body,
		});

		return table_ids.map((table_id: string) => ({
			table_id,
		})) as IDataObject[];
	},
} as ResourceOperation;
