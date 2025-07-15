import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Get Calendar Event | 获取日程',
	value: 'getEvent',
	order: 90,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/get#pathParams',
		},
		{
			displayName: 'Event ID(日程 ID)',
			name: 'event_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/get#pathParams',
		},
		{
			displayName: 'Need Meeting Settings(是否需要返回飞书视频会议(VC)会前设置)',
			name: 'need_meeting_settings',
			type: 'boolean',
			default: false,
			description: 'Whether the meeting type (vc_type) of the event needs to be vc',
		},
		{
			displayName: 'Need Attendee(是否需要返回参与人信息)',
			name: 'need_attendee',
			type: 'boolean',
			default: false,
		},
		{
			displayName: 'Max Attendee Number(返回的最大参与人数量)',
			name: 'max_attendee_num',
			type: 'number',
			default: 10,
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
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/get#queryParams',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const needMeetingSettings = this.getNodeParameter(
			'need_meeting_settings',
			index,
			false,
		) as boolean;
		const needAttendee = this.getNodeParameter('need_attendee', index, false) as boolean;
		const maxAttendeeNum = this.getNodeParameter('max_attendee_num', index, 10) as number;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const qs: IDataObject = {
			need_meeting_settings: needMeetingSettings,
			need_attendee: needAttendee,
			max_attendee_num: maxAttendeeNum,
			user_id_type: userIdType,
		};

		const {
			code,
			msg,
			data: { event },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}`,
			qs,
		});

		if (code !== 0) {
			throw new Error(`Error getting calendar event, code ${code}, message: ${msg}`);
		}

		return {
			event,
		};
	},
} as ResourceOperation;
