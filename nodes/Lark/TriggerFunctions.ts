import {
	IRun,
	ITriggerFunctions,
	ITriggerResponse,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeOperationError,
} from 'n8n-workflow';
import { Credentials } from '../help/type/enums';
import { WSClient } from '../lark-sdk/ws-client';
import { EventDispatcher } from '../lark-sdk/handler/event-handler';
import { ANY_EVENT } from '../lark-sdk/consts';
import { IDataObject } from 'n8n-workflow';
import { AESCipher } from '../lark-sdk/utils/aes-cipher';

export const generateChallenge = (
	data: any,
	options: {
		encryptKey: string;
	},
) => {
	if ('encrypt' in data && !options.encryptKey) {
		throw new Error('auto-challenge need encryptKey, please check for missing in dispatcher');
	}

	const targetData =
		'encrypt' in data ? JSON.parse(new AESCipher(options.encryptKey).decrypt(data.encrypt)) : data;

	return {
		isChallenge: targetData.type === 'url_verification',
		challenge: {
			challenge: targetData.challenge,
		},
	};
};

export async function larkWebhook(context: IWebhookFunctions): Promise<IWebhookResponseData> {
	const encryptKey = context.getNodeParameter('encryptKey', 0) as string;
	if (!encryptKey) {
		throw new NodeOperationError(context.getNode(), 'Missing required Webhook encrypt key');
	}

	const verificationToken = context.getNodeParameter('verificationToken', 0) as string;
	if (!verificationToken) {
		throw new NodeOperationError(context.getNode(), 'Missing required Webhook verification token');
	}

	const res = context.getResponseObject();
	const reqData = context.getBodyData() as IDataObject;

	// check if the request is a challenge request
	const { isChallenge, challenge } = generateChallenge(reqData, {
		encryptKey,
	});
	if (isChallenge) {
		res.json(challenge);
		return {
			noWebhookResponse: true,
		};
	} else {
		// webhook return 200 status back to lark
		res.end();
	}

	// handle event request
	const events = context.getNodeParameter('events', []) as string[];
	const isAnyEvent = events.includes(ANY_EVENT);
	const handlers: Record<string, (data: any) => Promise<void>> = {};

	for (const event of events) {
		handlers[event] = async (data) => data;
	}

	const headerData = context.getHeaderData();
	const data = Object.assign(
		Object.create({
			headers: headerData,
		}),
		reqData,
	);
	const eventDispatcher = new EventDispatcher({
		logger: context.logger,
		isAnyEvent,
		encryptKey,
		verificationToken,
	}).register(handlers);
	const eventData = await eventDispatcher.invoke(data, { needCheck: true });
	if (eventData) {
		return {
			workflowData: [context.helpers.returnJsonArray([eventData as unknown as IDataObject])],
		};
	}

	return {
		noWebhookResponse: true,
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
		const isAnyEvent = events.includes(ANY_EVENT);
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

	const triggerType = context.getNodeParameter('triggerType', 'websocket') as string;
	const isWebSocket = triggerType === 'websocket';

	if (context.getMode() !== 'manual') {
		if (isWebSocket) {
			await startWsClient();
		}
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
