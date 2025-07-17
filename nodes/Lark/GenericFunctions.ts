import { BINARY_ENCODING, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../help/utils/RequestUtils';

export async function larkApiRequestMessageResourceData(
	this: IExecuteFunctions,
	body: {
		type: string;
		messageId: string;
		key: string;
	},
): Promise<String> {
	const { type, messageId, key } = body;
	const data = await RequestUtils.request.call(this, {
		method: 'GET',
		url: `/open-apis/im/v1/messages/${messageId}/resources/${key}`,
		qs: {
			type,
		},
		encoding: null,
		json: false,
	});

	return Buffer.from(data).toString(BINARY_ENCODING);
}
