import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetBlockList,
	value: OperationType.GetBlockList,
	order: 197,
	options: [
		DESCRIPTIONS.DOCUMENT_ID,
		DESCRIPTIONS.WHETHER_PAGING,
		DESCRIPTIONS.PAGE_TOKEN,
		DESCRIPTIONS.PAGE_SIZE,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE, DESCRIPTIONS.DOCUMENT_REVISION_ID],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/document/list">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index, undefined, {
			extractValue: true,
		}) as string;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		const pageSize = this.getNodeParameter('page_size', index, 500) as string;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;
		const options = this.getNodeParameter('options', index, {});
		const document_revision_id = (options.document_revision_id as number) || -1;
		const user_id_type = (options.user_id_type as string) || 'open_id';

		const allBlocks: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				data: { has_more, page_token, items },
			} = await RequestUtils.request.call(this, {
				method: 'GET',
				url: `/open-apis/docx/v1/documents/${document_id}/blocks`,
				qs: {
					page_size: pageSize,
					page_token: pageToken,
					document_revision_id,
					user_id_type,
				},
			});

			hasMore = has_more;
			pageToken = page_token;
			if (items) {
				allBlocks.push(...items);
			}
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			...(pageToken && { page_token: pageToken }),
			items: allBlocks,
		};
	},
} as ResourceOperation;
