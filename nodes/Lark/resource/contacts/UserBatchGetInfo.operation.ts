import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';
import { isString } from '../../../help/utils/validation';

export default {
	name: WORDING.BatchGetUserInfo,
	value: OperationType.BatchGetUserInfo,
	options: [
		{
			displayName: WORDING.Emails,
			name: 'emails',
			type: 'string',
			default: '',
			hint: '["zhangsan@z.com"]',
			ignoreValidationDuringExecution: true,
			description: 'Up to 50 user emails can be input to be queried',
		},
		{
			displayName: WORDING.PhoneNumbers,
			name: 'mobiles',
			type: 'string',
			default: '',
			hint: '["13011111111"]',
			ignoreValidationDuringExecution: true,
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
		let emails = this.getNodeParameter('emails', index, undefined);
		if (emails) {
			emails = NodeUtils.getArrayData<string>(this, 'emails', index, isString);
		}

		let mobiles = this.getNodeParameter('mobiles', index, undefined);
		if (mobiles) {
			mobiles = NodeUtils.getArrayData<string>(this, 'mobiles', index, isString);
		}

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
				...(emails && { emails }),
				...(mobiles && { mobiles }),
				include_resigned,
			},
		});

		return user_list as IDataObject[];
	},
} as ResourceOperation;
