import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
	Icon,
} from 'n8n-workflow';
import { IHttpRequestOptions } from 'n8n-workflow/dist/Interfaces';
import { Credentials } from '../nodes/help/type/enums';

export class LarkCredentialsApi implements ICredentialType {
	name = Credentials.Name;
	displayName = 'Lark API';
	icon: Icon = 'file:lark_icon.svg';
	documentationUrl = 'https://open.feishu.cn/document/faq/trouble-shooting/how-to-obtain-app-id';
	properties: INodeProperties[] = [
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
			url: `https://${credentials.baseUrl}/open-apis/auth/v3/tenant_access_token/internal`,
			body: {
				app_id: credentials.appid,
				app_secret: credentials.appsecret,
			},
		})) as { code: number; msg: string; tenant_access_token: string };

		if (code && code !== 0) {
			throw new Error('Authentication failed:' + code + ', ' + msg);
		}

		console.log('tenant_access_token', tenant_access_token);

		return { accessToken: tenant_access_token };
	}

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		requestOptions.baseURL = `https://${credentials.baseUrl}`;
		requestOptions.headers = {
			...(requestOptions.headers || {}),
			Authorization: 'Bearer ' + credentials.accessToken,
		};

		console.log('accessToken', credentials.accessToken);

		return requestOptions;
	}

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.baseUrl}}',
			url: `/open-apis/auth/v3/tenant_access_token/internal`,
			method: 'POST',
			body: {
				app_id: '={{$credentials.appid}}',
				app_secret: '={{$credentials.appsecret}}',
			},
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 200,
					message: 'Authentication successful',
				},
			},
		],
	};
}
