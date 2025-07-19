import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.UpdateBaseRole,
	value: OperationType.UpdateBaseRole,
	order: 172,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_ROLE_ID,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/docs/bitable-v1/advanced-permission/app-role/update-2">${WORDING.OpenDocument}</a>`,
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
		const body = this.getNodeParameter('body', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;

		const {
			data: { role },
		} = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/base/v2/apps/${app_token}/roles/${role_id}`,
			body,
		});

		return role;
	},
} as ResourceOperation;
