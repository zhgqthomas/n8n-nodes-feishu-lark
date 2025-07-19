import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.UpdateTableView,
	value: OperationType.UpdateTableView,
	order: 189,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_TABLE_ID,
		DESCRIPTIONS.TABLE_VIEW_ID,
		DESCRIPTIONS.TABLE_VIEW_NAME,
		DESCRIPTIONS.TABLE_VIEW_PROPERTY,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/patch">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const view_id = this.getNodeParameter('view_id', index) as string;
		const view_name = this.getNodeParameter('view_name', index) as string;
		const property = this.getNodeParameter('property', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;

		const {
			data: { view },
		} = await RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views/${view_id}`,
			body: {
				...(view_name && { view_name }),
				...(property && { property }),
			},
		});

		return view;
	},
} as ResourceOperation;
