import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Create View | 新增视图',
	value: 'createView',
	order: 190,
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
			displayName: 'View Name(视图名称)',
			name: 'view_name',
			type: 'string',
			required: true,
			default: '',
			description:
				'Name cannot contain special characters, must be no more than 100 characters long, cannot be empty, and must not contain these special symbols: [ ]',
		},
		{
			displayName: 'View Type(视图类型)',
			name: 'view_type',
			required: true,
			type: 'options',
			options: [
				{
					name: 'Form View(表单视图)',
					value: 'form',
				},
				{
					name: 'Gallery View(画册视图)',
					value: 'gallery',
				},
				{
					name: 'Gantt View(甘特视图)',
					value: 'gantt',
				},
				{
					name: 'Grid View(表格视图)',
					value: 'grid',
				},
				{
					name: 'Kanban View(看板视图)',
					value: 'kanban',
				},
			],
			default: 'grid',
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/create">Open official document</a>',
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
		const view_name = this.getNodeParameter('view_name', index) as string;
		const view_type = this.getNodeParameter('view_type', index, 'grid') as string;

		const {
			data: { view },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views`,
			body: {
				view_name,
				view_type,
			},
		});

		return view;
	},
} as ResourceOperation;
