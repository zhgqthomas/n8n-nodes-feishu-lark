import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

const REQUEST_BODY = {
	automatic_fields: false,
	field_names: [] as string[],
	sort: [] as { field_name: string; desc: boolean }[],
	filter: {} as IDataObject,
};

export default {
	name: 'Search Records | 查询记录',
	value: 'searchRecords',
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
			description: 'Https://open.feishu.cn/document/docs/bitable-v1/app-table-record/search#queryParams',
		},
		{
			displayName: 'Whether Paging(是否分页)',
			name: 'whether_paging',
			type: 'boolean',
			default: false,
		},
		{
			displayName: 'Page Token(分页标记)',
			name: 'page_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
			displayOptions: {
				show: {
					whether_paging: [true],
				},
			},
		},
		{
			displayName: 'Page Size(分页大小)',
			name: 'page_size',
			type: 'number',
			default: 20,
			displayOptions: {
				show: {
					whether_paging: [true],
				},
			},
		},
		{
			displayName: 'Request Body(请求体JSON)',
			name: 'body',
			type: 'json',
			required: true,
			default: JSON.stringify(REQUEST_BODY),
			description: 'Https://open.feishu.cn/document/docs/bitable-v1/app-table-record/search#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		let pageToken = this.getNodeParameter('page_token', index) as string;
		const pageSize = this.getNodeParameter('page_size', index, 500) as number;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;

		const allRecords: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				code,
				msg,
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/search`,
				qs: {
					user_id_type,
					page_token: pageToken,
					page_size: pageSize,
				},
				body,
			});

			if (code !== 0) {
				throw new Error(`Error fetching base fields: code:${code}, message:${msg}`);
			}

			hasMore = has_more;
			pageToken = page_token;
			allRecords.push(...items);
		} while (!whetherPaging && hasMore);

		return allRecords as IDataObject[];
	},
} as ResourceOperation;
