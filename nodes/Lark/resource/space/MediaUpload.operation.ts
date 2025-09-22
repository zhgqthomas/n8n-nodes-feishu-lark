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
	order: 160,
	options: [
		DESCRIPTIONS.PARENT_TYPE,
		DESCRIPTIONS.PARENT_NODE,
		DESCRIPTIONS.FILE_BINARY_FIELD,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				{
					...DESCRIPTIONS.REQUEST_BODY,
					name: 'media_upload_extra',
				},
			],
		},
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
		const fileBinaryField = this.getNodeParameter('file_binary_field', index) as string;
		const binaryData = await this.helpers.assertBinaryData(index, fileBinaryField);
		const buffer = await this.helpers.getBinaryDataBuffer(index, fileBinaryField);

		const options = this.getNodeParameter('options', index, {});
		const extra = (options.media_upload_extra as IDataObject) || undefined;

		const formData = new FormData();
		formData.append('file_name', binaryData.fileName);
		formData.append('parent_type', parentType);
		formData.append('parent_node', parentNode);
		formData.append('size', buffer.length);
		formData.append('file', buffer);
		if (extra) {
			formData.append('extra', JSON.stringify(extra));
		}

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/drive/v1/medias/upload_all',
			body: formData,
			json: true,
		});

		return data;
	},
} as ResourceOperation;
