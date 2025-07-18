import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';

const REQUEST_BODY = {
	record_ids: [],
};

export default {
	name: 'Get Records | 批量获取记录',
	value: 'getRecordList',
	order: 179,
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
			displayName: 'Request Body(请求体)',
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
				DESCRIPTIONS.USER_ID_TYPE,
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
			],
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/docs/bitable-v1/app-table-record/batch_get">Open official document</a>',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const body = this.getNodeParameter('body', index, {
			ensureType: 'json',
		}) as IDataObject;
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = options.user_id_type as string;
		const with_shared_url = options.with_shared_url as boolean;
		const automatic_fields = options.automatic_fields as boolean;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_get`,
			body: {
				record_ids: body.record_ids || [],
				user_id_type,
				with_shared_url,
				automatic_fields,
			},
		});

		return data;
	},
} as ResourceOperation;
