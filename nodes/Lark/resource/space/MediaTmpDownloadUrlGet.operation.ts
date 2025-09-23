import {
	assertParamIsArray,
	IDataObject,
	IExecuteFunctions,
	jsonParse,
	NodeOperationError,
} from 'n8n-workflow';
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
		DESCRIPTIONS.MEDIA_FILE_TOKENS,
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
		const fileTokens = this.getNodeParameter('media_file_tokens', index) as string;
		const parsedfileTokens: string[] =
			typeof fileTokens === 'string' ? jsonParse(fileTokens) : fileTokens;

		assertParamIsArray<string>(
			'fileTokens',
			parsedfileTokens,
			(val: any): val is string => typeof val === 'string',
			this.getNode(),
		);

		// Validate the number of file tokens
		if (parsedfileTokens.length > 5) {
			throw new NodeOperationError(this.getNode(), 'Maximum 5 file tokens are allowed');
		}

		if (parsedfileTokens.length === 0) {
			throw new NodeOperationError(this.getNode(), 'Maximum 5 file tokens are allowed');
		}

		const options = this.getNodeParameter('options', index, {});
		const extra = (options.media_tmp_download_extra as IDataObject) || undefined;

		const { data } = await RequestUtils.request.call(this, {
			method: 'GET',
			url: '/open-apis/drive/v1/medias/batch_get_tmp_download_url',
			json: true,
			qs: {
				file_tokens: parsedfileTokens,
				...(extra && { extra: JSON.stringify(extra) }),
			},
		});

		return data;
	},
} as ResourceOperation;
