import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { larkApiRequestMessageResourceData } from '../../GenericFunctions';

export default {
	name: 'Get Message Content Resource | 获取消息中的资源文件',
	value: 'getContentResource',
	options: [
		{
			displayName: 'Message ID(消息ID)',
			name: 'message_id',
			type: 'string',
			required: true,
			default: '',
			description: 'Https://open.feishu.cn/document/server-docs/im-v1/message/get-2#pathParams',
		},
		{
			displayName: 'Resource Key(资源唯一标识)',
			name: 'file_key',
			type: 'string',
			required: true,
			default: '',
			description: 'The key of the resource to be queried',
		},
		{
			displayName: 'Resource Type(资源类型)',
			name: 'type',
			type: 'options',
			options: [
				{
					name: 'Image(图片)',
					value: 'image',
					description: 'The image in the content',
				},
				{
					name: 'File(文件)',
					value: 'file',
					description: 'The file, audio, video (except emoticons) in the content',
				},
			],
			default: 'image',
		},
		{
			displayName: 'Will be returned in base64 format | 将以 base64 格式返回',
			name: 'getContentResourceNotice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const file_key = this.getNodeParameter('file_key', index) as string;
		const type = this.getNodeParameter('type', index, 'image') as string;

		const data = await larkApiRequestMessageResourceData.call(this, {
			type,
			messageId: message_id,
			key: file_key,
		});

		return {
			data,
			type,
		};
	},
} as ResourceOperation;
