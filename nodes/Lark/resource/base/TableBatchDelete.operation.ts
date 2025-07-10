import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

const REQUEST_BODY = {
	table_ids: [],
};

export default {
	name: 'Batch Delete Table | 批量删除数据表',
	value: 'table:batchDelete',
	order: 90,
	options: [
		{
			displayName: 'App Token(多维表格唯一标识)',
			name: 'app_token',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview#d03706e3',
		},
		{
			displayName: 'Request Body(请求体)',
			name: 'body',
			type: 'json',
			required: true,
			default: JSON.stringify(REQUEST_BODY),
			description: 'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/batch_delete#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;

		const { code, msg } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/batch_delete`,
			body,
		});

		if (code !== 0) {
			throw new Error(`Error deleting tables: code:${code}, message:${msg}`);
		}

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
