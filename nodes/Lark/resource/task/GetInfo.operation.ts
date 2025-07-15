import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Get Task Info | 获取任务详情',
	value: 'getInfo',
	order: 100,
	options: [
		{
			displayName: 'Task ID(任务ID)',
			name: 'task_guid',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'User ID Type(用户 ID 类型)',
			name: 'user_id_type',
			type: 'options',
			options: [
				{ name: 'Open ID', value: 'open_id' },
				{ name: 'Union ID', value: 'union_id' },
				{ name: 'User ID', value: 'user_id' },
			],
			default: 'open_id',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const task_guid = this.getNodeParameter('task_guid', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;

		const {
			code,
			msg,
			data: { task },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/task/v2/tasks/${task_guid}`,
			qs: {
				user_id_type: user_id_type,
			},
		});
		if (code !== 0) {
			throw new Error(`Get task info failed, code: ${code}, message: ${msg}`);
		}
		return task as IDataObject;
	},
} as ResourceOperation;
