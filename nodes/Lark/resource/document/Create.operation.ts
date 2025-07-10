import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Create Document | 创建文档',
	value: 'doc:create',
	options: [
		{
			displayName: 'Title(标题)',
			name: 'title',
			type: 'string',
			default: '',
			description: 'Only supports plain text. Length range: 1 characters ～ 800 characters.',
		},
		{
			displayName: 'Folder Token(文件夹 Token)',
			name: 'folder_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'Specify the token of the folder where the document is located. Empty means the root directory.',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const title = this.getNodeParameter('title', index) as string;
		const folder_token = this.getNodeParameter('folder_token', index) as string;

		const {
			code,
			msg,
			data: { document },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/docx/v1/documents',
			body: {
				...(title && { title }),
				...(folder_token && { folder_token }),
			},
		});
		if (code !== 0) {
			throw new Error(`Create document failed, code: ${code}, message: ${msg}`);
		}

		return document as IDataObject;
	},
} as ResourceOperation;
