import { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class LarkUserTokenApi implements ICredentialType {
	name = 'larkUserTokenApi';
	displayName = 'Lark User Token API';
	extends = ['oAuth2Api'];
	icon: Icon = 'file:lark_icon.svg';
	documentationUrl = 'https://open.feishu.cn/document/faq/trouble-shooting/how-to-obtain-app-id';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'options',
			options: [
				{
					name: 'open.feishu.cn',
					value: 'open.feishu.cn',
					description: 'Feishu Open Platform base URL(China)',
				},
				{
					name: 'open.larksuite.com',
					value: 'open.larksuite.com',
					description: 'Lark Open Platform base URL(Global)',
				},
			],
			default: [],
			required: true,
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default:
				'={{$self["baseUrl"] === "open.feishu.cn" ? "https://accounts.feishu.cn/open-apis/authen/v1/authorize" : "https://accounts.larksuite.com/open-apis/authen/v1/authorize"}}',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default:
				'={{$self["baseUrl"] === "open.feishu.cn" ? "https://open.feishu.cn/open-apis/authen/v2/oauth/token" : "https://open.larksuite.com/open-apis/authen/v2/oauth/token"}}',
			required: true,
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
