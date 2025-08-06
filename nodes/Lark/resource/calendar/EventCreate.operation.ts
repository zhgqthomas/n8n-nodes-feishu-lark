import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CalendarEventCreate,
	value: OperationType.CreateCalendarEvent,
	order: 192,
	options: [
		DESCRIPTIONS.CALENDAR_ID,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE, DESCRIPTIONS.REQUEST_ID],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index, undefined, {
			extractValue: true,
		}) as string;
		const body = this.getNodeParameter('body', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const idempotencyKey = (options.request_id as string) || '';
		const userIdType = (options.user_id_type as string) || 'open_id';

		const {
			data: { event },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events`,
			qs: {
				...(idempotencyKey && { idempotency_key: idempotencyKey }),
				...(userIdType && { user_id_type: userIdType }),
			},
			body,
		});

		return event;
	},
} as ResourceOperation;
