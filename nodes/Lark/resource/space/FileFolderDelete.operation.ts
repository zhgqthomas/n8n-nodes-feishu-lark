import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.DeleteFileOrFolder,
	value: OperationType.DeleteFileOrFolder,
	order: 198,
	options: [
		DESCRIPTIONS.SPACE_FILE_TYPE,
		DESCRIPTIONS.FILE_TOKEN,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/file/delete">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const type = this.getNodeParameter('space_file_type', index) as string;
		const file_token = this.getNodeParameter('file_token', index, undefined, {
			extractValue: true,
		}) as string;

		await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/drive/v1/files/${file_token}`,
			qs: {
				type,
			},
		});

		return {
			deleted: true,
			file_token,
		};
	},
} as ResourceOperation;
