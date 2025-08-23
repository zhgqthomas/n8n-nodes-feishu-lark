import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.UpdateDimension,
	value: OperationType.UpdateDimension,
	order: 169,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.MAJOR_DIMENSION,
		{
			...DESCRIPTIONS.START_INDEX,
			default: 1,
			typeOptions: {
				minValue: 1,
				numberPrecision: 0,
			},
		},
		{
			...DESCRIPTIONS.END_INDEX,
			default: 1,
			typeOptions: {
				minValue: 1,
				numberPrecision: 0,
			},
		},
		{
			displayName: 'Visible(是否显示)',
			name: 'visible',
			type: 'boolean',
			default: true,
			description: 'Whether to display the row or column',
		},
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				{
					displayName: 'Fixed Size(行高或列宽)',
					name: 'fixedSize',
					type: 'number',
					default: 10,
					typeOptions: {
						minValue: 1,
						numberPrecision: 0,
					},
					description:
						'Row/Column size. The units are in seconds. When fixedSize is set to 0, it is equivalent to hiding the row or column',
				},
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/sheet-rowcol/update-rows-or-columns">${WORDING.OpenDocument}</a>`,
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
		const startIndex = this.getNodeParameter('startIndex', index, 0) as number;
		const endIndex = this.getNodeParameter('endIndex', index, 1) as number;
		const visible = this.getNodeParameter('visible', index, true) as boolean;

		const options = this.getNodeParameter('options', index, {});
		const fixedSize = (options.fixedSize as number) || undefined;

		const body: IDataObject = {
			dimension: {
				sheetId,
				majorDimension,
				startIndex,
				endIndex,
			},
			dimensionProperties: {
				visible,
				...(fixedSize !== undefined && { fixedSize }),
			},
		};

		await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/dimension_range`,
			body,
		});

		return {
			success: true,
		};
	},
} as ResourceOperation;
