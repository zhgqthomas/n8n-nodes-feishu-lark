import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CardDeleteElement,
	value: OperationType.CardDeleteElement,
	order: 200,
	options: [
		DESCRIPTIONS.CARD_ID,
		DESCRIPTIONS.CARD_SEQUENCE,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.REQUEST_ID],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/cardkit-v1/card-element/delete">${WORDING.OpenDocument}</a>`,
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


		const sequence = this.getNodeParameter('sequence', index, undefined, {
			extractValue: true,
		}) as number;


		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const uuid = options.request_id as string | undefined;

		const { data } = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/cardkit/v1/cards/${card_id}/elements/${element_id}`,
			body: {
				sequence,
				...(uuid && { uuid }),
			},
		});

		return data;
	},
} as ResourceOperation;
