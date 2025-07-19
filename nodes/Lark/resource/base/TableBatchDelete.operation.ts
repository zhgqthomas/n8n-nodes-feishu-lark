import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.BatchDeleteBaseTables,
	value: OperationType.BatchDeleteBaseTables,
	order: 191,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/batch_delete">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const app_token = this.getNodeParameter('app_token', index, undefined, {
			extractValue: true,
		}) as string;
		const body = this.getNodeParameter('body', index, {
			ensureType: 'json',
		}) as IDataObject;

		await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/batch_delete`,
			body,
		});

		const { table_ids } = body;

		if (Array.isArray(table_ids)) {
			return table_ids.map((table_id) => ({
				deleted: true,
				table_id,
			})); // Return an array of deleted table objects
		} else {
			throw new Error('Error: table_ids is not an array or is undefined.');
		}
	},
} as ResourceOperation;
