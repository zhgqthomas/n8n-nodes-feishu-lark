import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { DateTime } from 'luxon';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CalendarAvailability,
	value: OperationType.CalendarAvailability,
	order: 193,
	options: [
		DESCRIPTIONS.USER_ID_TYPE,
		{
			...DESCRIPTIONS.MEMBER_ID,
			displayName: 'User ID(用户 ID)',
			name: 'user_id',
		},
		DESCRIPTIONS.START_TIME,
		DESCRIPTIONS.END_TIME,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.INCLUDE_EXTERNAL_CALENDAR, DESCRIPTIONS.ONLY_BUSY],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar/list">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;
		const userId = this.getNodeParameter('user_id', index, undefined, {
			extractValue: true,
		}) as string;
		const startTime = this.getNodeParameter('start_time', index, '') as string;
		const endTime = this.getNodeParameter('end_time', index, '') as string;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const includeExternalCalendar = (options.include_external_calendar as boolean) || true;
		const onlyBusy = (options.only_busy as boolean) || true;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `open-apis/calendar/v4/freebusy/list`,
			qs: {
				user_id_type: userIdType,
			},
			body: {
				user_id: userId,
				time_min: DateTime.fromISO(startTime).toISO(),
				time_max: DateTime.fromISO(endTime).toISO(),
				include_external_calendar: includeExternalCalendar,
				only_busy: onlyBusy,
			},
		});

		return data as IDataObject;
	},
} as ResourceOperation;
