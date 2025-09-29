import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.BatchCreateTableRecords,
	value: OperationType.BatchCreateTableRecords,
	order: 181,
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
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/batch_create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const app_token = this.getNodeParameter('app_token', index, undefined, {
			extractValue: true,
		}) as string;
		const table_id = this.getNodeParameter('table_id', index, undefined, {
			extractValue: true,
		}) as string;
		const body = NodeUtils.getObjectData(this, index);
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = (options.user_id_type as string) || 'open_id';
		const ignore_consistency_check = (options.ignore_consistency_check as boolean) || true;
		const client_token = options.request_id as string | undefined;

		const {
			data: { records },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_create`,
			qs: {
				user_id_type,
				ignore_consistency_check,
				...(client_token && { client_token }),
			},
			body,
		});

		return records;
	},
} as ResourceOperation;
