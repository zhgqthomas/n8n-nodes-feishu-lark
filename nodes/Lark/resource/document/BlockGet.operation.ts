import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetDocumentBlock,
	value: OperationType.GetDocumentBlock,
	order: 193,
	options: [
		DESCRIPTIONS.DOCUMENT_ID,
		DESCRIPTIONS.DOCUMENT_BLOCK_ID,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.USER_ID_TYPE, DESCRIPTIONS.DOCUMENT_REVISION_ID],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/document-block/get">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const document_id = this.getNodeParameter('document_id', index, undefined, {
			extractValue: true,
		}) as string;
		const block_id = this.getNodeParameter('block_id', index) as string;
		const options = this.getNodeParameter('options', index, {});
		const document_revision_id = (options.document_revision_id as number) || -1;
		const user_id_type = (options.user_id_type as string) || 'open_id';

		const {
			data: { block },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/docx/v1/documents/${document_id}/blocks/${block_id}`,
			qs: {
				document_revision_id,
				user_id_type,
			},
		});

		return block;
	},
} as ResourceOperation;
