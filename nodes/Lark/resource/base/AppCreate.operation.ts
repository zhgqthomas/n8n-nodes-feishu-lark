import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Create Base App | 创建多维表格',
	value: 'createApp',
	order: 200,
	options: [
		{
			displayName: 'App Name(多维表格名称)',
			name: 'name',
			type: 'string',
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
			displayName: 'Time Zone(时区)',
			name: 'time_zone',
			type: 'string',
			default: '',
			description: 'Doc: https://bytedance.larkoffice.com/docx/YKRndTM7VoyDqpxqqeEcd67MnEf',
		},
		{
			displayName: 'Doc: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/create',
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const name = this.getNodeParameter('name', index) as string;
		const folder_token = this.getNodeParameter('folder_token', index) as string;
		const time_zone = this.getNodeParameter('time_zone', index) as string;

		const body: IDataObject = {
			...(name && { name }),
			...(folder_token && { folder_token }),
			...(time_zone && { time_zone }),
		};

		const {
			data: { app },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/bitable/v1/apps',
			body,
		});

		return app;
	},
} as ResourceOperation;
