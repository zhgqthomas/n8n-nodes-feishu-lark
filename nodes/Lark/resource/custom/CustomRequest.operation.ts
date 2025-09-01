import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CustomApiRequest,
	value: OperationType.CustomApiRequest,
	order: 200,
	options: [
		DESCRIPTIONS.CUSTOM_PATH,
		DESCRIPTIONS.CUSTOM_METHOD,
		DESCRIPTIONS.CUSTOM_BODY,
		DESCRIPTIONS.CUSTOM_QUERY,

		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/api-call-guide/calling-process/get-">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const path = this.getNodeParameter('path', index, undefined, {
			extractValue: true,
		}) as string;

		const method = this.getNodeParameter('method', index, undefined, {
			extractValue: true,
		}) as string;

		const body = this.getNodeParameter('body', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;

		if (body.msg_type === 'text' && typeof body.content === 'object') {
			body.content = JSON.stringify(body.content);
		}

		const query = this.getNodeParameter('query', index, undefined, {
			ensureType: 'json',
		}) as IDataObject;

		const options = this.getNodeParameter('options', index, {}) as IDataObject;

		let url = path;
		if (query && Object.keys(query).length) {
			const queryString = Object.entries(query).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join('&');
			url = `${url}?${queryString.toString()}`;
		}

		const { data } = await RequestUtils.request.call(this, {
			method: method as any,
			url: url,
			body: body,
			...options,
		});

		return data;
	},
} as ResourceOperation;
