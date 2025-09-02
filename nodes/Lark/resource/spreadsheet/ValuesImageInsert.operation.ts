import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.ValuesImageInsert,
	value: OperationType.ValuesImageInsert,
	order: 128,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.CELL_RANGE,
		{
			displayName: 'Image Name(图片名称)',
			name: 'name',
			type: 'string',
			required: true,
			hint: 'This parameter must include a suffix, such as test.png',
			default: '',
			description:
				'Supported suffixes are: "PNG", "JPEG", "JPG", "GIF", "BMP", "JFIF", "EXIF", "TIFF", "BPG", "HEIC". Case insensitive.',
		},
		{
			displayName: 'Image Binary Field(图片二进制字段)',
			name: 'image_binary_field',
			type: 'string',
			required: true,
			default: '',
			description: 'The binary field of the image to be written',
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/data-operation/write-images">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheet_id = this.getNodeParameter('spreadsheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const sheet_id = this.getNodeParameter('sheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const cell_range = this.getNodeParameter('range', index, '') as string;
		const image_binary_field = this.getNodeParameter('image_binary_field', index) as string;
		const name = this.getNodeParameter('name', index) as string;

		const binary_data = await this.helpers.getBinaryDataBuffer(index, image_binary_field);

		const body: IDataObject = {
			range: `${sheet_id}${cell_range}`,
			image: Array.from(binary_data),
			name,
		};

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/values_image`,
			body,
		});

		return data;
	},
} as ResourceOperation;
