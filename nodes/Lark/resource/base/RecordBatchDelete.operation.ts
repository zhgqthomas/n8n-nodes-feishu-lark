import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.BatchDeleteTableRecords,
	value: OperationType.BatchDeleteTableRecords,
	order: 178,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_TABLE_ID,
		{
			...DESCRIPTIONS.REQUEST_BODY,
			displayName: WORDING.TableRecordIdList,
			default: '[]',
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/batch_delete">${WORDING.OpenDocument}</a>`,
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
		const recordIds = this.getNodeParameter('body', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;

		if (!Array.isArray(recordIds)) {
			throw new NodeOperationError(this.getNode(), 'Record IDs must be an array.');
		}

		const {
			data: { records },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_delete`,
			body: {
				records: recordIds,
			},
		});

		return records;
	},
} as ResourceOperation;
