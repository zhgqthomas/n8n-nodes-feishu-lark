import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';

export default {
	name: WORDING.GetTableRecordList,
	value: OperationType.GetTableRecordList,
	order: 179,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_TABLE_ID,
		{
			...DESCRIPTIONS.REQUEST_BODY,
			displayName: WORDING.TableRecordIdList,
			default: '[]',
		},
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				DESCRIPTIONS.USER_ID_TYPE,
				DESCRIPTIONS.WITH_SHARED_URL,
				DESCRIPTIONS.AUTOMATIC_FIELDS,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/docs/bitable-v1/app-table-record/batch_get">${WORDING.OpenDocument}</a>`,
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
		const recordIds = this.getNodeParameter('body', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = options.user_id_type as string || 'open_id';
		const with_shared_url = options.with_shared_url as boolean || false;
		const automatic_fields = options.automatic_fields as boolean || false;

		if (!Array.isArray(recordIds)) {
			throw new NodeOperationError(this.getNode(), 'Record IDs must be an array.');
		}

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_get`,
			body: {
				record_ids: recordIds || [],
				user_id_type,
				with_shared_url,
				automatic_fields,
			},
		});

		return data;
	},
} as ResourceOperation;
