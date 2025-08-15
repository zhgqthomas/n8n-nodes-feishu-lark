import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CardAddElement,
	value: OperationType.CardAddElement,
	order: 200,
	options: [
		DESCRIPTIONS.CARD_ID,
		DESCRIPTIONS.CARD_INSERT_TYPE,
		DESCRIPTIONS.CARD_SEQUENCE,
		DESCRIPTIONS.CARD_ELEMENTS,
		DESCRIPTIONS.CARD_TARGET_ELEMENT_ID,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.REQUEST_ID],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/cardkit-v1/card-element/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const card_id = this.getNodeParameter('card_id', index, undefined, {
			extractValue: true,
		}) as string;

		const target_element_id = this.getNodeParameter('target_element_id', index, undefined, {
			extractValue: true,
		}) as string;

		const elements = this.getNodeParameter('elements', index, undefined, {
			extractValue: true,
			ensureType: 'json',
		}) as IDataObject;

		const sequence = this.getNodeParameter('sequence', index, undefined, {
			extractValue: true,
		}) as number;


		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const uuid = options.request_id as string | undefined;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/cardkit/v1/cards/${card_id}/elements`,
			body: {
				target_element_id,
				sequence,
				type: 'insert_after',
				elements: JSON.stringify(elements),
				...(uuid && { uuid }),
			},
		});

		return data;
	},
} as ResourceOperation;
