import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';

export default {
	name: WORDING.GetUserInfo,
	value: OperationType.GetUserInfo,
	options: [
		DESCRIPTIONS.USER_ID_TYPE,
		{
			...DESCRIPTIONS.MEMBER_ID,
			displayName: WORDING.UserId,
			name: 'user_id',
			required: true,
		},
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.DEPARTMENT_ID_TYPE],
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const user_id = this.getNodeParameter('user_id', index, undefined, {
			extractValue: true,
		}) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index, 'open_id') as string;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const department_id_type = (options.department_id_type as string) || 'open_department_id';

		const {
			data: { user },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/contact/v3/users/${user_id}`,
			qs: {
				...(user_id_type && { user_id_type }),
				...(department_id_type && { department_id_type }),
			},
		});

		return user;
	},
} as ResourceOperation;
