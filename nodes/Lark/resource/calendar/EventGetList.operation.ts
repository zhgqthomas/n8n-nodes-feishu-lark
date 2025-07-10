/* eslint-disable n8n-nodes-base/node-param-type-options-password-missing */
import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Get Calendar Event List | 获取日程列表',
	value: 'calendar:event:getList',
	order: 90,
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/get#pathParams',
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
			description: 'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/list#queryParams',
		},
		{
			displayName: 'Anchor Time(时间锚点)',
			name: 'anchor_time',
			type: 'string',
			default: '',
			description: 'Used to set a specific point in time for pulling events, thereby avoiding the need to pull all events',
		},
		{
			displayName: 'Sync Token(增量同步标记)',
			name: 'sync_token',
			type: 'string',
			default: '',
			description: 'Incremental synchronization mark, not filled in for the first request',
		},
		{
			displayName: 'Start Time(开始时间)',
			name: 'start_time',
			type: 'string',
			default: '',
			description: 'The start point of a time range, represented by a Unix timestamp (in seconds)',
		},
		{
			displayName: 'End Time(结束时间)',
			name: 'end_time',
			type: 'string',
			default: '',
			description: 'The end point of a time range, represented by a Unix timestamp (in seconds)',
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
		const anchorTime = this.getNodeParameter('anchor_time', index, '') as string;
		let syncToken = this.getNodeParameter('sync_token', index, '') as string;
		const startTime = this.getNodeParameter('start_time', index, '') as string;
		const endTime = this.getNodeParameter('end_time', index, '') as string;
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
				data: { has_more, page_token, sync_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/calendar/v4/calendars/${calendarId}/events`,
				qs: {
					page_size: pageSize,
					user_id_type: userIdType,
					...(anchorTime && { anchor_time: anchorTime }),
					...(pageToken && { page_token: pageToken }),
					...(syncToken && { sync_token: syncToken }),
					...(startTime && { start_time: startTime }),
					...(endTime && { end_time: endTime }),
				},
			});

			if (code !== 0) {
				throw new Error(`Error fetching calendar events, code: ${code}, message: ${msg}`);
			}

			hasMore = has_more;
			pageToken = page_token;
			syncToken = sync_token;
			allEvents.push(...items);
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			page_token: pageToken,
			sync_token: syncToken,
			items: allEvents,
		};
	},
} as ResourceOperation;
