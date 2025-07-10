import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Create Calendar Event | 创建日程',
	value: 'calendar:createEvent',
	order: 90,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/create#pathParams',
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
			description: 'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/create#pathParams',
		},
		{
			displayName: 'Request Body(请求体)',
			name: 'body',
			type: 'json',
			required: true,
			default: '{}',
			description: 'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/create#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;
		const idempotencyKey = this.getNodeParameter('idempotency_key', index, '') as string;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const {
			code,
			msg,
			data: { event },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events`,
			qs: {
				...(idempotencyKey && { idempotency_key: idempotencyKey }),
				...(userIdType && { user_id_type: userIdType }),
			},
			body,
		});

		if (code !== 0) {
			throw new Error(`Error creating calendar event, code ${code}, message ${msg}`);
		}

		return event;
	},
} as ResourceOperation;
