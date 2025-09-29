import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import NodeUtils from '../../../help/utils/node';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: 'Create Task | 创建任务',
	value: 'create',
	order: 100,
	options: [
		{
			displayName: 'Task Title(任务标题)',
			name: 'summary',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Task Description(任务摘要)',
			name: 'description',
			type: 'string',
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
			displayName: 'Request Body(请求体)',
			name: 'body',
			type: 'json',
			required: true,
			default: '{}',
			description: 'Https://open.feishu.cn/document/task-v2/task/create#requestBody',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const summary = this.getNodeParameter('summary', index) as string;
		const description = this.getNodeParameter('description', index) as string;
		const user_id_type = this.getNodeParameter('user_id_type', index) as string;
		const extObject = NodeUtils.getNodeJsonData(this, 'body', index) as IDataObject;

		const {
			code,
			msg,
			data: { task },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/task/v2/tasks`,
			qs: {
				user_id_type: user_id_type,
			},
			body: {
				summary,
				description,
				...extObject,
			},
		});
		if (code !== 0) {
			throw new Error(`Create task failed, code: ${code}, message: ${msg}`);
		}
		return task as IDataObject;
	},
} as ResourceOperation;
