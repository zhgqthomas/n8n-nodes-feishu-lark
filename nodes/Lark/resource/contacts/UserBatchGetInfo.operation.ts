import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.BatchGetUserInfo,
	value: OperationType.BatchGetUserInfo,
	options: [
		{
			...DESCRIPTIONS.REQUEST_BODY,
			displayName: WORDING.Emails,
			required: false,
			name: 'emails',
			default: '[]',
			description: 'Up to 50 user emails can be input to be queried',
		},
		{
			...DESCRIPTIONS.REQUEST_BODY,
			displayName: WORDING.PhoneNumbers,
			required: false,
			name: 'mobiles',
			default: '[]',
			description: 'Up to 50 user mobile numbers can be input to be queried',
		},
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE, DESCRIPTIONS.INCLUDE_RESIGNED],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/contact-v3/user/batch_get_id">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const emails = this.getNodeParameter('emails', index, [], {
			ensureType: 'json',
		}) as [];
		const mobiles = this.getNodeParameter('mobiles', index, [], {
			ensureType: 'json',
		}) as [];
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const user_id_type = (options.user_id_type as string) || 'open_id';
		const include_resigned = (options.include_resigned as boolean) || false;

		const {
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

		return user_list as IDataObject[];
	},
} as ResourceOperation;
