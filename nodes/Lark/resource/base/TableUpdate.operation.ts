import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Update Table | 更新数据表',
	value: 'updateTable',
	order: 140,
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
			displayName: 'Table ID(数据表唯一标识)',
			name: 'table_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Base data table unique identifier',
		},
		{
			displayName: 'New Name(数据表新名称)',
			name: 'name',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/patch">Open official document</a>',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const name = this.getNodeParameter('name', index) as string;

		const { data } = await RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}`,
			body: {
				name,
			},
		});

		return {
			table_id,
			name: data.name,
		} as IDataObject;
	},
} as ResourceOperation;
