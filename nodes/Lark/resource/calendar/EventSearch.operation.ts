import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';
import { OBJECT_JSON } from '../../../help/description/base';

export default {
	name: WORDING.CalendarEventSearch,
	value: OperationType.SearchCalendarEvent,
	order: 90,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.SEARCH_KEY,
		DESCRIPTIONS.WHETHER_PAGING,
		DESCRIPTIONS.PAGE_SIZE,
		DESCRIPTIONS.PAGE_TOKEN,
		{
			displayName: 'Filter(过滤器)',
			required: false,
			...OBJECT_JSON,
		},
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/search">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index, undefined, {
			extractValue: true,
		}) as string;
		const query = this.getNodeParameter('search_key', index) as string;
		const filter = NodeUtils.getObjectData(this, index, undefined);

		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		const pageSize = this.getNodeParameter('page_size', index, 100) as string;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const userIdType = (options.user_id_type as string) || 'open_id';

		const allEvents: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				data: { page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'POST',
				url: `/open-apis/calendar/v4/calendars/${calendarId}/events/search`,
				qs: {
					user_id_type: userIdType,
					...(pageToken && { page_token: pageToken }),
					...(pageSize && { page_size: pageSize }),
				},
				body: {
					query,
					...(filter && Object.keys(filter).length > 0 && { filter }),
				},
			});

			hasMore = page_token ? true : false;
			pageToken = page_token;
			if (items) {
				allEvents.push(...items);
			}
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			...(pageToken && { page_token: pageToken }),
			items: allEvents,
		};
	},
} as ResourceOperation;
