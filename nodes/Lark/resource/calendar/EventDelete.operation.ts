import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Delete Calendar Event | 删除日程',
	value: 'calendar:deleteEvent',
	order: 90,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/delete#pathParams',
		},
		{
			displayName: 'Event ID(日程 ID)',
			name: 'event_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/delete#pathParams',
		},
		{
			displayName: 'Need Notification(是否发送通知)',
			name: 'need_notification',
			type: 'boolean',
			default: true,
			description: 'Whether to send Bot notifications to event participants when deleting a event',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const needNotification = this.getNodeParameter('need_notification', index, true) as boolean;

		const { code, msg } = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}`,
			qs: {
				need_notification: needNotification.toString(),
			},
		});
		if (code !== 0) {
			throw new Error(`Error deleting calendar event, code ${code}, message: ${msg}`);
		}

		return {
			deleted: true,
			event_id: eventId,
			calendar_id: calendarId,
		};
	},
} as ResourceOperation;
