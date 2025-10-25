import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.DeleteLimitedCard,
	value: OperationType.DeleteLimitedCard,
	order: 180,
	options: [
		DESCRIPTIONS.MESSAGE_ID,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message-card/delete-message-cards-that-are-only-visible-to-certain-people">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;

		await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/ephemeral/v1/delete`,
			body: {
				message_id,
			},
		});

		return {
			deleted: true,
			message_id,
		};
	},
} as ResourceOperation;
