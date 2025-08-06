import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';
import { DESCRIPTIONS } from '../../../help/description';
import { OperationType } from '../../../help/type/enums';

export default {
	name: WORDING.GetPrimaryCalendarInfo,
	value: OperationType.GetPrimaryCalendarInfo,
	order: 198,
	options: [
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/calendar-v4/calendar/primary">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const options = this.getNodeParameter('options', index, {});
		const userIdType = (options.user_id_type as string) || 'open_id';

		const {
			data: { calendars },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/calendar/v4/calendars/primary',
			qs: {
				user_id_type: userIdType,
			},
		});

		return calendars as IDataObject[];
	},
} as ResourceOperation;
