import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetSpreadsheetInfo,
	value: OperationType.GetSpreadsheetInfo,
	order: 198,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/spreadsheet/get">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheet_id = this.getNodeParameter('spreadsheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = (options.user_id_type as string) || 'open_id';

		const {
			data: { spreadsheet },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/sheets/v3/spreadsheets/${spreadsheet_id}`,
			qs: {
				user_id_type,
			},
		});

		return spreadsheet;
	},
} as ResourceOperation;
