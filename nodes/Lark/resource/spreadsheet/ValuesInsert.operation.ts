import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.ValuesInsert,
	value: OperationType.ValuesInsert,
	order: 130,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.CELL_RANGE,
		DESCRIPTIONS.ARRAY_VALUES,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/data-operation/prepend-data">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheet_id = this.getNodeParameter('spreadsheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const sheet_id = this.getNodeParameter('sheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const cell_range = this.getNodeParameter('range', index, '') as string;
		const values = this.getNodeParameter('array_values', index, undefined, {
			ensureType: 'json',
		}) as IDataObject[];

		const body: IDataObject = {
			valueRange: {
				range: `${sheet_id}${cell_range}`,
				values,
			},
		};

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/values_prepend`,
			body,
		});

		return data;
	},
} as ResourceOperation;
