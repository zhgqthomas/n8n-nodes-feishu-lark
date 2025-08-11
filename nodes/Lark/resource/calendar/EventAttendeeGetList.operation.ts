import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CalendarEventAttendeeGetList,
	value: OperationType.GetCalendarEventAttendeeList,
	order: 80,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.CALENDAR_EVENT_ID,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				DESCRIPTIONS.USER_ID_TYPE,
				DESCRIPTIONS.NEED_RESOURCE_CUSTOMIZATION,
				DESCRIPTIONS.WHETHER_PAGING,
				DESCRIPTIONS.PAGE_TOKEN,
				DESCRIPTIONS.PAGE_SIZE,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event-attendee/list">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index, undefined, {
			extractValue: true,
		}) as string;
		const eventId = this.getNodeParameter('event_id', index, undefined, {
			extractValue: true,
		}) as string;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const userIdType = (options.user_id_type as string) || 'open_id';
		const needResourceCustomization = options.need_resource_customization as boolean;
		const whetherPaging = options.whether_paging as boolean;
		const pageSize = (options.page_size as number) || 100;
		let pageToken = options.page_token as string;

		const allAttendees: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/calendar/v4/calendars/${calendarId}/events/${eventId}/attendees`,
				qs: {
					...(userIdType && { user_id_type: userIdType }),
					...(needResourceCustomization !== undefined && { need_resource_customization: needResourceCustomization }),
					...(pageToken && { page_token: pageToken }),
					...(pageSize && { page_size: pageSize }),
				},
			});

			hasMore = has_more;
			pageToken = page_token;
			allAttendees.push(...items);
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			...(pageToken && { page_token: pageToken }),
			items: allAttendees,
		};
	},
} as ResourceOperation;
