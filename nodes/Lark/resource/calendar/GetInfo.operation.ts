import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetCalendarInfo,
	value: OperationType.GetCalendarInfo,
	order: 197,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar/get">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index, undefined, {
			extractValue: true,
		}) as string;

		const { data } = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/calendar/v4/calendars/${calendarId}`,
		});

		return data as IDataObject;
	},
} as ResourceOperation;
