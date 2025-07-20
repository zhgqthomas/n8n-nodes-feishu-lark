import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.RecallMessage,
	value: OperationType.RecallMessage,
	order: 196,
	options: [
		DESCRIPTIONS.MESSAGE_ID,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message/delete">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;

		await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/im/v1/messages/${message_id}`,
		});

		return {
			recalled: true,
			message_id,
		};
	},
} as ResourceOperation;
