import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Create Event Invitees | 添加日程参与人',
	value: 'createEventInvitees',
	order: 80,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/create#pathParams',
		},
		{
			displayName: 'Event ID(日程 ID)',
			name: 'event_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/create#pathParams',
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
			displayName: 'Add Operator to Attendee(添加操作人为参与人)',
			name: 'add_operator_to_attendee',
			type: 'boolean',
			default: false,
			description: 'Whether to add the meeting room contact (operate_id) to the schedule invitees',
		},
		{
			displayName: 'Attendees List(参与人列表)',
			name: 'attendees',
			type: 'json',
			default: '[]',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/create#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const attendees = NodeUtils.getNodeJsonData(this, 'attendees', index) as IDataObject[];
		const needNotification = this.getNodeParameter('need_notification', index, true) as boolean;
		const instanceStartTimeAdmin = this.getNodeParameter(
			'instance_start_time_admin',
			index,
			'',
		) as string;
		const isEnableAdmin = this.getNodeParameter('is_enable_admin', index, false) as boolean;
		const addOperatorToAttendee = this.getNodeParameter(
			'add_operator_to_attendee',
			index,
			false,
		) as boolean;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const {
			code,
			msg,
			data: { attendees: results },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/attendees`,
			qs: {
				user_id_type: userIdType,
			},
			body: {
				attendees: attendees?.length > 0 ? attendees : undefined,
				need_notification: needNotification,
				instance_start_time_admin: instanceStartTimeAdmin || undefined,
				is_enable_admin: isEnableAdmin,
				add_operator_to_attendee: addOperatorToAttendee,
			},
		});
		if (code !== 0) {
			throw new Error(`Create Calendar Event Invitees Error, code: ${code}, message: ${msg}`);
		}

		return results as IDataObject[];
	},
} as ResourceOperation;
