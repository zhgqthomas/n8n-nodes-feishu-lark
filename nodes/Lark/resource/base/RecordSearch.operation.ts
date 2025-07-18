import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

const REQUEST_BODY = {
	automatic_fields: false,
	field_names: [] as string[],
	filter: {} as IDataObject,
};

export default {
	name: 'Search Records | 查询记录',
	value: 'searchRecords',
	order: 183,
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
			displayName: 'User ID Type(用户 ID 类型)',
			name: 'user_id_type',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getUserType',
			},
			default: 'open_id',
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
		},
		{
			displayName: 'Options(选项)',
			name: 'options',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			options: [
				{
					displayName: 'User ID Type(用户 ID 类型)',
					name: 'user_id_type',
					type: 'options',
					required: true,
					typeOptions: {
						loadOptionsMethod: 'getUserType',
					},
					default: 'open_id',
				},
			],
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/docs/bitable-v1/app-table-record/search">Open official document</a>',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const body = this.getNodeParameter('body', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const pageSize = this.getNodeParameter('page_size', index, 500) as number;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;

		const allRecords: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'POST',
				url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/search`,
				qs: {
					user_id_type,
					page_token: pageToken,
					page_size: pageSize,
				},
				body,
			});

			hasMore = has_more;
			pageToken = page_token;
			allRecords.push(...items);
		} while (!whetherPaging && hasMore);

		return allRecords as IDataObject[];
	},
} as ResourceOperation;
