import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Create Meeting Chat | 创建会议群',
	value: 'createMeetingChat',
	order: 70,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/calendar-v4/calendar-event-meeting_chat/create#pathParams',
		},
		{
			displayName: 'Event ID(日程 ID)',
			name: 'event_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/calendar-v4/calendar-event-meeting_chat/create#pathParams',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/meeting_chat`,
		});
		if (code !== 0) {
			throw new Error(`Create Meeting Chat Error, code: ${code}, message: ${msg}`);
		}
		return data as IDataObject;
	},
} as ResourceOperation;
