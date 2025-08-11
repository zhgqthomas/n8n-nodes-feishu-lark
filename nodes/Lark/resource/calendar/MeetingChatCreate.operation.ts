import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CalendarMeetingChatCreate,
	value: OperationType.CreateCalendarMeetingChat,
	order: 70,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ID,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-meeting_chat/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index, undefined, {
			extractValue: true,
		}) as string;
		const eventId = this.getNodeParameter('event_id', index, undefined, {
			extractValue: true,
		}) as string;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/meeting_chat`,
		});

		return data || {};
	},
} as ResourceOperation;
