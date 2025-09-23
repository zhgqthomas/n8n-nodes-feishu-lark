import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetMediaTempDownloadLink,
	value: OperationType.GetMediaTempDownloadLinkToSpace,
	order: 140,
	options: [
		DESCRIPTIONS.MEDIA_FILE_TOKEN,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				{
					...DESCRIPTIONS.REQUEST_BODY,
					name: 'media_tmp_download_extra',
				},
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/media/batch_get_tmp_download_url">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {

		let fileTokens: string[];


		// 使用字符串输入
		const fileTokensInput = this.getNodeParameter('media_file_token', index) as string;
		fileTokens = fileTokensInput.split(',').map(token => token.trim()).filter(token => token);

		// 限制最多5个token
		if (fileTokens.length > 5) {
			throw new Error('Maximum 5 file tokens are allowed');
		}

		if (fileTokens.length === 0) {
			throw new Error('At least one file token is required');
		}

		const options = this.getNodeParameter('options', index, {});
		const extra = (options.media_tmp_download_extra as IDataObject) || undefined;

		let url = `/open-apis/drive/v1/medias/batch_get_tmp_download_url?${fileTokens.map((token)=>`file_tokens=${token}`).join('&')}`

		if (extra) {
			url += `&extra=${encodeURIComponent(JSON.stringify(extra))}`
		}
		const { data } = await RequestUtils.request.call(this, {
			method: 'GET',
			url,
			json: true,
		});

		return data;
	},
} as ResourceOperation;
