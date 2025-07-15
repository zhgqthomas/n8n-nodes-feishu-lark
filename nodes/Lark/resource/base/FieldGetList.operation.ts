import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Get Fields | 列出字段',
	value: 'getFieldList',
	order: 60,
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
			displayName: 'View ID(视图唯一标识)',
			name: 'view_id',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Text Field as Array(字段描述数组形式返回)',
			name: 'text_field_as_array',
			type: 'boolean',
			default: false,
			description:
				'Whether to control the return format of field description (multi-line text format) data, true means return in array rich text form',
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
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const view_id = this.getNodeParameter('view_id', index) as string;
		const text_field_as_array = this.getNodeParameter('text_field_as_array', index) as boolean;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const pageSize = this.getNodeParameter('page_size', index, 100) as number;

		const allFields: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				code,
				msg,
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/fields`,
				qs: {
					text_field_as_array,
					...(view_id && { view_id }),
					page_token: pageToken,
					page_size: pageSize,
				},
			});

			if (code !== 0) {
				throw new Error(`Error fetching base fields: code:${code}, message:${msg}`);
			}

			hasMore = has_more;
			pageToken = page_token;
			allFields.push(...items);
		} while (!whetherPaging && hasMore);

		return allFields;
	},
} as ResourceOperation;
