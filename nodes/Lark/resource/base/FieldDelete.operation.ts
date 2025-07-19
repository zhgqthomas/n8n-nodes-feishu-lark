import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.DeleteTableField,
	value: OperationType.DeleteTableField,
	order: 174,
	options: [DESCRIPTIONS.BASE_APP_TOKEN, DESCRIPTIONS.BASE_TABLE_ID, DESCRIPTIONS.TABLE_FIELD_ID],

	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const table_id = this.getNodeParameter('table_id', index) as string;
		const field_id = this.getNodeParameter('field_id', index) as string;

		const { data } = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/fields/${field_id}`,
		});

		return data;
	},
} as ResourceOperation;
