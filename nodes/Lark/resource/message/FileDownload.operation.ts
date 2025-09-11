import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.DownloadFile,
	value: OperationType.DownloadFile,
	order: 190,
	options: [
		DESCRIPTIONS.RESOURCE_KEY,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/file/get">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const resourceKey = this.getNodeParameter('file_key', index);

		const buffer = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/im/v1/files/${resourceKey}`,
			encoding: 'arraybuffer',
			json: false,
		});

		const binaryData = await this.helpers.prepareBinaryData(buffer);

		return {
			...binaryData,
		};
	},
} as ResourceOperation;
