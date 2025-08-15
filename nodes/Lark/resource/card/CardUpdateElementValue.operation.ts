import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CardUpdateElementValue,
	value: OperationType.CardUpdateElementValue,
	order: 200,
	options: [
		DESCRIPTIONS.CARD_ID,
		DESCRIPTIONS.CARD_SEQUENCE,
		DESCRIPTIONS.CARD_ELEMENT,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.REQUEST_ID],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/cardkit-v1/card-element/patch">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const card_id = this.getNodeParameter('card_id', index, undefined, {
			extractValue: true,
		}) as string;
		const element_id = this.getNodeParameter('element_id', index, undefined, {
			extractValue: true,
		}) as string;

		const element = this.getNodeParameter('element', index, undefined, {
			extractValue: true,
			ensureType: 'json',
		}) as IDataObject;

		const sequence = this.getNodeParameter('sequence', index, undefined, {
			extractValue: true,
		}) as number;


		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const uuid = options.request_id as string | undefined;

		const { data } = await RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/cardkit/v1/cards/${card_id}/elements/${element_id}`,
			body: {
				sequence,
				partial_element: JSON.stringify(element),
				...(uuid && { uuid }),
			},
		});

		return data;
	},
} as ResourceOperation;
