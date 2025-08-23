import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.ValuesRead,
	value: OperationType.ValuesRead,
	order: 127,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.CELL_RANGE,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				{
					displayName: 'Value Render Option(值渲染选项)',
					name: 'valueRenderOption',
					type: 'options',
					options: [
						{ name: 'To String(返回纯文本值)', value: 'ToString' },
						{ name: 'Formula(返回公式)', value: 'Formula' },
						{ name: 'FormattedValue(计算并格式化单元格)', value: 'FormattedValue' },
						{ name: 'UnformattedValue(计算但不对单元格进行格式化)', value: 'UnformattedValue' },
					],
					default: 'ToString',
				},
				{
					displayName: 'Date Time Render Option(日期时间渲染选项)',
					name: 'dateTimeRenderOption',
					type: 'options',
					options: [{ name: 'FormattedString', value: 'FormattedString' }],
					default: 'FormattedString',
					description: 'Specifies the format of cell data that is of date, time, or date-time type',
				},
				DESCRIPTIONS.USER_ID_TYPE,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/data-operation/reading-a-single-range">${WORDING.OpenDocument}</a>`,
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

		const options = this.getNodeParameter('options', index) as IDataObject;
		const valueRenderOption = (options.valueRenderOption as string) || '';
		const dateTimeRenderOption = (options.dateTimeRenderOption as string) || '';
		const userIdType = (options.userIdType as string) || '';

		const { data } = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/values/${sheet_id}${cell_range}`,
			qs: {
				...(valueRenderOption && { valueRenderOption }),
				...(dateTimeRenderOption && { dateTimeRenderOption }),
				...(userIdType && { user_id_type: userIdType }),
			},
		});

		return data;
	},
} as ResourceOperation;
