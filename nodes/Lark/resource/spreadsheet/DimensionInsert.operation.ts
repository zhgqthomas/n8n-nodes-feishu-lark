import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.InsertDimension,
	value: OperationType.InsertDimension,
	order: 170,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.MAJOR_DIMENSION,
		DESCRIPTIONS.START_INDEX,
		DESCRIPTIONS.END_INDEX,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				{
					displayName: 'Inherit Style(继承样式)',
					name: 'inheritStyle',
					type: 'options',
					options: [
						{
							name: 'BEFORE',
							value: 'BEFORE',
							description: 'Inherit the style of the starting position cell',
						},
						{
							name: 'AFTER',
							value: 'AFTER',
							description: 'Inherit the style of the ending position cell Style',
						},
					],
					default: 'BEFORE',
					description:
						'Whether the inserted blank row or column inherit the cell style in the table',
				},
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/sheet-rowcol/insert-rows-or-columns">${WORDING.OpenDocument}</a>`,
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

		const options = this.getNodeParameter('options', index, {});
		const inheritStyle = (options.inheritStyle as string) || '';

		const body: IDataObject = {
			dimension: {
				sheetId,
				majorDimension,
				startIndex,
				endIndex,
			},
			...(inheritStyle && { inheritStyle }),
		};

		await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/insert_dimension_range`,
			body,
		});

		return {
			success: true,
		};
	},
} as ResourceOperation;
