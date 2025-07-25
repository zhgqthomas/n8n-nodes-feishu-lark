import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Delete Calendar | 删除共享日历',
	value: 'delete',
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar/delete#pathParams',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;

		const { code, msg } = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/calendar/v4/calendars/${calendarId}`,
		});
		if (code !== 0) {
			throw new Error(`Delete Calendar Error, code: ${code}, message: ${msg}`);
		}

		return {
			deleted: true,
			calendar_id: calendarId,
		};
	},
} as ResourceOperation;
