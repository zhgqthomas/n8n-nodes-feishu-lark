import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Get Document Blocks | 获取文档块列表',
	value: 'getBlocks',
	options: [
		{
			displayName: 'Document ID(文档 ID)',
			name: 'document_id',
			type: 'string',
			required: true,
			default: '',
			description: 'The unique identification of the document',
		},
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
		},
		{
			displayName: 'Document Version ID(文档版本)',
			name: 'document_revision_id',
			type: 'number',
			default: -1,
			description:
				'-1 indicates the latest version of the document. Once the document is created, the document_revision_id is 1.',
		},
		{
			displayName: 'Whether Paging(是否分页)',
			name: 'whether_paging',
			type: 'boolean',
			default: false,
		},
		{
			displayName: 'Page Token(分页标记)',
			name: 'page_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
			displayOptions: {
				show: {
					whether_paging: [true],
				},
			},
		},
		{
			displayName: 'Page Size(分页大小)',
			name: 'page_size',
			type: 'number',
			default: 20,
			displayOptions: {
				show: {
					whether_paging: [true],
				},
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index) as string;
		const document_revision_id = this.getNodeParameter('document_revision_id', index, -1) as number;
		const user_id_type = this.getNodeParameter('user_id_type', index, 'open_id') as string;
		const whetherPaging = this.getNodeParameter('whether_paging', index, false) as boolean;
		const pageSize = this.getNodeParameter('page_size', index, 500) as string;
		let pageToken = this.getNodeParameter('page_token', index, '') as string;

		const allBlocks: IDataObject[] = [];
		let hasMore = false;
		do {
			const {
				code,
				msg,
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

			if (code !== 0) {
				throw new Error(`Error fetching document blocks, code: ${code}, message: ${msg}`);
			}

			hasMore = has_more;
			pageToken = page_token;
			allBlocks.push(...items);
		} while (!whetherPaging && hasMore);

		return {
			has_more: hasMore,
			page_token: pageToken,
			items: allBlocks,
		};
	},
} as ResourceOperation;
