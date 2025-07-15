import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Batch Get User Info | 拼量获取用户信息',
	value: 'batchGetUserInfo',
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
			description: 'Https://open.feishu.cn/document/server-docs/contact-v3/user/batch_get_id#queryParams',
		},
		{
			displayName: 'Emails(用户邮箱列表)',
			name: 'emails',
			type: 'json',
			default: '[]',
			description: 'Up to 50 user emails can be input to be queried',
		},
		{
			displayName: 'Phone Numbers(用户手机号列表)',
			name: 'mobiles',
			type: 'json',
			default: '[]',
			description: 'Up to 50 user mobile numbers can be input to be queried',
		},
		{
			displayName: 'Include Resigned(是否包含离职员工)',
			name: 'include_resigned',
			type: 'boolean',
			description: 'Whether the query results contain user information of resigned employees',
			default: false,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const emails = this.getNodeParameter('emails', index, [], {
			ensureType: 'json',
		}) as [];
		const mobiles = this.getNodeParameter('mobiles', index, [], {
			ensureType: 'json',
		}) as [];
		const include_resigned = this.getNodeParameter('include_resigned', index) as boolean;

		const {
			code,
			msg,
			data: { user_list },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/contact/v3/users/batch_get_id',
			qs: {
				user_id_type,
			},
			body: {
				emails: emails.length ? emails : undefined,
				mobiles: mobiles.length ? mobiles : undefined,
				include_resigned,
			},
		});
		if (code !== 0) {
			throw new Error(`Error getting user IDs: code:${code}, message:${msg}`);
		}

		return user_list as IDataObject[];
	},
} as ResourceOperation;
