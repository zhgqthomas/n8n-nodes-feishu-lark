import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';
import { OperationType } from '../../../help/type/enums';
import { WORDING } from '../../../help/wording';

export default {
	name: WORDING.CreateTableRecord,
	value: OperationType.CreateTableRecord,
	order: 185,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_TABLE_ID,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				DESCRIPTIONS.USER_ID_TYPE,
				DESCRIPTIONS.IGNORE_CONSISTENCY_CHECK,
				DESCRIPTIONS.REQUEST_ID,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index, undefined, {
			extractValue: true,
		}) as string;
		const table_id = this.getNodeParameter('table_id', index, undefined, {
			extractValue: true,
		}) as string;
		const body = this.getNodeParameter('body', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = options.user_id_type as string;
		const ignore_consistency_check = options.ignore_consistency_check as boolean;
		const client_token = options.request_id as string;

		const {
			data: { record },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`,
			qs: {
				...(user_id_type && { user_id_type }),
				...(client_token && { client_token }),
				ignore_consistency_check,
			},
			body: body,
		});

		return record as IDataObject;
	},
} as ResourceOperation;
