import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import FormData from 'form-data';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.UploadFile,
	value: OperationType.UploadFile,
	order: 191,
	options: [
		DESCRIPTIONS.FILE_TYPE,
		DESCRIPTIONS.FILE_DURATION,
		DESCRIPTIONS.BINARY_PROPERTY_NAME,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.FILE_NAME],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/file/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const fileType = this.getNodeParameter('file_type', index);
		const options = this.getNodeParameter('options', index, {});
		const fileDuration = options.file_duration as number | undefined;
		const fileName = options.file_name as string | undefined;
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index);
		const dataBuffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

		const formData = new FormData();
		formData.append('file_type', fileType);
		if (fileDuration) {
			formData.append('file_duration', fileDuration?.toString() || '0');
		}
		formData.append(
			'file_name',
			fileName || `file-${Date.now()}-${Math.floor(Math.random() * 100000)}.${fileType}`,
		);
		formData.append('file', dataBuffer);

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/files`,
			body: formData,
			json: true,
		});

		return data;
	},
} as ResourceOperation;
