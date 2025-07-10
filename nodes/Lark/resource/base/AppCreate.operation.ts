import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';

export default {
	name: 'Create Base App | 创建多维表格',
	value: 'app:create',
	order: 100,
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
			description: 'Https://open.feishu.cn/document/server-docs/docs/faq#e4a9bfa1',
		},
		{
			displayName: 'Time Zone(时区)',
			name: 'time_zone',
			type: 'string',
			default: '',
			description: 'Https://bytedance.larkoffice.com/docx/YKRndTM7VoyDqpxqqeEcd67MnEf',
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
			code,
			msg,
			data: { app },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/bitable/v1/apps',
			body,
		});

		if (code !== 0) {
			throw new Error(`Error creating base app: code:${code}, message:${msg}`);
		}

		return app;
	},
} as ResourceOperation;
