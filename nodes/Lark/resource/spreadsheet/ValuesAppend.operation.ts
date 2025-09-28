import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';
import { isArray } from '../../../help/utils/validation';

export default {
	name: WORDING.ValuesAppend,
	value: OperationType.ValuesAppend,
	order: 129,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.CELL_RANGE,
		DESCRIPTIONS.SHEET_VALUES,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				{
					displayName: 'Insert Data Option(插入数据选项)',
					name: 'insertDataOption',
					type: 'options',
					options: [
						{
							name: 'Overwrite(覆盖)',
							value: 'OVERWRITE',
						},
						{
							name: 'Insert Rows(插入行)',
							value: 'INSERT_ROWS',
						},
					],
					default: 'OVERWRITE',
					description: 'Specify the way to append data',
				},
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/data-operation/append-data">${WORDING.OpenDocument}</a>`,
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
		const values = NodeUtils.getArrayData(this, 'values', index, isArray);

		const options = this.getNodeParameter('options', index) as IDataObject;
		const insertDataOption = (options.insertDataOption as string) || 'OVERWRITE';

		const body: IDataObject = {
			valueRange: {
				range: `${sheet_id}${cell_range}`,
				values,
			},
		};

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/values_append`,
			qs: {
				insertDataOption,
			},
			body,
		});

		return data;
	},
} as ResourceOperation;
