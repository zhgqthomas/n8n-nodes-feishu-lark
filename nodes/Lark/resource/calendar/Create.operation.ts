import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import { hexToRgbInt32 } from '../../../help/utils';

export default {
	name: WORDING.CreateCalendar,
	value: OperationType.CreateCalendar,
	options: [
		DESCRIPTIONS.CALENDAR_TITLE,
		DESCRIPTIONS.CALENDAR_DESCRIPTION,
		DESCRIPTIONS.CALENDAR_PERMISSIONS,
		DESCRIPTIONS.CALENDAR_COLOR,
		DESCRIPTIONS.CALENDAR_SUMMARY_ALIAS,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const summary = this.getNodeParameter('summary', index, '') as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const permissions = this.getNodeParameter(
			'permissions',
			index,
			'show_only_free_busy',
		) as string;
		const color = this.getNodeParameter('color', index, '') as string;
		const summary_alias = this.getNodeParameter('summary_alias', index, '') as string;

		const {
			data: { calendar },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/calendar/v4/calendars',
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
