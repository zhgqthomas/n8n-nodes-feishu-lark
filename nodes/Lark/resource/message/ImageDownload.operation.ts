import { BINARY_ENCODING, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.DownloadImage,
	value: OperationType.DownloadImage,
	order: 192,
	options: [
		DESCRIPTIONS.RESOURCE_KEY,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/image/get">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const resourceKey = this.getNodeParameter('file_key', index);

		const data = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/im/v1/images/${resourceKey}`,
			encoding: 'arraybuffer',
			json: false,
		});

		return {
			data: Buffer.from(data).toString(BINARY_ENCODING),
		};
	},
} as ResourceOperation;
