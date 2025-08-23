import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.ReplaceCells,
	value: OperationType.ReplaceCells,
	order: 143,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.CELL_RANGE,
		DESCRIPTIONS.SEARCH_KEY,
		{
			displayName: 'Replacement(替换字符串)',
			name: 'replacement',
			type: 'string',
			required: true,
			default: '',
			description: 'The string to replace',
		},
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				DESCRIPTIONS.MATCH_CASE,
				DESCRIPTIONS.MATCH_ENTIRE_CELL,
				DESCRIPTIONS.SEARCH_BY_REGEX,
				DESCRIPTIONS.INCLUDE_FORMULAS,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/data-operation/replace">${WORDING.OpenDocument}</a>`,
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
		const find = this.getNodeParameter('search_key', index) as string;
		const replacement = this.getNodeParameter('replacement', index) as string;

		const options = this.getNodeParameter('options', index) as IDataObject;
		const matchCase = (options.matchCase as boolean) || false;
		const matchEntireCell = (options.matchEntireCell as boolean) || false;
		const searchByRegex = (options.searchByRegex as boolean) || false;
		const includeFormulas = (options.includeFormulas as boolean) || false;

		const body: IDataObject = {
			find_condition: {
				range: `${sheet_id}${cell_range}`,
				match_case: matchCase,
				match_entire_cell: matchEntireCell,
				search_by_regex: searchByRegex,
				include_formulas: includeFormulas,
			},
			find,
			replacement,
		};

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheet_id}/sheets/${sheet_id}/replace`,
			body,
		});

		return data;
	},
} as ResourceOperation;
