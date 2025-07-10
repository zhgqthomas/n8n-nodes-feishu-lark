import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Get Plain Text Content | 获取文档纯文本内容',
	value: 'doc:getPlainTextContent',
	options: [
		{
			displayName: 'Document ID(文档 ID)',
			name: 'document_id',
			type: 'string',
			required: true,
			default: '',
			description: 'The unique identification of the document',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index) as string;

		const { code, msg, data } = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/docx/v1/documents/${document_id}/raw_content`,
		});
		if (code !== 0) {
			throw new Error(`Get document plain text content failed, code: ${code}, message: ${msg}`);
		}
		return {
			content: data.content,
			document_id: document_id,
		} as IDataObject;
	},
} as ResourceOperation;
