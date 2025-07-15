import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Delete Event Attendees | 删除日程参与人',
	value: 'deleteEventAttendees',
	order: 80,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/batch_delete#pathParams',
		},
		{
			displayName: 'Event ID(日程 ID)',
			name: 'event_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/batch_delete#pathParams',
		},
		{
			displayName: 'User ID Type(用户 ID 类型)',
			name: 'user_id_type',
			type: 'options',
			options: [
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'Union ID', value: 'union_id' },
				{ name: 'User ID', value: 'user_id' },
			],
			default: 'open_id',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/create#queryParams',
		},
		{
			displayName: 'Need Notification(是否发送通知)',
			name: 'need_notification',
			type: 'boolean',
			default: true,
			description: 'Whether to send bot notifications to invitees',
		},
		{
			displayName: 'Instance Start Time Admin(重复日程实例时间戳)',
			name: 'instance_start_time_admin',
			type: 'string',
			default: '',
			description:
				'This parameter is only used to modify a event instance in a repeating event. This field does not need to be filled in for non-repeating events.',
		},
		{
			displayName: 'Enable Admin(启用会议室管理员身份)',
			name: 'is_enable_admin',
			type: 'boolean',
			default: false,
			description:
				'Whether to enable the meeting room administrator status (you need to set a member as the meeting room administrator in the management background first)',
		},
		{
			displayName: 'Attendee IDs(需删除的参与人 ID 列表)',
			name: 'attendee_ids',
			type: 'json',
			default: '[]',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/batch_delete#requestBody',
		},
		{
			displayName: 'Delete IDs(参与人类型对应的 ID 列表)',
			name: 'delete_ids',
			type: 'json',
			default: '[]',
			description:
				'The ID corresponding to the invitee type, which is a supplementary field to the attendee_ids field',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const attendeeIds = NodeUtils.getNodeJsonData(this, 'attendee_ids', index) as string[];
		const deleteIds = NodeUtils.getNodeJsonData(this, 'delete_ids', index) as IDataObject[];
		const needNotification = this.getNodeParameter('need_notification', index, true) as boolean;
		const instanceStartTimeAdmin = this.getNodeParameter(
			'instance_start_time_admin',
			index,
			'',
		) as string;
		const isEnableAdmin = this.getNodeParameter('is_enable_admin', index, false) as boolean;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const { code, msg } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/attendees/batch_delete`,
			qs: {
				user_id_type: userIdType || undefined,
			},
			body: {
				need_notification: needNotification,
				is_enable_admin: isEnableAdmin,
				attendee_ids: attendeeIds?.length ? attendeeIds : undefined,
				delete_ids: deleteIds?.length ? deleteIds : undefined,
				instance_start_time_admin: instanceStartTimeAdmin || undefined,
			},
		});
		if (code !== 0) {
			throw new Error(`Delete Calendar Event Attendees Error, code: ${code}, message: ${msg}`);
		}

		return {};
	},
} as ResourceOperation;
