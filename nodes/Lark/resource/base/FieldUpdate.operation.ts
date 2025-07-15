import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

const REQUEST_BODY = {
	field_name: '',
	type: 1,
};

export default {
	name: 'Update field | 更新字段',
	value: 'updateField',
	order: 60,
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
			displayName: 'Field ID(字段唯一标识)',
			name: 'field_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Request Body(请求体)',
			name: 'body',
			type: 'json',
			required: true,
			default: JSON.stringify(REQUEST_BODY),
			description: 'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/update#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const field_id = this.getNodeParameter('field_id', index) as string;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;

		const {
			code,
			msg,
			data: { field },
		} = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/fields/${field_id}`,
			body: body,
		});

		if (code !== 0) {
			throw new Error(`Error updating field: code:${code}, message:${msg}`);
		}

		return field;
	},
} as ResourceOperation;
