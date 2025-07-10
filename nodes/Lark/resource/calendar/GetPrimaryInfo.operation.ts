import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Get Primary Calendar Info | 查询主日历信息',
	value: 'calendar:getPrimaryInfo',
	order: 100,
	options: [
		{
			displayName: 'User ID Type(用户 ID 类型)',
			name: 'user_id_type',
			type: 'options',
			options: [
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'Union ID', value: 'union_id' },
				{ name: 'User ID', value: 'user_id' },
			],
			default: 'open_id',
			description: 'Https://open.feishu.cn/document/server-docs/calendar-v4/calendar/primary#queryParams',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const userIdType = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const {
			code,
			msg,
			data: { calendars },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/calendar/v4/calendars/primary',
			qs: {
				user_id_type: userIdType,
			},
		});

		if (code !== 0) {
			throw new Error(`Get Primary Calendar Info Error, code: ${code}, message: ${msg}`);
		}

		return calendars as IDataObject[];
	},
} as ResourceOperation;
