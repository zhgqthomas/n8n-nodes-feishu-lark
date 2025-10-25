import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.UpdateInteractiveCard,
	value: OperationType.UpdateInteractiveCard,
	order: 179,
	options: [
		DESCRIPTIONS.INTERACTIVE_TOKEN,
		{
			...DESCRIPTIONS.MESSAGE_CONTENT,
			displayName: 'Card',
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message-card/delay-update-message-card">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const token = this.getNodeParameter('interactive_token', index) as string;
		const content = NodeUtils.getObjectData(this, index, 'content');

		await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/interactive/v1/card/update`,
			body: {
				token,
				card: content,
			},
		});

		return {
			updated: true,
		};
	},
} as ResourceOperation;
