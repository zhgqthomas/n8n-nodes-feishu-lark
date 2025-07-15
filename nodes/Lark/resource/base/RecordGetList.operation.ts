import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

const REQUEST_BODY = {
	record_ids: [],
};

export default {
	name: 'Get Records | 批量获取记录',
	value: 'getRecordList',
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
			displayName: 'User ID Type(用户 ID 类型)',
			name: 'user_id_type',
			type: 'options',
			options: [
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'Union ID', value: 'union_id' },
				{ name: 'User ID', value: 'user_id' },
			],
			default: 'open_id',
			description: 'Https://open.feishu.cn/document/docs/bitable-v1/app-table-record/batch_get#requestBody',
		},
		{
			displayName: 'Whether to Return Shared Link(是否返回记录的分享链接)',
			name: 'with_shared_url',
			type: 'boolean',
			default: false,
		},
		{
			displayName: 'Whether to Return Automatic Fields(是否返回自动计算的字段)',
			name: 'automatic_fields',
			type: 'boolean',
			default: false,
		},
		{
			displayName: 'Request Body(请求体JSON)',
			name: 'body',
			type: 'json',
			required: true,
			default: JSON.stringify(REQUEST_BODY),
			description: 'Https://open.feishu.cn/document/docs/bitable-v1/app-table-record/batch_get#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const with_shared_url = this.getNodeParameter('with_shared_url', index) as boolean;
		const automatic_fields = this.getNodeParameter('automatic_fields', index) as boolean;
		const body = this.getNodeParameter('body', index) as string;

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_get`,
			body: {
				record_ids: JSON.parse(body).record_ids || [],
				user_id_type,
				with_shared_url,
				automatic_fields,
			},
		});

		if (code !== 0) {
			throw new Error(`Error fetching records: code:${code}, message:${msg}`);
		}

		return data;
	},
} as ResourceOperation;
