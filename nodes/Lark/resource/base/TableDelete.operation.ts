import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Delete Table | 删除数据表',
	value: 'deleteTable',
	order: 192,
	options: [
		{
			displayName: 'Base App(多维表格)',
			name: 'app_token',
			type: 'resourceLocator',
			default: { mode: 'list', value: '' },
			required: true,
			description: 'Need to have the permission to view all files in my space',
			modes: [
				{
					displayName: 'From List',
					name: 'list',
					type: 'list',
					placeholder: 'Select Base App',
					typeOptions: {
						searchListMethod: 'searchBitables',
						searchFilterRequired: false,
						searchable: false,
					},
				},
				{
					displayName: 'ID',
					name: 'id',
					type: 'string',
					placeholder: 'Enter App Token',
					default: '',
				},
			],
		},
		{
			displayName: 'Table(数据表)',
			name: 'table_id',
			type: 'resourceLocator',
			default: { mode: 'list', value: '' },
			required: true,
			description: 'Need to have the permission to view the Base above',
			modes: [
				{
					displayName: 'From List',
					name: 'list',
					type: 'list',
					placeholder: 'Select Table',
					typeOptions: {
						searchListMethod: 'searchTables',
						searchFilterRequired: false,
						searchable: false,
					},
				},
				{
					displayName: 'ID',
					name: 'id',
					type: 'string',
					placeholder: 'Enter Table ID',
					default: '',
				},
			],
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table/delete">Open official document</a>',
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

		await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}`,
		});

		return {
			deleted: true,
			table_id,
		};
	},
} as ResourceOperation;
