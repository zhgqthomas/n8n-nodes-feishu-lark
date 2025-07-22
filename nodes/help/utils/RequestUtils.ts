import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { Credentials } from '../type/enums';

class RequestUtils {
	static async originRequest(
		this: IExecuteFunctions,
		options: IHttpRequestOptions,
		clearAccessToken = false,
	) {
		const credentials = await this.getCredentials(Credentials.Name);

		return this.helpers.httpRequestWithAuthentication.call(this, Credentials.Name, options, {
			credentialsDecrypted: {
				id: Credentials.Id,
				name: Credentials.Name,
				type: Credentials.Type,
				data: {
					...credentials,
					accessToken: clearAccessToken ? '' : credentials.accessToken,
				},
			},
		});
	}

	static async request(this: IExecuteFunctions, options: IHttpRequestOptions) {
		if (options.json === undefined) options.json = true;

		return RequestUtils.originRequest.call(this, options).then((data) => {
			const handleResponse = (data: any) => {
				if (data.code && data.code !== 0) {
					throw new Error(
						`Request Error: ${data.code}, ${data.msg} \n ` + JSON.stringify(data.error),
					);
				}
				return data;
			};

			// Handle access token expiration
			if (data.code && data.code === 99991663) {
				return RequestUtils.originRequest.call(this, options, true).then((data) => {
					return handleResponse(data);
				});
			}

			return handleResponse(data);
		});
	}
}

export default RequestUtils;
