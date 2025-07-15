import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Create View | 新增视图',
	value: 'createView',
	order: 80,
	options: [
		{
			displayName: 'App Token(多维表格唯一标识)',
			name: 'app_token',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview#d03706e3',
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
			description:
				'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/create#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const view_name = this.getNodeParameter('view_name', index) as string;
		const view_type = this.getNodeParameter('view_type', index) as string;

		const {
			code,
			msg,
			data: { view },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views`,
			body: {
				view_name,
				view_type,
			},
		});

		if (code !== 0) {
			throw new Error(`Error creating base view: code:${code}, message:${msg}`);
		}

		return view;
	},
} as ResourceOperation;
