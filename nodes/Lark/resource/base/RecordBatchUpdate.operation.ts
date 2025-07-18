import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

const REQUEST_BODY = {
	records: [],
};

export default {
	name: 'Batch Update Record | 批量更新记录',
	value: 'batchUpdateRecords',
	order: 180,
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
				{
					displayName: 'Ignore Consistency Check(忽略一致性读写检查)',
					name: 'ignore_consistency_check',
					type: 'boolean',
					default: true,
					description: 'Whether to ignore consistency checks when creating records',
				},
			],
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/batch_update">Open official document</a>',
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
		const options = this.getNodeParameter('options', index, {});
		const ignore_consistency_check = options.ignore_consistency_check as boolean;

		const {
			data: { records },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/batch_update`,
			qs: {
				user_id_type,
				ignore_consistency_check,
			},
			body: body,
		});

		return records as IDataObject[];
	},
} as ResourceOperation;
