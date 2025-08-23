import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetSheetList,
	value: OperationType.GetSheetList,
	order: 183,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/spreadsheet-sheet/query">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheetId = this.getNodeParameter('spreadsheet_id', index, undefined, {
			extractValue: true,
		}) as string;

		const {
			data: { sheets },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheetId}/sheets/query`,
		});

		return sheets;
	},
} as ResourceOperation;
