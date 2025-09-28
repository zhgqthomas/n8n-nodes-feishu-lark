import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.BatchDeleteBaseRoleMembers,
	value: OperationType.BatchDeleteBaseRoleMembers,
	order: 165,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_ROLE_ID,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/advanced-permission/app-role-member/batch_delete">${WORDING.OpenDocument}</a>`,
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
		const body = NodeUtils.getObjectData(this, index);

		await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/roles/${role_id}/members/batch_delete`,
			body,
		});

		return {
			status: 'success',
		};
	},
} as ResourceOperation;
