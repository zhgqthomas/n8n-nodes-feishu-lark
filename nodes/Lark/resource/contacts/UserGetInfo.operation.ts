import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Get User Info | 获取用户信息',
	value: 'getUserInfo',
	options: [
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
			description: 'Https://open.feishu.cn/document/server-docs/contact-v3/user/get#queryParams',
		},
		{
			displayName: 'User ID(用户ID)',
			name: 'user_id',
			type: 'string',
			required: true,
			default: '',
			description: 'The ID type should be consistent with User ID Type',
		},
		{
			displayName: 'Department ID Type(部门ID类型)',
			name: 'department_id_type',
			type: 'options',
			options: [
				{ name: 'Department ID', value: 'department_id' },
				{ name: 'Open Department ID', value: 'open_department_id' },
			],
			description: 'Https://open.feishu.cn/document/server-docs/contact-v3/department/field-overview#23857fe0',
			default: 'open_department_id',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const user_id = this.getNodeParameter('user_id', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const department_id_type = this.getNodeParameter('department_id_type', index) as string;

		const {
			code,
			msg,
			data: { user },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/contact/v3/users/${user_id}`,
			qs: {
				...(user_id_type && { user_id_type }),
				...(department_id_type && { department_id_type }),
			},
		});

		if (code !== 0) {
			throw new Error(`Error getting user info: code:${code}, message:${msg}`);
		}

		return user;
	},
} as ResourceOperation;
