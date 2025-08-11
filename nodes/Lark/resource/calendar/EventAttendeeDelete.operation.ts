import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CalendarEventAttendeeDelete,
	value: OperationType.DeleteCalendarEventAttendee,
	order: 80,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ATTENDEE_IDS,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				DESCRIPTIONS.USER_ID_TYPE,
				DESCRIPTIONS.NEED_NOTIFICATION,
				DESCRIPTIONS.INSTANCE_START_TIME_ADMIN,
				DESCRIPTIONS.IS_ENABLE_ADMIN,
				DESCRIPTIONS.CALENDAR_EVENT_DELETE_IDS,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/batch_delete">${WORDING.OpenDocument}</a>`,
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
		const attendeeIds = this.getNodeParameter('attendee_ids', index, undefined, {
			ensureType: 'json',
		}) as string[];
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const userIdType = (options.user_id_type as string) || 'open_id';
		const needNotification = (options.need_notification as boolean) !== false;
		const instanceStartTimeAdmin = options.instance_start_time_admin as string;
		const isEnableAdmin = options.is_enable_admin as boolean;
		const deleteIds = options.delete_ids as IDataObject[];

		await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/attendees/batch_delete`,
			qs: {
				...(userIdType && { user_id_type: userIdType }),
			},
			body: {
				...(attendeeIds?.length && { attendee_ids: attendeeIds }),
				...(needNotification !== undefined && { need_notification: needNotification }),
				...(instanceStartTimeAdmin && { instance_start_time_admin: instanceStartTimeAdmin }),
				...(isEnableAdmin !== undefined && { is_enable_admin: isEnableAdmin }),
				...(deleteIds?.length && { delete_ids: deleteIds }),
			},
		});

		return {};
	},
} as ResourceOperation;
