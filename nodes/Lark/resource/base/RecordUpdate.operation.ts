import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';

const REQUEST_BODY = {
	fields: {},
};

export default {
	name: 'Update Record | 更新记录',
	value: 'updateRecord',
	order: 184,
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
			displayName: 'Record ID(记录唯一标识)',
			name: 'record_id',
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
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update">Open official document</a>',
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
		const ignore_consistency_check = options.ignore_consistency_check as boolean;
		const user_id_type = options.user_id_type as string;
		const record_id = this.getNodeParameter('record_id', index) as string;

		const {
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
		return record as IDataObject;
	},
} as ResourceOperation;
