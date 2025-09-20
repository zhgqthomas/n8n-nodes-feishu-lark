import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import FormData from 'form-data';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.UploadMedia,
	value: OperationType.UploadMediaToSpace,
	order: 195,
	options: [
		{
			...DESCRIPTIONS.PARENT_TYPE,
			required: true,
		},
		DESCRIPTIONS.PARENT_NODE,
		DESCRIPTIONS.FILE,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/media/upload_all">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const parentType = this.getNodeParameter('parent_type', index) as string;
		const parentNode = this.getNodeParameter('parent_node', index) as string;
		const fileUrl = this.getNodeParameter('file', index) as string;

		try {
			const response = await fetch(fileUrl);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const arrayBuffer = await response.arrayBuffer();
			const fileBuffer = Buffer.from(arrayBuffer);

			const formData = new FormData();
			const parts = fileUrl.split('/');
    		const fileName = parts.pop();
			formData.append('file_name', fileName);
			formData.append('parent_type', parentType);
			formData.append('parent_node', parentNode);
			formData.append('size', fileBuffer.byteLength);
			formData.append('file', fileBuffer, fileName);

			const { data } = await RequestUtils.request.call(this, {
				method: 'POST',
				url: '/open-apis/drive/v1/medias/upload_all',
				headers: {
					'Content-Type': 'multipart/form-data; boundary=---7MA4YWxkTrZu0gW',
				},
				body: formData,
				json: true,
			});

			return data;

		} catch (error) {
			console.error('Failed to fetch image:', error);
			throw error;
		}

	},
} as ResourceOperation;
