import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Get Document Info | 获取文档基本信息',
	value: 'doc:getInfo',
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

		const {
			code,
			msg,
			data: { document },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/docx/v1/documents/${document_id}`,
		});
		if (code !== 0) {
			throw new Error(`Get document info failed, code: ${code}, message: ${msg}`);
		}

		return document as IDataObject;
	},
} as ResourceOperation;
