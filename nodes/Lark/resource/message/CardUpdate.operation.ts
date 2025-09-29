import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.UpdateMessageCard,
	value: OperationType.UpdateMessageCard,
	order: 180,
	options: [
		DESCRIPTIONS.MESSAGE_ID,
		DESCRIPTIONS.MESSAGE_CONTENT,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message-card/patch">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const content = NodeUtils.getObjectData(this, index, 'content');

		await RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/open-apis/im/v1/messages/${message_id}`,
			body: {
				content: JSON.stringify(content),
			},
		});

		return {
			updated: true,
			message_id,
		};
	},
} as ResourceOperation;
