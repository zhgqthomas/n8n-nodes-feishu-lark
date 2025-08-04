import { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';
import { BaseUrl, Credentials } from '../nodes/help/type/enums';

export class LarkOAuth2Api implements ICredentialType {
	name = Credentials.UserToken;
	displayName = 'Lark OAuth2 API';
	extends = ['oAuth2Api'];
	icon: Icon = 'file:lark_icon.svg';
	documentationUrl =
		'https://open.feishu.cn/document/authentication-management/access-token/obtain-oauth-code';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'pkce',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'options',
			options: [
				{
					name: `${BaseUrl.China}`,
					value: `${BaseUrl.China}`,
					description: 'Feishu Open Platform base URL(China)',
				},
				{
					name: `${BaseUrl.Global}`,
					value: `${BaseUrl.Global}`,
					description: 'Larksuite Open Platform base URL(Global)',
				},
			],
			default: [],
			required: true,
		},
		{
			displayName: `Up to 50 scope permissions can be requested from the user at once.Please always include offline_access.<a target="_blank" href="https://open.feishu.cn/document/authentication-management/access-token/obtain-oauth-code?#bc6d1214">More Details</a>`,
			name: 'suggestion',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Scope',
			name: 'authScope',
			type: 'string',
			hint: 'Format: offline_access,contact:contact,bitable:app',
			default: 'offline_access',
			required: true,
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default:
				'={{$self["baseUrl"] === "https://open.feishu.cn" ? "https://accounts.feishu.cn/open-apis/authen/v1/authorize" : "https://accounts.larksuite.com/open-apis/authen/v1/authorize"}}',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default:
				'={{$self["baseUrl"] === "https://open.feishu.cn" ? "https://open.feishu.cn/open-apis/authen/v2/oauth/token" : "https://open.larksuite.com/open-apis/authen/v2/oauth/token"}}',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '={{$self["authScope"].replace(/,/g, " ").trim()}}',
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
