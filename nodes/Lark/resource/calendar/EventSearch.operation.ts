import { IDataObject, IExecuteFunctions, isObjectEmpty } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Search Calendar | 搜索日程',
	value: 'searchEvents',
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
			displayName: 'Key Words(搜索关键字)',
			name: 'query',
			type: 'string',
			required: true,
			default: '',
			description:
				'If the event name contains an underscore (_), you must search for it accurately. This scene fuzzy search may not search for the event.',
		},
		{
			displayName: 'Filter(过滤器)',
			name: 'filter',
			type: 'json',
			default: '{}',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/search#requestBody',
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
		const query = this.getNodeParameter('query', index) as string;
		const filter = NodeUtils.getNodeJsonData(this, 'filter', index) as IDataObject;
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		const pageSize = this.getNodeParameter('page_size', index, 100) as string;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;

		const allEvents: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				code,
				msg,
				data: { page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/calendar/v4/calendars/${calendarId}/events/search`,
				qs: {
					...(pageToken && { page_token: pageToken }),
					...(pageSize && { page_size: pageSize }),
					...(userIdType && { user_id_type: userIdType }),
				},
				body: {
					query,
					...(Object.keys(filter).length > 0 && { filter }),
				},
			});

			if (code !== 0) {
				throw new Error(`Error search calendar events, code: ${code}, message: ${msg}`);
			}

			hasMore = !isObjectEmpty(page_token);
			pageToken = page_token;
			allEvents.push(...items);
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			...(pageToken && { page_token: pageToken }),
			items: allEvents,
		};
	},
} as ResourceOperation;
