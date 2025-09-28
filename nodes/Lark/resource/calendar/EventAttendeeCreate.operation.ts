import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';
import { isObject } from '../../../help/utils/validation';

export default {
	name: WORDING.CalendarEventAttendeeCreate,
	value: OperationType.CreateCalendarEventAttendee,
	order: 80,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ATTENDEES,
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
				DESCRIPTIONS.ADD_OPERATOR_TO_ATTENDEE,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/create">${WORDING.OpenDocument}</a>`,
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
		const attendees = NodeUtils.getArrayData<IDataObject>(this, 'attendees', index, isObject);
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const userIdType = (options.user_id_type as string) || 'open_id';
		const needNotification = options.need_notification as boolean;
		const instanceStartTimeAdmin = options.instance_start_time_admin as string;
		const isEnableAdmin = options.is_enable_admin as boolean;
		const addOperatorToAttendee = options.add_operator_to_attendee as boolean;

		const {
			data: { attendees: results },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/attendees`,
			qs: {
				...(userIdType && { user_id_type: userIdType }),
			},
			body: {
				attendees,
				...(needNotification && { need_notification: needNotification }),
				...(instanceStartTimeAdmin && { instance_start_time_admin: instanceStartTimeAdmin }),
				...(isEnableAdmin && { is_enable_admin: isEnableAdmin }),
				...(addOperatorToAttendee && {
					add_operator_to_attendee: addOperatorToAttendee,
				}),
			},
		});

		return results || [];
	},
} as ResourceOperation;
