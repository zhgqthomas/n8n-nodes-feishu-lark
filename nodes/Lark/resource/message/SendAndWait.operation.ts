import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	SEND_AND_WAIT_OPERATION,
} from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { DESCRIPTIONS } from '../../../help/description';
import { sendAndWaitProperties } from '../../../help/utils/properties';
import { configureWaitTillDate, createSendAndWaitMessageBody } from '../../../help/utils/webhook';

export default {
	name: WORDING.SendAndWaitMessage,
	value: SEND_AND_WAIT_OPERATION,
	action: 'Send message and wait',
	order: 1,
	options: [
		{
			displayName: `Only work with <a target="_blank" href="https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal">Tenant Token.</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
		DESCRIPTIONS.RECEIVE_ID_TYPE,
		{
			...DESCRIPTIONS.MEMBER_ID,
			displayName: 'Receive ID(接收 ID)',
			name: 'receive_id',
		},
		...sendAndWaitProperties,
	],
	async call(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
		const receive_id_type = this.getNodeParameter('receive_id_type', index, 'open_id') as string;
		const receive_id = this.getNodeParameter('receive_id', index, undefined, {
			extractValue: true,
		}) as string;
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		const uuid = (options.request_id as string) || undefined;
		const messageIdSaveKey = (options.messageIdSaveKey as string) || undefined;

		const {
			data: { message_id },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages`,
			qs: {
				receive_id_type,
			},
			body: {
				receive_id,
				msg_type: 'interactive',
				content: createSendAndWaitMessageBody(this),
				...(uuid && { uuid }),
			},
		});

		if (messageIdSaveKey) {
			this.getWorkflowStaticData('global')[`${messageIdSaveKey}`] = message_id;
		}

		const waitTill = configureWaitTillDate(this);
		await this.putExecutionToWait(waitTill);

		return this.getInputData();
	},
} as ResourceOperation;
