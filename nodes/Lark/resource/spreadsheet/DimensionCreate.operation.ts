import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CreateDimension,
	value: OperationType.CreateDimension,
	order: 161,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.MAJOR_DIMENSION,
		{
			displayName: 'Length(长度)',
			name: 'length',
			type: 'number',
			required: true,
			description: 'The number of rows or columns to be added. The value range is (0,5000].',
			default: 1,
			typeOptions: {
				minValue: 1,
				maxValue: 5000,
				numberPrecision: 0,
			},
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/sheet-rowcol/add-rows-or-columns">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheet_id = this.getNodeParameter('spreadsheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const sheetId = this.getNodeParameter('sheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const majorDimension = this.getNodeParameter('majorDimension', index, 'ROWS') as string;
		const length = this.getNodeParameter('length', index, 1) as number;

		const body: IDataObject = {
			dimension: {
				sheetId,
				majorDimension,
				length,
			},
		};

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/dimension_range`,
			body,
		});

		return data;
	},
} as ResourceOperation;
