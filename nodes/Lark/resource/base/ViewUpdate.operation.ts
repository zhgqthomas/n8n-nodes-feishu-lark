import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

export default {
	name: 'Update View | 更新视图',
	value: 'updateView',
	order: 80,
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
			displayName: 'Table ID(数据表唯一标识)',
			name: 'table_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Base data table unique identifier',
		},
		{
			displayName: 'View ID(视图唯一标识)',
			name: 'view_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'View Name(视图名称)',
			name: 'view_name',
			type: 'string',
			default: '',
			description:
				'Name cannot contain special characters, must be no more than 100 characters long, cannot be empty, and must not contain these special symbols: [ ]',
		},
		{
			displayName: 'View Property(视图属性)',
			name: 'property',
			type: 'json',
			default: '{}',
			description: 'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/patch#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const view_id = this.getNodeParameter('view_id', index) as string;
		const view_name = this.getNodeParameter('view_name', index) as string;
		const property = NodeUtils.getNodeJsonData(this, 'property', index) as IDataObject;

		const body: Record<string, unknown> = {
			...(view_name && { view_name }),
			...(property && { property }),
		};

		const {
			code,
			msg,
			data: { view },
		} = await RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views/${view_id}`,
			body: body,
		});

		if (code !== 0) {
			throw new Error(`Error updating view: code:${code}, message:${msg}`);
		}

		return view;
	},
} as ResourceOperation;
