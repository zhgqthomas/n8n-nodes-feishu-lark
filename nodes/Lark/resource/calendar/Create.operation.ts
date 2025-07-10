import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Create Calendar | 创建共享日历',
	value: 'calendar:create',
	options: [
		{
			displayName: 'Summary(日历标题)',
			name: 'summary',
			type: 'string',
			default: '',
			description: 'Maximum length: 255 characters',
		},
		{
			displayName: 'Description(日历描述)',
			name: 'description',
			type: 'string',
			default: '',
			description: 'Maximum length: 255 characters',
		},
		{
			displayName: 'Permissions(日历公开范围)',
			name: 'permissions',
			type: 'options',
			options: [
				{ name: 'Private | 私密', value: 'private' },
				{ name: 'Show Only Free Busy | 仅展示忙闲信息', value: 'show_only_free_busy' },
				{ name: 'Public | 公开，他人可查看日程详情', value: 'public' },
			],
			default: 'show_only_free_busy',
			description: 'Calendar visibility range',
		},
		{
			displayName: 'Color(日历颜色)',
			name: 'color',
			type: 'number',
			default: -14513409,
			description: 'The value is represented by the int32 of the RGB color value,',
		},
		{
			displayName: 'Summary Alias(日历备注名)',
			name: 'summary_alias',
			type: 'string',
			default: '',
			description: 'Setting this field (including subsequent modification of this field) only takes effect for the current identity',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const summary = this.getNodeParameter('summary', index, '') as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const permissions = this.getNodeParameter(
			'permissions',
			index,
			'show_only_free_busy',
		) as string;
		const color = this.getNodeParameter('color', index, -14513409) as number;
		const summary_alias = this.getNodeParameter('summary_alias', index, '') as string;

		const {
			code,
			msg,
			data: { calendar },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/calendar/v4/calendars',
			body: {
				...(summary && { summary }),
				...(description && { description }),
				...(permissions && { permissions }),
				...(color !== undefined && { color }),
				...(summary_alias && { summary_alias }),
			},
		});
		if (code !== 0) {
			throw new Error(`Create Calendar Error, code: ${code}, message: ${msg}`);
		}

		return calendar;
	},
} as ResourceOperation;
