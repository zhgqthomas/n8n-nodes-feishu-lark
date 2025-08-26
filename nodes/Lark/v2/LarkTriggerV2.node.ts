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
				'Due to Lark API limitations, you can use just one Lark trigger for each lark bot at a time',
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
		triggerEventProperty,
		{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add Field',
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
		console.log('webhook called');
		const triggerType = this.getNodeParameter('triggerType', 0);
		if (triggerType === 'webhook') {
			return await larkWebhook(this);
		}

		return {
			workflowData: [[]],
		};
	}

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
		console.log('trigger called');
		const triggerType = this.getNodeParameter('triggerType', 0);
		if (triggerType === 'webhook') {
			return undefined;
		}
		return await larkTrigger(this);
	}
}
