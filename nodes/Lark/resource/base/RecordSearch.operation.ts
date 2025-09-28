import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.SearchTableRecords,
	value: OperationType.SearchTableRecords,
	order: 183,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_TABLE_ID,
		DESCRIPTIONS.WHETHER_PAGING,
		DESCRIPTIONS.PAGE_TOKEN,
		DESCRIPTIONS.PAGE_SIZE,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: 'Options(选项)',
			name: 'options',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/docs/bitable-v1/app-table-record/search">${WORDING.OpenDocument}</a>`,
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
		const body = NodeUtils.getObjectData(this, index);
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const pageSize = this.getNodeParameter('page_size', index, 500) as number;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = (options.user_id_type as string) || 'open_id';

		const allRecords: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'POST',
				url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/search`,
				qs: {
					user_id_type,
					page_token: pageToken,
					page_size: pageSize,
				},
				body,
			});

			hasMore = has_more;
			pageToken = page_token;
			if (items) {
				allRecords.push(...items);
			}
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			...(pageToken && { page_token: pageToken }),
			items: allRecords,
		};
	},
} as ResourceOperation;
