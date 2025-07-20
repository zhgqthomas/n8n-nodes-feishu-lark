import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetTableViewList,
	value: OperationType.GetTableViewList,
	order: 188,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_TABLE_ID,
		DESCRIPTIONS.WHETHER_PAGING,
		DESCRIPTIONS.PAGE_TOKEN,
		DESCRIPTIONS.PAGE_SIZE,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-view/list">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index, undefined, {
			extractValue: true,
		}) as string;
		const table_id = this.getNodeParameter('table_id', index, undefined, {
			extractValue: true,
		}) as string;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		const pageSize = this.getNodeParameter('page_size', index, 100) as string;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = options.user_id_type as string || 'open_id';

		const allViews: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				code,
				msg,
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views`,
				qs: {
					user_id_type,
					page_token: pageToken,
					page_size: pageSize,
				},
			});

			if (code !== 0) {
				throw new Error(`Error fetching base views, code: ${code}, message: ${msg}`);
			}

			hasMore = has_more;
			pageToken = page_token;
			if (items) {
				allViews.push(...items);
			}
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			page_token: pageToken || '',
			items: allViews,
		};
	},
} as ResourceOperation;
