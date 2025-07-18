import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Get App Info | 获取多维表格元数据',
	value: 'getAppInfo',
	order: 198,
	options: [
		{
			displayName: 'App Token(多维表格唯一标识)',
			name: 'app_token',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/get">Open official document</a>',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;

		const {
			data: { app },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/bitable/v1/apps/${app_token}`,
		});

		return app;
	},
} as ResourceOperation;
