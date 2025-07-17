import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

const REQUEST_BODY = {
	table_ids: [],
};

export default {
	name: 'Batch Delete Table | 批量删除数据表',
	value: 'batchDeleteTables',
	order: 110,
	options: [
		{
			displayName: 'App Token(多维表格唯一标识)',
			name: 'app_token',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Request Body(请求体)',
			name: 'body',
			type: 'json',
			required: true,
			default: JSON.stringify(REQUEST_BODY),
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/batch_delete">Open official document</a>',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;

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
