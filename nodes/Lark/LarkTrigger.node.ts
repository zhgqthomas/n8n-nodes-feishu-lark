import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
	NodeOperationError,
	IRun,
} from 'n8n-workflow';
import { Credentials } from '../help/type/enums';
import { WSClient } from '../lark-sdk/ws-client';
import { EventDispatcher } from '../lark-sdk/handler/event-handler';
import { triggerEventProperty } from '../help/utils/properties';

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
				name: Credentials.TenantToken,
				required: true,
			},
		],
		properties: [
			{
				displayName:
					'Due to Lark API limitations, you can use just one Lark trigger for each lark bot at a time. And this trigger only supports Feishu China.',
				name: 'LarkTriggerNotice',
				type: 'notice',
				default: '',
			},
			triggerEventProperty,
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials(Credentials.TenantToken);

		if (!(credentials.appid && credentials.appsecret)) {
			throw new NodeOperationError(this.getNode(), 'Missing required Lark credentials');
		}
		const appId = credentials['appid'] as string;
		const appSecret = credentials['appsecret'] as string;
		const baseUrl = credentials['baseUrl'] as string;

		const wsClient: WSClient = new WSClient({
			appId,
			appSecret,
			domain: `${baseUrl}`, // Use the base URL from credentials
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
					this.emit([this.helpers.returnJsonArray(data)], undefined, donePromise);
					// if (donePromise) {
					// 	await donePromise.promise;
					// }

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
