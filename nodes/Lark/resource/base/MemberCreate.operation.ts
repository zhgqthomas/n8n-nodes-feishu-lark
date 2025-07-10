import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Create Role Member | 新增协作者',
	value: 'member:create',
	order: 100,
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
			displayName: 'Role ID(自定义角色唯一标识)',
			name: 'role_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Member ID Type(协作者 ID 类型)',
			name: 'member_id_type',
			type: 'options',
			options: [
				{ name: 'Chat ID', value: 'chat_id' },
				{ name: 'Department ID', value: 'department_id' },
				{ name: 'Open Department ID', value: 'open_department_id' },
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'Union ID', value: 'union_id' },
				{ name: 'User ID', value: 'user_id' },
			],
			default: 'open_id',
			description:
				'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/advanced-permission/app-role-member/create#queryParams',
		},
		{
			displayName: 'Member ID(自定义角色协作者 ID)',
			name: 'member_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/docs/bitable-v1/advanced-permission/app-role-member/create#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const role_id = this.getNodeParameter('role_id', index) as string;
		const member_id_type = this.getNodeParameter('member_id_type', index, 'open_id') as string;
		const member_id = this.getNodeParameter('member_id', index) as string;

		const { code, msg } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/roles/${role_id}/members`,
			qs: {
				member_id_type,
			},
			body: {
				member_id,
			},
		});

		if (code !== 0) {
			throw new Error(`Error create role member: code:${code}, message:${msg}`);
		}

		return {
			member_added: true,
		};
	},
} as ResourceOperation;
