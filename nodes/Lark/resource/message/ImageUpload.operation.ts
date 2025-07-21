import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import FormData from 'form-data';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.UploadImage,
	value: OperationType.UploadImage,
	order: 193,
	options: [
		DESCRIPTIONS.BINARY_PROPERTY_NAME,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/image/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index);
		const binaryData = this.helpers.assertBinaryData(index, binaryPropertyName);
		const dataBuffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
		const formData = new FormData();
		formData.append('image_type', 'message');
		formData.append('image', dataBuffer, {
			filename: binaryData.fileName,
			contentType: binaryData.mimeType,
		});

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/images`,
			body: formData,
			json: true,
		});

		return data;
	},
} as ResourceOperation;
