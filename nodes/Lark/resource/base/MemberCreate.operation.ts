import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CreateBaseRoleMember,
	value: OperationType.CreateBaseRoleMember,
	order: 169,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_ROLE_ID,
		DESCRIPTIONS.MEMBER_ID_TYPE,
		DESCRIPTIONS.MEMBER_ID,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/advanced-permission/app-role-member/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index, undefined, {
			extractValue: true,
		}) as string;
		const role_id = this.getNodeParameter('role_id', index, undefined, {
			extractValue: true,
		}) as string;
		const member_id_type = this.getNodeParameter('member_id_type', index, 'open_id') as string;
		const member_id = this.getNodeParameter('member_id', index, undefined, {
			extractValue: true,
		}) as string;

		await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/roles/${role_id}/members`,
			qs: {
				member_id_type,
			},
			body: {
				member_id,
			},
		});

		return {
			added: true,
			role_id,
			member_id,
		};
	},
} as ResourceOperation;
