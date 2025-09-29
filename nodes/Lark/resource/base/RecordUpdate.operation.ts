import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.UpdateTableRecord,
	value: OperationType.UpdateTableRecord,
	order: 184,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_TABLE_ID,
		DESCRIPTIONS.TABLE_RECORD_ID,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE, DESCRIPTIONS.IGNORE_CONSISTENCY_CHECK],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index, undefined, {
			extractValue: true,
		}) as string;
		const table_id = this.getNodeParameter('table_id', index, undefined, {
			extractValue: true,
		}) as string;
		const body = NodeUtils.getObjectData(this, index);
		const options = this.getNodeParameter('options', index, {});
		const ignore_consistency_check = (options.ignore_consistency_check as boolean) || true;
		const user_id_type = (options.user_id_type as string) || 'open_id';
		const record_id = this.getNodeParameter('record_id', index) as string;

		const {
			data: { record },
		} = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`,
			qs: {
				user_id_type,
				ignore_consistency_check,
			},
			body,
		});
		return record;
	},
} as ResourceOperation;
