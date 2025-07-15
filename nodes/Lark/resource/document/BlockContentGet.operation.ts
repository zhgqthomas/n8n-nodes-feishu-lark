import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Get Block Content | 获取块的内容',
	value: 'getBlockContent',
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
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index) as string;
		const block_id = this.getNodeParameter('block_id', index) as string;
		const document_revision_id = this.getNodeParameter('document_revision_id', index, -1) as number;
		const user_id_type = this.getNodeParameter('user_id_type', index, 'open_id') as string;

		const {
			code,
			msg,
			data: { block },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/docx/v1/documents/${document_id}/blocks/${block_id}`,
			qs: {
				document_revision_id,
				user_id_type,
			},
		});
		if (code !== 0) {
			throw new Error(`Get block content failed, code: ${code}, message: ${msg}`);
		}
		return block as IDataObject;
	},
} as ResourceOperation;
