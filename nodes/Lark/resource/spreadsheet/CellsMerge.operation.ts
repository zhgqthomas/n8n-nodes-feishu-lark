import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { OperationType } from '../../../help/type/enums';
import { WORDING } from '../../../help/wording';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.MergeCells,
	value: OperationType.MergeCells,
	order: 146,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.CELL_RANGE,
		{
			displayName: 'Merge Type(合并类型)',
			name: 'mergeType',
			type: 'options',
			options: [
				{ name: 'Merge All Cells', value: 'MERGE_ALL' },
				{ name: 'Merge by Row', value: 'MERGE_ROWS' },
				{ name: 'Merge by Column', value: 'MERGE_COLUMNS' },
			],
			required: true,
			default: 'MERGE_ALL',
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/data-operation/merge-cells">${WORDING.OpenDocument}</a>`,
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
		const cellRange = this.getNodeParameter('range', index, '') as string;
		const mergeType = this.getNodeParameter('mergeType', index) as string;

		const body: IDataObject = {
			range: `${sheetId}${cellRange}`,
			mergeType,
		};

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/merge_cells`,
			body,
		});

		return {
			merged: true,
			sheet_id: sheetId,
			...data,
		};
	},
} as ResourceOperation;
