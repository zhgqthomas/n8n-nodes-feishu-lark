import {
	IHookFunctions,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';
import { larkTrigger, larkWebhook } from '../TriggerFunctions';
import { Credentials } from '../../help/type/enums';
import { triggerEventProperty } from '../../help/utils/properties';
import { WORDING } from '../../help/wording';

const descriptionV2: INodeTypeDescription = {
	displayName: 'Lark Trigger',
	name: 'larkTrigger',
	group: ['trigger'],
	version: 2,
	description: 'Starts the workflow on Lark events',
	defaults: {
		name: 'Lark Trigger',
	},
	inputs: [],
	outputs: [NodeConnectionType.Main],
	credentials: [
		{
			name: Credentials.TenantToken,
			required: true,
		},
	],
	webhooks: [
		{
			name: 'default',
			httpMethod: 'POST',
			responseMode: 'onReceived',
			isFullPath: true,
			path: '={{ $parameter["options"]?.path || $webhookId }}',
			ndvHideUrl: '={{ $parameter["triggerType"] === "webhook" ? false : true }}',
		},
	],
	properties: [
		{
			displayName:
				'Due to Feishu/Lark API limitations, you can use just one Lark trigger for each lark bot at a time',
			name: 'LarkTriggerNotice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Trigger Type',
			name: 'triggerType',
			type: 'options',
			default: 'websocket',
			required: true,
			options: [
				{
					name: 'Websocket',
					value: 'websocket',
				},
				{
					name: 'Webhook',
					value: 'webhook',
				},
			],
			hint: 'Websocket only works for Feishu China.',
		},
		{
			displayName: 'Encrypt Key',
			name: 'encryptKey',
			type: 'string',
			required: true,
			description:
				'Used to encrypt the transmission. <a target="_blank" href="https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/event-subscription-configure-/choose-a-subscription-mode/send-notifications-to-developers-server#e0dff53d">Check Doc</a>',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					triggerType: ['webhook'],
				},
			},
		},
		{
			displayName: 'Verification Token',
			name: 'verificationToken',
			type: 'string',
			required: true,
			description:
				'Used for the application verification identifier. <a target="_blank" href="https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/event-subscription-configure-/choose-a-subscription-mode/send-notifications-to-developers-server#c589dfb1">Check Doc</a>',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					triggerType: ['webhook'],
				},
			},
		},
		triggerEventProperty,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				{
					displayName: 'Webhook Path',
					name: 'path',
					type: 'string',
					default: '',
					placeholder: 'webhook',
					description: "The final segment of the webhook's URL, both for test and production",
				},
			],
			displayOptions: {
				show: {
					triggerType: ['webhook'],
				},
			},
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/event-subscription-guide/overview">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
};

export class LarkTriggerV2 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...descriptionV2,
		};
	}

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const triggerType = this.getNodeParameter('triggerType', 0);
		if (triggerType === 'webhook') {
			return await larkWebhook(this);
		}

		return {
			noWebhookResponse: true,
		};
	}

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
		return await larkTrigger(this);
	}
}
