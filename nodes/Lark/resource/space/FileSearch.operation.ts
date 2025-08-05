import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { FileType, OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: WORDING.SearchFiles,
	value: OperationType.SearchFiles,
	order: 197,
	options: [
		DESCRIPTIONS.SEARCH_KEY,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				DESCRIPTIONS.SEARCH_FILE_TYPE,
				DESCRIPTIONS.OFFSET,
				DESCRIPTIONS.COUNT,
				{
					...DESCRIPTIONS.ARRAY_JSON,
					displayName: 'Owner IDs(所有者 ID)',
					name: 'owner_ids',
				},
				{
					...DESCRIPTIONS.ARRAY_JSON,
					displayName: 'Chat Group IDs(群组 ID)',
					name: 'chat_ids',
				},
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/search/document-search">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const searchKey = this.getNodeParameter('search_key', index, undefined) as string;
		const options = this.getNodeParameter('options', index, {});
		const searchFileType = options.search_file_type as FileType[];
		const offset = options.offset as number;
		const count = options.count as number;
		const ownerIds = options.owner_ids as string[];
		const chatIds = options.chat_ids as string[];

		if (offset && count && offset + count >= 200) {
			throw new Error('Offset + count cannot be greater than 200');
		}

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/suite/docs-api/search/object',
			body: {
				search_key: searchKey,
				...(searchFileType && { docs_types: searchFileType }),
				...(offset && { offset }),
				...(count && { count }),
				...(ownerIds && { owner_ids: ownerIds }),
				...(chatIds && { chat_ids: chatIds }),
			},
		});

		return data;
	},
} as ResourceOperation;
