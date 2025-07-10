import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/NodeUtils';
import RequestUtils from '../../../help/utils/RequestUtils';

const REQUEST_BODY = {
	members: [
		{
			id: '',
			role: 'assignee',
			type: 'user',
			name: '',
		},
	],
};

export default {
	name: 'Remove Members | 移除任务成员',
	value: 'task:membersRemove',
	order: 90,
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
		{
			displayName: 'Members(成员)',
			name: 'body',
			type: 'json',
			required: true,
			default: JSON.stringify(REQUEST_BODY),
			description: 'Https://open.feishu.cn/document/task-v2/task/add_members#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const task_guid = this.getNodeParameter('task_guid', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const body = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject[];

		const {
			code,
			msg,
			data: { task },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/task/v2/tasks/${task_guid}/remove_members`,
			qs: {
				user_id_type: user_id_type,
			},
			body,
		});
		if (code !== 0) {
			throw new Error(`Remove task members failed, code: ${code}, message: ${msg}`);
		}
		return task as IDataObject;
	},
} as ResourceOperation;
