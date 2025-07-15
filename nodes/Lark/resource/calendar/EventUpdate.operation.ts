import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Update Calendar | 更新日程',
	value: 'updateEvent',
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
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/delete#pathParams',
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
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar/primary#queryParams',
		},
		{
			displayName: 'Request Body(请求体)',
			name: 'body',
			type: 'json',
			required: true,
			default: '{}',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/patch#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const {
			code,
			msg,
			data: { event },
		} = await RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}`,
			qs: {
				...(userIdType && { user_id_type: userIdType }),
			},
			body,
		});
		if (code !== 0) {
			throw new Error(`Update Calendar Event Error, code: ${code}, message: ${msg}`);
		}

		return event as IDataObject;
	},
} as ResourceOperation;
