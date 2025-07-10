import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Recall Message | 撤回消息',
	value: 'message:recall',
	options: [
		{
			displayName: 'Message ID(消息ID)',
			name: 'message_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/delete#pathParams',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;

		const { code, msg } = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/open-apis/im/v1/messages/${message_id}`,
		});
		if (code !== 0) {
			throw new Error(`Recall message failed, code: ${code}, message: ${msg}`);
		}
		return {
			recalled: true,
			message_id,
		} as IDataObject;
	},
} as ResourceOperation;
