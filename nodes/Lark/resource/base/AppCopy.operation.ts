import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Copy Base App | 复制多维表格',
	value: 'copyApp',
	order: 199,
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
			displayName: 'App Folder Token(文件夹唯一标识)',
			name: 'folder_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'App Name(多维表格名称)',
			name: 'name',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Copy the Content(是否复制内容)',
			name: 'without_content',
			type: 'boolean',
			default: false,
			description:
				'Whether to copy the content from the original table, True is copy, False is not copy',
		},
		{
			displayName: 'Time Zone(时区)',
			name: 'time_zone',
			type: 'string',
			default: '',
			description:
				'<a target="_blank" href="https://bytedance.larkoffice.com/docx/YKRndTM7VoyDqpxqqeEcd67MnEf">Open document</a>',
		},
		{
			displayName:
				'<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/copy">Open official document</a>',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index) as string;
		const folder_token = this.getNodeParameter('folder_token', index) as string;
		const name = this.getNodeParameter('name', index) as string;
		const without_content = this.getNodeParameter('without_content', index, false) as boolean;
		const time_zone = this.getNodeParameter('time_zone', index) as string;

		const body: IDataObject = {
			without_content: !without_content,
			...(folder_token && { folder_token }),
			...(name && { name }),
			...(time_zone && { time_zone }),
		};

		const {
			data: { app },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/copy`,
			body,
		});

		return app;
	},
} as ResourceOperation;
