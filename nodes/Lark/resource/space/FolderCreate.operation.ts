import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CreateFolder,
	value: OperationType.CreateFolder,
	order: 200,
	options: [
		DESCRIPTIONS.NAME,
		DESCRIPTIONS.FOLDER_TOKEN,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/folder/create_folder">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const name = this.getNodeParameter('name', index) as string;
		const folder_token = this.getNodeParameter('folder_token', index, undefined, {
			extractValue: true,
		}) as string;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/drive/v1/files/create_folder',
			body: {
				name,
				...(folder_token && { folder_token }),
			},
		});

		return data;
	},
} as ResourceOperation;
