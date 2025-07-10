import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';

const REQUEST_BODY = {
	start_index: 0,
	end_index: 1,
};

export default {
	name: 'Delete Block | 删除块',
	value: 'doc:block:delete',
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
			displayName: 'Parent Block ID(父块 ID)',
			name: 'block_id',
			type: 'string',
			default: '',
			required: true,
			description: 'The block_id of the parent block',
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
			displayName: 'Request Body(请求体)',
			name: 'body',
			type: 'json',
			default: JSON.stringify(REQUEST_BODY),
			description: 'Https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/document-block/batch_delete#1b8abd5d',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index) as string;
		const block_id = this.getNodeParameter('block_id', index) as string;
		const document_revision_id = this.getNodeParameter('document_revision_id', index, -1) as number;
		const body = NodeUtils.getNodeJsonData(this, 'body', index);

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/docx/v1/documents/${document_id}/blocks/${block_id}/children/batch_delete`,
			qs: {
				document_revision_id,
			},
			body,
		});
		if (code !== 0) {
			throw new Error(`Delete block failed, code: ${code}, message: ${msg}`);
		}
		return {
			deleted: true,
			...data,
		};
	},
} as ResourceOperation;
