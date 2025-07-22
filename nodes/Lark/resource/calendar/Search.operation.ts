import { IDataObject, IExecuteFunctions, isObjectEmpty } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Search Calendar | 搜索日历',
	value: 'search',
	options: [
		{
			displayName: 'Key Words(搜索关键字)',
			name: 'query',
			type: 'string',
			required: true,
			default: '',
			description:
				"Will search public calendars or the user's primary calendar where the title or description contains this keyword",
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
			default: 10,
			displayOptions: {
				show: {
					whether_paging: [true],
				},
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const query = this.getNodeParameter('query', index) as string;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const pageSize = this.getNodeParameter('page_size', index, 50) as number;

		const allCalendars: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				code,
				msg,
				data: { page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/calendar/v4/calendars/search`,
				qs: {
					page_token: pageToken,
					page_size: pageSize,
				},
				body: {
					query,
				},
			});

			if (code !== 0) {
				throw new Error(`Error search calendars, code ${code}, message: ${msg}`);
			}

			hasMore = !isObjectEmpty(page_token);
			pageToken = page_token;
			allCalendars.push(...items);
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			...(pageToken && { page_token: pageToken }),
			items: allCalendars,
		};
	},
} as ResourceOperation;
