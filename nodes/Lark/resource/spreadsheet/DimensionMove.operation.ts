import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.MoveDimension,
	value: OperationType.MoveDimension,
	order: 168,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.MAJOR_DIMENSION,
		DESCRIPTIONS.START_INDEX,
		DESCRIPTIONS.END_INDEX,
		{
			displayName: 'Destination Index(目标位置)',
			name: 'destination_index',
			type: 'number',
			default: 0,
			typeOptions: {
				minValue: 0,
				numberPrecision: 0,
			},
			description: 'The target position of the row or column to be moved',
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/sheet-rowcol/move_dimension">${WORDING.OpenDocument}</a>`,
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
		const major_dimension = this.getNodeParameter('majorDimension', index, 'ROWS') as string;
		const start_index = this.getNodeParameter('startIndex', index, 0) as number;
		const end_index = this.getNodeParameter('end_index', index, 0) as number;
		const destination_index = this.getNodeParameter('destination_index', index, 0) as number;

		const body: IDataObject = {
			source: {
				major_dimension,
				start_index,
				end_index,
			},
			destination_index,
		};

		await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheet_id}/sheets/${sheetId}/move_dimension`,
			body,
		});

		return {
			success: true,
		};
	},
} as ResourceOperation;
