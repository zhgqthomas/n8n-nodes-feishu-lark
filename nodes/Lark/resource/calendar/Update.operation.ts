import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import { hexToRgbInt32 } from '../../../help/utils/parameters';

export default {
	name: WORDING.UpdateCalendar,
	value: OperationType.UpdateCalendar,
	order: 195,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.CALENDAR_TITLE,
		DESCRIPTIONS.CALENDAR_DESCRIPTION,
		DESCRIPTIONS.CALENDAR_PERMISSIONS,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.CALENDAR_SUMMARY_ALIAS, DESCRIPTIONS.CALENDAR_COLOR],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar/patch">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index, undefined, {
			extractValue: true,
		}) as string;
		const summary = this.getNodeParameter('summary', index, '') as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const permissions = this.getNodeParameter(
			'permissions',
			index,
			'show_only_free_busy',
		) as string;
		const options = this.getNodeParameter('options', index, {});
		const summary_alias = (options.summary_alias as string) || '';
		const color = (options.color as string) || '';

		const {
			data: { calendar },
		} = await RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/calendar/v4/calendars/${calendarId}`,
			body: {
				...(summary && { summary }),
				...(description && { description }),
				...(permissions && { permissions }),
				...(color && { color: hexToRgbInt32(color) }),
				...(summary_alias && { summary_alias }),
			},
		});

		return calendar;
	},
} as ResourceOperation;
