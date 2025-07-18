import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Update App Info | 更新多维表格元数据',
	value: 'updateApp',
	order: 197,
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
			displayName: 'App Name(多维表格名称)',
			name: 'name',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Turn on/off Advanced(是否开启高级权限)',
			name: 'is_advanced',
			type: 'boolean',
			default: false,
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/update">Open official document</a>',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const name = this.getNodeParameter('name', index) as string;
		const is_advanced = this.getNodeParameter('is_advanced', index, false) as boolean;

		const body: IDataObject = {
			...(name && { name }),
			is_advanced,
		};

		const {
			data: { app },
		} = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/bitable/v1/apps/${app_token}`,
			body,
		});

		return app;
	},
} as ResourceOperation;
