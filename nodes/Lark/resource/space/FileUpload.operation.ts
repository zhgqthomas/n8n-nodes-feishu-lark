import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import FormData from 'form-data';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.UploadFile,
	value: OperationType.UploadFileToSpace,
	order: 170,
	options: [
		{
			...DESCRIPTIONS.FOLDER_TOKEN,
			required: true,
		},
		DESCRIPTIONS.FILE_BINARY_FIELD,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/upload/multipart-upload-file-/introduction">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const folderToken = this.getNodeParameter('folder_token', index, undefined, {
			extractValue: true,
		}) as string;
		const fileBinaryField = this.getNodeParameter('file_binary_field', index) as string;
		const binaryData = await this.helpers.assertBinaryData(index, fileBinaryField);
		const buffer = await this.helpers.getBinaryDataBuffer(index, fileBinaryField);

		const formData = new FormData();
		formData.append('file_name', binaryData.fileName);
		formData.append('parent_type', 'explorer');
		formData.append('parent_node', folderToken);
		formData.append('size', buffer.length);
		formData.append('file', buffer);

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/drive/v1/files/upload_all',
			body: formData,
			json: true,
		});

		return data;
	},
} as ResourceOperation;
