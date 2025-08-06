import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CalendarEventDelete,
	value: OperationType.DeleteCalendarEvent,
	order: 191,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ID,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.NEED_NOTIFICATION],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/delete">${WORDING.OpenDocument}</a>`,
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
		const needNotification = (options.need_notification as boolean) || true;

		await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}`,
			qs: {
				need_notification: needNotification.toString(),
			},
		});

		return {
			deleted: true,
			event_id: eventId,
			calendar_id: calendarId,
		};
	},
} as ResourceOperation;
