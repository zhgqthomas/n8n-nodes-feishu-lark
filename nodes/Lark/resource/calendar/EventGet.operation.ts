import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CalendarEventGet,
	value: OperationType.GetCalendarEvent,
	order: 190,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ID,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				DESCRIPTIONS.NEED_MEETING_SETTINGS,
				DESCRIPTIONS.NEED_ATTENDEE,
				DESCRIPTIONS.MAX_ATTENDEE_NUM,
				DESCRIPTIONS.USER_ID_TYPE,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/get">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index, undefined, {
			extractValue: true,
		}) as string;
		const eventId = this.getNodeParameter('calendar_event_id', index, undefined, {
			extractValue: true,
		}) as string;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const needMeetingSettings = (options.need_meeting_settings as boolean) || false;
		const needAttendee = (options.need_attendee as boolean) || false;
		const maxAttendeeNum = (options.max_attendee_num as number) || 100;
		const userIdType = (options.user_id_type as string) || 'open_id';

		const {
			data: { event },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}`,
			qs: {
				need_meeting_settings: needMeetingSettings,
				need_attendee: needAttendee,
				max_attendee_num: maxAttendeeNum,
				user_id_type: userIdType,
			},
		});

		return event;
	},
} as ResourceOperation;
