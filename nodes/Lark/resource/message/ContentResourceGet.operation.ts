import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { larkApiRequestMessageResourceData } from '../../GenericFunctions';
import { OperationType } from '../../../help/type/enums';
import { WORDING } from '../../../help/wording';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.GetMessageContentResource,
	value: OperationType.GetMessageContentResource,
	order: 195,
	options: [
		DESCRIPTIONS.MESSAGE_ID,
		DESCRIPTIONS.RESOURCE_TYPE,
		DESCRIPTIONS.RESOURCE_KEY,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/im-v1/message/get-2">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const message_id = this.getNodeParameter('message_id', index) as string;
		const file_key = this.getNodeParameter('file_key', index) as string;
		const type = this.getNodeParameter('type', index, 'image') as string;

		const data = await larkApiRequestMessageResourceData.call(this, {
			type,
			messageId: message_id,
			key: file_key,
		});

		return {
			data,
			type,
		};
	},
} as ResourceOperation;
