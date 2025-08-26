import {
	IRun,
	ITriggerFunctions,
	ITriggerResponse,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeOperationError,
} from 'n8n-workflow';
import { Credentials } from '../help/type/enums';
import { WSClient } from '../wsclient';
import { EventDispatcher } from '../wsclient/dispatcher';

export async function larkWebhook(context: IWebhookFunctions): Promise<IWebhookResponseData> {
	return {
		workflowData: [[]],
	};
}

export async function larkTrigger(context: ITriggerFunctions): Promise<ITriggerResponse> {
	const credentials = await context.getCredentials(Credentials.TenantToken);

	if (!(credentials.appid && credentials.appsecret)) {
		throw new NodeOperationError(context.getNode(), 'Missing required Lark credentials');
	}
	const appId = credentials['appid'] as string;
	const appSecret = credentials['appsecret'] as string;
	const baseUrl = credentials['baseUrl'] as string;

	const wsClient: WSClient = new WSClient({
		appId,
		appSecret,
		domain: `${baseUrl}`, // Use the base URL from credentials
		logger: context.logger,
		helpers: context.helpers,
	});

	const closeFunction = async () => {
		await wsClient.stop(); // Close the WebSocket connection
	};

	const startWsClient = async () => {
		const events = context.getNodeParameter('events', []) as string[];
		const isAnyEvent = events.includes('any_event');
		const handlers: Record<string, (data: any) => Promise<void>> = {};

		for (const event of events) {
			handlers[event] = async (data) => {
				let donePromise = undefined;

				donePromise = context.helpers.createDeferredPromise<IRun>();
				context.emit([context.helpers.returnJsonArray(data)], undefined, donePromise);
				// if (donePromise) {
				// 	await donePromise.promise;
				// }

				context.logger.info(`Handled event: ${event}`);
			};
		}

		const eventDispatcher = new EventDispatcher({ logger: context.logger, isAnyEvent }).register(
			handlers,
		);

		await wsClient.start({ eventDispatcher });
	};

	if (context.getMode() !== 'manual') {
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
