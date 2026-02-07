import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { DESCRIPTIONS } from '../../../help/description';
import { OperationType } from '../../../help/type/enums';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { WORDING } from '../../../help/wording';

export default {
	name: WORDING.AddReactionForMessage,
	value: OperationType.AddReactionForMessage,
	order: 199,
	options: [
		DESCRIPTIONS.MESSAGE_ID,
		DESCRIPTIONS.MESSAGE_REACTION,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message-reaction/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const reaction = this.getNodeParameter("reaction", index) as string;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages/${message_id}/reactions`,
			body: {
				reaction_type: {
					"emoji_type": reaction
				},
			},
		});

		return data;
	},
} as ResourceOperation;
