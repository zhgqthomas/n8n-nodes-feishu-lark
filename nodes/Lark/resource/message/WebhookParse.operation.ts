import {
	IDataObject,
	IExecuteFunctions,
	NodeOperationError,
	WEBHOOK_NODE_TYPE,
} from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { triggerEventProperty } from '../../../help/utils/properties';
import { AESCipher } from '../../../lark-sdk/utils/aes-cipher';
import { ANY_EVENT } from '../../../lark-sdk/consts';
import { EventDispatcher } from '../../../lark-sdk/handler/event-handler';

const generateChallenge = (
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

export default {
	name: WORDING.ParseWebhookMessage,
	value: OperationType.ParseWebhookMessage,
	order: 10,
	options: [
		{
			displayName: 'Encrypt Key',
			name: 'encryptKey',
			type: 'string',
			required: true,
			description:
				'Used to encrypt the transmission. <a target="_blank" href="https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/event-subscription-configure-/choose-a-subscription-mode/send-notifications-to-developers-server#e0dff53d">Check Doc</a>.',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Verification Token',
			name: 'verificationToken',
			type: 'string',
			required: true,
			description:
				'Used for the application verification identifier. <a target="_blank" href="https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/event-subscription-configure-/choose-a-subscription-mode/send-notifications-to-developers-server#c589dfb1">Check Doc</a>.',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		triggerEventProperty,
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/event-subscription-guide/event-subscriptions/event-subscription-configure-/choose-a-subscription-mode/send-notifications-to-developers-server">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		// Make sure there is a Webhook node in the workflow
		const connectedNodes = this.getParentNodes(this.getNode().name);
		if (!connectedNodes.some(({ type }) => type === WEBHOOK_NODE_TYPE)) {
			throw new NodeOperationError(
				this.getNode(),
				new Error('No Webhook node found in the workflow'),
				{
					description:
						'Insert a Webhook node to your workflow and set the “Respond” parameter to “Using Respond to Webhook Node” ',
				},
			);
		}

		const encryptKey = this.getNodeParameter('encryptKey', index) as string;
		const verificationToken = this.getNodeParameter('verificationToken', index) as string;

		const {
			json: { body: reqData, headers: headerData },
		} = this.getInputData()[index];

		// check if the request is a challenge request
		const { isChallenge, challenge } = generateChallenge(reqData, {
			encryptKey,
		});
		if (isChallenge) {
			return {
				parsed: true,
				data: challenge,
			};
		}

		// handle event request
		const events = this.getNodeParameter('events', index, []) as string[];
		const isAnyEvent = events.includes(ANY_EVENT);
		const handlers: Record<string, (data: any) => Promise<void>> = {};

		for (const event of events) {
			handlers[event] = async (data) => data;
		}

		const data = Object.assign(
			Object.create({
				headers: headerData,
			}),
			reqData,
		);
		const eventDispatcher = new EventDispatcher({
			logger: this.logger,
			isAnyEvent,
			encryptKey,
			verificationToken,
		}).register(handlers);
		const eventData = await eventDispatcher.invoke(data, { needCheck: true });
		if (eventData) {
			return {
				parsed: true,
				data: eventData,
			};
		}

		return {
			parsed: false,
		};
	},
} as ResourceOperation;
