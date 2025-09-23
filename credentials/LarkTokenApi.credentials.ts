import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
	Icon,
} from 'n8n-workflow';
import { IAuthenticateGeneric } from 'n8n-workflow';
import { BaseUrl, Credentials } from '../nodes/help/type/enums';

export class LarkTokenApi implements ICredentialType {
	name = Credentials.TenantToken;
	displayName = 'Lark Tenant Token API';
	icon: Icon = 'file:lark_icon.svg';
	documentationUrl = 'https://open.feishu.cn/document/faq/trouble-shooting/how-to-obtain-app-id';
	properties: INodeProperties[] = [
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
			displayName: 'URL',
			name: 'baseUrl',
			type: 'hidden',
			default: '={{$self["url"] === "custom" ? $self["customUrl"] : $self["url"]}}',
		},
		{
			displayName: 'App ID',
			description: 'The unique identifier for an application on the Lark Open Platform',
			name: 'appid',
			type: 'string',
			default: '',
		},
		{
			displayName: 'App Secret',
			name: 'appsecret',
			description: 'The secret key for the application.',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'AccessToken',
			name: 'accessToken',
			type: 'hidden',
			default: '',
			typeOptions: {
				expirable: true,
			},
		},
	];

	// method will only be called if "accessToken" (the expirable property)
	// is empty or is expired
	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const { code, msg, tenant_access_token } = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${credentials.baseUrl}/open-apis/auth/v3/tenant_access_token/internal`,
			body: {
				app_id: credentials.appid,
				app_secret: credentials.appsecret,
			},
		})) as { code: number; msg: string; tenant_access_token: string };

		if (code && code !== 0) {
			throw new Error('Authentication failed:' + code + ', ' + msg);
		}

		return { accessToken: tenant_access_token };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.accessToken}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: `/open-apis/auth/v3/tenant_access_token/internal`,
			method: 'POST',
			body: {
				app_id: '={{$credentials.appid}}',
				app_secret: '={{$credentials.appsecret}}',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'Invalid param',
					key: 'code',
					value: 10003,
				},
			},
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'App secret invalid',
					key: 'code',
					value: 10014,
				},
			},
		],
	};
}
