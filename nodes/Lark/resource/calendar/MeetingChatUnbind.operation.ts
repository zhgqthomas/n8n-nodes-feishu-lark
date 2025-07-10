import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Unbind Meeting Chat | 解绑会议群',
	value: 'calendar:meetingchat:unbind',
	order: 70,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/calendar-v4/calendar-event-meeting_chat/create#pathParams',
		},
		{
			displayName: 'Event ID(日程 ID)',
			name: 'event_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/calendar-v4/calendar-event-meeting_chat/create#pathParams',
		},
		{
			displayName: 'Meeting Chat ID(会议群 ID)',
			name: 'meeting_chat_id',
			type: 'string',
			required: true,
			default: '',
			description: 'The group ID is returned when the group is created',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const meetingChatId = this.getNodeParameter('meeting_chat_id', index) as string;

		const { code, msg } = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/meeting_chat`,
			qs: {
				meeting_chat_id: meetingChatId || undefined,
			},
		});
		if (code !== 0) {
			throw new Error(`Error unbinding meeting chat, code ${code}, message: ${msg}`);
		}

		return {};
	},
} as ResourceOperation;
