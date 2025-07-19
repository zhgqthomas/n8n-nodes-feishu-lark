import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetBaseRoleMemberList,
	value: OperationType.GetBaseRoleMemberList,
	order: 167,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.BASE_ROLE_ID,
		DESCRIPTIONS.WHETHER_PAGING,
		DESCRIPTIONS.PAGE_TOKEN,
		DESCRIPTIONS.PAGE_SIZE,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/advanced-permission/app-role-member/list">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index, undefined, {
			extractValue: true,
		}) as string;
		const role_id = this.getNodeParameter('role_id', index, undefined, {
			extractValue: true,
		}) as string;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const pageSize = this.getNodeParameter('page_size', index, 100) as number;

		const allMembers: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/bitable/v1/apps/${app_token}/roles/${role_id}/members`,
				qs: {
					page_token: pageToken,
					page_size: pageSize,
				},
			});

			hasMore = has_more;
			pageToken = page_token;
			allMembers.push(...items);
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			page_token: pageToken,
			items: allMembers,
		};
	},
} as ResourceOperation;
