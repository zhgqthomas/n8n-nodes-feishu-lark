import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Get Calendar Info | 查询日历信息',
	value: 'getInfo',
	options: [
		{
			displayName: 'Calendar ID(日历 ID)',
			name: 'calendar_id',
			type: 'string',
			required: true,
			default: '',
			description:
				'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar/get#pathParams',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const calendarId = this.getNodeParameter('calendar_id', index) as string;

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/calendar/v4/calendars/${calendarId}`,
		});

		if (code !== 0) {
			throw new Error(`Get Calendar Info Error, code: ${code}, message: ${msg}`);
		}

		return data as IDataObject;
	},
} as ResourceOperation;
