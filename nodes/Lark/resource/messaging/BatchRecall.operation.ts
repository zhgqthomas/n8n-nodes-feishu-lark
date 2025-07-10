import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Batch Recall Messages | 批量撤回消息',
	value: 'message:batchRecall',
	options: [
		{
			displayName: 'Message IDs(待撤回的批量消息任务ID)',
			name: 'batch_message_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/batch_message/delete#pathParams',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const batch_message_id = this.getNodeParameter('batch_message_id', index) as string;

		const { code, msg } = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/im/v1/batch_messages/${batch_message_id}`,
		});
		if (code !== 0) {
			throw new Error(`Batch recall messages failed, code: ${code}, message: ${msg}`);
		}
		return {};
	},
} as ResourceOperation;
