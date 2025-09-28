import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.CreateNestedDocumentBlock,
	value: OperationType.CreateNestedDocumentBlock,
	order: 195,
	options: [
		DESCRIPTIONS.DOCUMENT_ID,
		DESCRIPTIONS.DOCUMENT_BLOCK_ID,
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				DESCRIPTIONS.USER_ID_TYPE,
				DESCRIPTIONS.DOCUMENT_REVISION_ID,
				DESCRIPTIONS.REQUEST_ID,
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/docs/docs/document-block/create-2">${WORDING.OpenDocument}</a>`,
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
		const body = NodeUtils.getObjectData(this, index);
		const options = this.getNodeParameter('options', index, {});
		const document_revision_id = (options.document_revision_id as number) || -1;
		const user_id_type = (options.user_id_type as string) || 'open_id';
		const request_id = (options.request_id as string) || undefined;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/docx/v1/documents/${document_id}/blocks/${block_id}/descendant`,
			qs: {
				document_revision_id,
				user_id_type,
				...(request_id && { client_token: request_id }),
			},
			body,
		});

		return data;
	},
} as ResourceOperation;
