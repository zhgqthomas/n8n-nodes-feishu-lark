import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { OperationType } from '../../../help/type/enums';
import { WORDING } from '../../../help/wording';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.DeleteSheet,
	value: OperationType.DeleteSheet,
	order: 185,
	options: [DESCRIPTIONS.SPREADSHEET_ID, DESCRIPTIONS.SHEET_ID],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetId = this.getNodeParameter('spreadsheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const sheetId = this.getNodeParameter('sheet_id', index, undefined, {
			extractValue: true,
		}) as string;

		const body: IDataObject = {
			requests: [
				{
					deleteSheet: {
						sheetId,
					},
				},
			],
		};

		const {
			data: { replies },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheetId}/sheets_batch_update`,
			body,
		});

		const { deleteSheet } = replies[0];

		return deleteSheet;
	},
} as ResourceOperation;
