import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Get Event Attendees List | 获取日程参与人列表',
	value: 'getEventAttendeesList',
	order: 80,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/list-2#pathParams',
		},
		{
			displayName: 'Event ID(日程 ID',
			name: 'event_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/list-2#pathParams',
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
			displayName: 'Need Resource Customization(是否需要会议室表单信息)',
			name: 'need_resource_customization',
			type: 'boolean',
			default: false,
			description: 'Whether meeting room form information is required',
		},
		{
			displayName: 'Whether Paging(是否分页)',
			name: 'whether_paging',
			type: 'boolean',
			default: false,
		},
		{
			displayName: 'Page Token(分页标记)',
			name: 'page_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
			displayOptions: {
				show: {
					whether_paging: [true],
				},
			},
		},
		{
			displayName: 'Page Size(分页大小)',
			name: 'page_size',
			type: 'number',
			default: 20,
			displayOptions: {
				show: {
					whether_paging: [true],
				},
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;
		const eventId = this.getNodeParameter('event_id', index) as string;
		const needResourceCustomization = this.getNodeParameter(
			'need_resource_customization',
			index,
			false,
		) as boolean;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		const pageSize = this.getNodeParameter('page_size', index, 100) as string;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;

		const allAttendees: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				code,
				msg,
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/attendees`,
				qs: {
					user_id_type: userIdType,
					need_resource_customization: needResourceCustomization,
					page_token: pageToken || undefined,
					page_size: pageSize || undefined,
				},
			});

			if (code !== 0) {
				throw new Error(`Error fetching calendar events, code: ${code}, message: ${msg}`);
			}

			hasMore = has_more;
			pageToken = page_token;
			allAttendees.push(...items);
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			page_token: pageToken,
			items: allAttendees,
		};
	},
} as ResourceOperation;
