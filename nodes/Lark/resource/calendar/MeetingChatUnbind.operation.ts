import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CalendarMeetingChatUnbind,
	value: OperationType.UnbindCalendarMeetingChat,
	order: 70,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ID,
		DESCRIPTIONS.MEETING_CHAT_ID,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-meeting_chat/delete">${WORDING.OpenDocument}</a>`,
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
		const meetingChatId = this.getNodeParameter('meeting_chat_id', index, undefined, {
			extractValue: true,
		}) as string;

		await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/meeting_chat`,
			qs: {
				...(meetingChatId && { meeting_chat_id: meetingChatId }),
			},
		});

		return {};
	},
} as ResourceOperation;
