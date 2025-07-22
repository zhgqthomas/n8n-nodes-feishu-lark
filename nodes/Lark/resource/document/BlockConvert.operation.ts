import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.ConvertDocumentBlock,
	value: OperationType.ConvertDocumentBlock,
	order: 191,
	options: [
		DESCRIPTIONS.CONVERT_BLOCK_CONTENT_TYPE,
		DESCRIPTIONS.CONVERT_BLOCK_CONTENT,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/document-docx/docx-v1/document/convert">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const content_type = this.getNodeParameter('content_type', index) as string;
		const content = this.getNodeParameter('content', index) as string;
		const options = this.getNodeParameter('options', index, {});
		const user_id_type = (options.user_id_type as string) || 'open_id';

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/docx/v1/documents/blocks/convert`,
			qs: {
				user_id_type,
			},
			body: {
				content_type,
				content,
			},
		});

		return data;
	},
} as ResourceOperation;
