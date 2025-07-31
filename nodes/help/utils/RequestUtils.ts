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

		return RequestUtils.originRequest.call(this, options).catch((error) => {
			if (error.context) {
				// Get error data from server
				const errorData = JSON.parse(Buffer.from(error.context.data).toString('utf-8'));
				const { code, msg } = errorData;

				if (code === 99991663) {
					return RequestUtils.originRequest.call(this, options, true);
				}

				if (code !== 0) {
					throw new Error(`Request Lark API Error: ${code}, ${msg}`);
				}
			}

			throw error;
		});
	}
}

export default RequestUtils;
