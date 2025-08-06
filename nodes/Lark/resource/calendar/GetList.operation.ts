import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetCalendarList,
	value: OperationType.GetCalendarList,
	order: 196,
	options: [
		DESCRIPTIONS.WHETHER_PAGING,
		{
			...DESCRIPTIONS.PAGE_SIZE,
			typeOptions: {
				minValue: 50,
				maxValue: 1000,
                numberPrecision: 0,
			},
		},
		DESCRIPTIONS.PAGE_TOKEN,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar/get">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const pageSize = this.getNodeParameter('page_size', index, 1000) as number;

		const allCalendars: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				data: { has_more, page_token, calendar_list },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/calendar/v4/calendars`,
				qs: {
					page_token: pageToken,
					page_size: pageSize,
				},
			});

			hasMore = has_more;
			pageToken = page_token;
			if (calendar_list) {
				allCalendars.push(...calendar_list);
			}
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			...(pageToken && { page_token: pageToken }),
			items: allCalendars,
		};
	},
} as ResourceOperation;
