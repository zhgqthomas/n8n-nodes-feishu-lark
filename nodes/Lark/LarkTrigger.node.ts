import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
	NodeOperationError,
	IRun,
} from 'n8n-workflow';
import { WSClient } from '../wsclient';
import { EventDispatcher } from '../wsclient/dispatcher';

export class LarkTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lark Trigger',
		name: 'larkTrigger',
		icon: 'file:lark_icon.svg',
		group: ['trigger'],
		version: [1],
		defaultVersion: 1,
		subtitle: '=Events: {{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow on Lark events',
		defaults: {
			name: 'Lark Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'larkCredentialsApi',
				required: true,
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
				displayName: 'Trigger On',
				name: 'events',
				type: 'multiOptions',
				required: true,
				options: [
					{
						name: 'Add Reaction for Message(新增消息表情回复)',
						value: 'im.message.reaction.created_v1',
						description: 'This event will be triggered when a reaction is added to a message',
					},
					{
						name: 'Any Event(所有事件)',
						value: 'any_event',
						description: 'Triggers on any event',
					},
					{
						name: 'Base App Field Changed(多维表格字段变更)',
						value: 'drive.file.bitable_field_changed_v1',
						description: 'This event is triggered when a subscribed Base app field changes',
					},
					{
						name: 'Base App Record Changed(多维表格记录变更)',
						value: 'drive.file.bitable_record_changed_v1',
						description:
							'This event is triggered when a subscribed multi-dimensional table record changes',
					},
					{
						name: 'Card Postback Interaction(卡片回传交互)',
						value: 'card.action.trigger',
						description:
							'This callback is triggered when the user clicks on the component configured with postback interaction on the card',
					},
					{
						name: 'Delete Reaction for Message(删除消息表情回复)',
						value: 'im.message.reaction.deleted_v1',
						description: 'This event will be triggered when the message reaction is deleted',
					},
					{
						name: 'Receive Message(接收消息)',
						value: 'im.message.receive_v1',
						description: 'This event is triggered when the bot receives a message sent by a user',
					},
				],
				default: [],
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials('larkCredentialsApi');

		if (!(credentials.appid && credentials.appsecret)) {
			throw new NodeOperationError(this.getNode(), 'Missing required Lark credentials');
		}
		const appId = credentials['appid'] as string;
		const appSecret = credentials['appsecret'] as string;
		const baseUrl = credentials['baseUrl'] as string;
		// const nodeVersion = this.getNode().typeVersion;

		const wsClient: WSClient = new WSClient({
			appId,
			appSecret,
			domain: `https://${baseUrl}`, // Use the base URL from credentials
			logger: this.logger,
			helpers: this.helpers,
		});

		const closeFunction = async () => {
			await wsClient.stop(); // Close the WebSocket connection
		};

		const startWsClient = async () => {
			const events = this.getNodeParameter('events', []) as string[];
			const isAnyEvent = events.includes('any_event');
			const handlers: Record<string, (data: any) => Promise<void>> = {};

			for (const event of events) {
				handlers[event] = async (data) => {
					let donePromise = undefined;

					donePromise = this.helpers.createDeferredPromise<IRun>();
					this.emit([this.helpers.returnJsonArray([data])], undefined, donePromise);

					if (donePromise) {
						await donePromise.promise;
					}

					this.logger.info(`Handled event: ${event}`);
				};
			}

			const eventDispatcher = new EventDispatcher({ logger: this.logger, isAnyEvent }).register(
				handlers,
			);

			await wsClient.start({ eventDispatcher });
		};

		if (this.getMode() !== 'manual') {
			await startWsClient();
			return {
				closeFunction,
			};
		} else {
			const manualTriggerFunction = async () => {
				await startWsClient();
			};

			return {
				closeFunction,
				manualTriggerFunction,
			};
		}
	}
}
