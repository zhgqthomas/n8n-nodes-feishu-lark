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
			name: 'url',
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
				{
					name: 'Custom',
					value: 'custom',
					description: 'Custom URL',
				},
			],
			default: [],
			required: true,
		},
		{
			displayName: 'Custom URL',
			name: 'customUrl',
			type: 'string',
			default: '',
			placeholder: 'https://custom.domain',
			hint: 'Always start with "https://" or "http://"',
			displayOptions: {
				show: {
					url: ['custom'],
				},
			},
		},
		{
			displayName: 'Custom Access Token URL',
			name: 'customAccessTokenUrl',
			type: 'string',
			default: '',
			placeholder: 'https://custom.domain/open-apis/authen/v2/oauth/token',
			displayOptions: {
				show: {
					url: ['custom'],
				},
			},
		},
		{
			displayName: 'Custom Authorization URL',
			name: 'customAuthorizationUrl',
			type: 'string',
			default: '',
			placeholder: 'https://custom.domain/open-apis/authen/v1/authorize',
			displayOptions: {
				show: {
					url: ['custom'],
				},
			},
		},
		{
			displayName: 'URL',
			name: 'baseUrl',
			type: 'hidden',
			default: '={{$self["url"] === "custom" ? $self["customUrl"] : $self["url"]}}',
		},
		{
			displayName: `Up to 50 scope permissions can be requested from the user at once. Recommend to include offline_access.<a target="_blank" href="https://open.feishu.cn/document/authentication-management/access-token/obtain-oauth-code?#bc6d1214">More Details</a>`,
			name: 'suggestion',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Scope',
			name: 'authScope',
			type: 'string',
			hint: 'Format: offline_access,contact:contact,bitable:app. <a target="_blank" href="https://open.feishu.cn/document/authentication-management/access-token/obtain-oauth-code#bc6d1214">More Details</a>',
			default: 'offline_access',
			required: true,
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default:
				'={{$self["url"] === "custom" ? $self["customAuthorizationUrl"] : $self["url"] === "https://open.feishu.cn" ? "https://accounts.feishu.cn/open-apis/authen/v1/authorize" : "https://accounts.larksuite.com/open-apis/authen/v1/authorize"}}',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default:
				'={{$self["url"] === "custom" ? $self["customAccessTokenUrl"] : $self["url"] === "https://open.feishu.cn" ? "https://open.feishu.cn/open-apis/authen/v2/oauth/token" : "https://open.larksuite.com/open-apis/authen/v2/oauth/token"}}',
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
