import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

export default {
	name: 'Update Record | 更新记录',
	value: 'record:update',
	order: 70,
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
			displayName: 'Record ID(记录唯一标识)',
			name: 'record_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'User ID Type(用户 ID 类型)',
			name: 'user_id_type',
			type: 'options',
			options: [
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'Union ID', value: 'union_id' },
				{ name: 'User ID', value: 'user_id' },
			],
			default: 'open_id',
			description: 'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update#queryParams',
		},
		{
			displayName: 'Ignore Consistency Check(忽略一致性读写检查)',
			name: 'ignore_consistency_check',
			type: 'boolean',
			default: true,
		},
		{
			displayName: 'Request Body(请求体)',
			name: 'body',
			type: 'json',
			required: true,
			default: '{"fields":{}}',
			description: 'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const record_id = this.getNodeParameter('record_id', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const ignore_consistency_check = this.getNodeParameter(
			'ignore_consistency_check',
			index,
			true,
		) as boolean;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;

		const {
			code,
			msg,
			data: { record },
		} = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`,
			qs: {
				user_id_type,
				ignore_consistency_check,
			},
			body: body,
		});

		if (code !== 0) {
			throw new Error(`Error updating base record: code:${code}, message:${msg}`);
		}

		return record as IDataObject;
	},
} as ResourceOperation;
