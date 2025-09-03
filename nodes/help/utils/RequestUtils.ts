import { IExecuteFunctions, IHttpRequestOptions, JsonObject, NodeApiError } from 'n8n-workflow';
import { Credentials } from '../type/enums';

class RequestUtils {
	static async originRequest(
		this: IExecuteFunctions,
		options: IHttpRequestOptions,
		clearAccessToken = false,
	) {
		const authenticationMethod = this.getNodeParameter(
			'authentication',
			0,
			Credentials.TenantToken,
		) as string;

		const credentials = await this.getCredentials(authenticationMethod);
		options.baseURL = credentials.baseUrl as string;

		if (authenticationMethod === Credentials.TenantToken) {
			// Replace the accessToken with an empty string if clearAccessToken is true, so the preAuthentication method can be triggered
			// and a new access token can be fetched
			const additionalCredentialOptions = {
				credentialsDecrypted: {
					id: Credentials.Id,
					name: Credentials.TenantToken,
					type: Credentials.Type,
					data: {
						...credentials,
						accessToken: clearAccessToken ? '' : credentials.accessToken,
					},
				},
			};

			return this.helpers.httpRequestWithAuthentication.call(
				this,
				authenticationMethod,
				options,
				additionalCredentialOptions,
			);
		}

		return this.helpers.httpRequestWithAuthentication.call(this, authenticationMethod, options);
	}

	static async request(this: IExecuteFunctions, options: IHttpRequestOptions) {
		if (options.json === undefined) options.json = true;

		return RequestUtils.originRequest
			.call(this, options)
			.then((res) => {
				if (res instanceof Buffer || res instanceof ArrayBuffer || res instanceof Uint8Array) {
					return res;
				}

				if (res.code !== 0) {
					throw new Error(`Request Lark API Error: ${res.code}, ${res.msg}`);
				}

				return res;
			})
			.catch((error) => {
				if (error.context && error.context.data) {
					let errorData: any = {};
					if (error.context.data.code) {
						errorData = error.context.data;
					} else {
						// the context data is in array buffer format for download resource operation
						errorData = JSON.parse(Buffer.from(error.context.data).toString('utf-8'));
					}

					const { code, msg, error: larkError } = errorData;

					if (code === 99991663) {
						return RequestUtils.originRequest.call(this, options, true);
					}

					if (code !== 0) {
						throw new NodeApiError(this.getNode(), error as JsonObject, {
							message: `Request Lark API Error: ${code}, ${msg}`,
							description: larkError?.troubleshooter || '',
						});
					}
				}

				throw error;
			});
	}
}

export default RequestUtils;
