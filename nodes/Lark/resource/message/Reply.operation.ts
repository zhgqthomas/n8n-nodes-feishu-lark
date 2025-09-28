import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import NodeUtils from '../../../help/utils/node';

export default {
	name: WORDING.ReplyMessage,
	value: OperationType.ReplyMessage,
	order: 199,
	options: [
		DESCRIPTIONS.MESSAGE_ID,
		DESCRIPTIONS.MESSAGE_TYPE,
		DESCRIPTIONS.MESSAGE_CONTENT,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.REQUEST_ID, DESCRIPTIONS.MESSAGE_REPLY_IN_THREAD],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message/reply">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const msg_type = this.getNodeParameter('msg_type', index) as string;
		const content = NodeUtils.getObjectData(this, index);
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const uuid = options.request_id as string | undefined;
		const reply_in_thread = (options.reply_in_thread as boolean) || false;

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages/${message_id}/reply`,
			body: {
				msg_type,
				content: JSON.stringify(content),
				reply_in_thread,
				...(uuid && { uuid }),
			},
		});

		return data;
	},
} as ResourceOperation;
