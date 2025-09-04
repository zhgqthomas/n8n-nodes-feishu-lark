import { IDataObject, IExecuteFunctions, NodeApiError, NodeOperationError } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import {
	ChatMessage,
	ChatMessageText,
	createLineParser,
	generateStreamingCardMessage,
	handleNodeComplete,
	handleNodeStart,
	handleStreamingChunk,
	StreamingEventHandlers,
	StreamingMessageManager,
	updateStreamingMessage,
} from '../../../help/utils/streaming';
import { DESCRIPTIONS } from '../../../help/description';
import RequestUtils from '../../../help/utils/RequestUtils';
import { parseJsonParameter } from '../../GenericFunctions';

export default {
	name: WORDING.SendStreamMessage,
	value: OperationType.SendStreamMessage,
	order: 100,
	options: [
		{
			displayName:
				'Tip: Get a feel with the quick <a href="https://github.com/zhgqthomas/n8n-nodes-feishu-lark/blob/main/README.md#send-streaming-message" target="_blank">tutorial</a> or see an <a href="https://github.com/zhgqthomas/n8n-nodes-feishu-lark/blob/main/demo/send_streaming_message.json" target="_blank">example</a> of how this node works',
			name: 'streamMessageStarterCallout',
			type: 'callout',
			default: '',
		},
		DESCRIPTIONS.RECEIVE_ID_TYPE,
		{
			...DESCRIPTIONS.MEMBER_ID,
			displayName: 'Receive ID(接收 ID)',
			name: 'receive_id',
		},
		{
			displayName: 'Webhook URL',
			name: 'webhook_url',
			type: 'string',
			required: true,
			hint: 'Webhook node need to use POST method to receive the message',
			default: '',
		},
		DESCRIPTIONS.REQUEST_BODY,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [
				{
					displayName: 'Bearer Token',
					name: 'bearer_token',
					type: 'string',
					hint: 'Bearer token for authenticating with the webhook',
					default: '',
					typeOptions: {
						password: true,
					},
				},
				{
					displayName: 'Initial Message',
					name: 'initial_message',
					type: 'string',
					default: 'Thinking...',
					typeOptions: {
						rows: 2,
					},
					description: 'Default messages shown at the start of the chat, one per line',
				},
				{
					displayName: 'Timeout(minutes)',
					name: 'timeout',
					type: 'number',
					default: 10,
					typeOptions: {
						minValue: 1,
						maxValue: 30,
						numberPrecision: 0,
					},
				},
			],
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		// Send initial message
		const receive_id_type = this.getNodeParameter('receive_id_type', index, 'open_id') as string;
		const receive_id = this.getNodeParameter('receive_id', index, undefined, {
			extractValue: true,
		}) as string;
		const webhookUrl = this.getNodeParameter('webhook_url', index) as string;
		const requestBody = this.getNodeParameter('body', index) as IDataObject;

		const options = this.getNodeParameter('options', index) as IDataObject;
		const initialMessage = (options.initial_message as string) || 'Thinking...';
		const bearer_token = (options.bearer_token as string) || '';

		const { data } = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/im/v1/messages`,
			qs: {
				receive_id_type,
			},
			body: {
				receive_id,
				msg_type: 'interactive',
				content: JSON.stringify(generateStreamingCardMessage(initialMessage)),
			},
		});

		// Get the message ID for update purpose
		const { message_id: larkMessageId } = data;

		// Initialize streaming manager and messages
		const receivedMessage: ChatMessageText | null = null;
		const streamingManager = new StreamingMessageManager();
		const messages: ChatMessage[] = [];

		const headers: IDataObject = {};
		if (bearer_token) {
			headers['Authorization'] = `Bearer ${bearer_token}`;
		}

		const handlers: StreamingEventHandlers = {
			onChunk: (chunk: string, nodeId?: string, runIndex?: number) => {
				handleStreamingChunk(
					this,
					chunk,
					nodeId,
					streamingManager,
					receivedMessage,
					messages,
					larkMessageId,
					runIndex,
				);
			},
			onBeginMessage: (nodeId: string, runIndex?: number) => {
				handleNodeStart(nodeId, streamingManager, runIndex);
			},
			onEndMessage: (nodeId: string, runIndex?: number) => {
				handleNodeComplete(nodeId, streamingManager, runIndex);
			},
		};

		const eventPromise = new Promise(async (resolve, reject) => {
			try {
				const response = await fetch(webhookUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'text/plain',
						...headers,
					},
					body: JSON.stringify(parseJsonParameter(requestBody, this.getNode(), index)),
				});

				if (!response.ok) {
					const errorText = await response.text();
					reject(
						new NodeApiError(this.getNode(), {
							message: `Error when call webhook api. Error: ${errorText}`,
							code: response.status,
						}),
					);
					return;
				}

				if (!response.body) {
					reject(
						new NodeApiError(this.getNode(), {
							message: 'Webhook Response body is not readable',
							code: 500,
						}),
					);
					return;
				}

				// Process the stream
				const reader = response.body.pipeThrough(createLineParser()).getReader();
				let hasReceivedChunks = false;

				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						const nodeId = value.metadata?.nodeId || 'unknown';
						const runIndex = value.metadata?.runIndex;

						switch (value.type) {
							case 'begin':
								handlers.onBeginMessage(nodeId, runIndex);
								break;
							case 'item':
								hasReceivedChunks = true;
								handlers.onChunk(value.content ?? '', nodeId, runIndex);
								break;
							case 'end':
								handlers.onEndMessage(nodeId, runIndex);
								break;
							case 'error':
								hasReceivedChunks = true;
								handlers.onChunk(`Error: ${value.content ?? 'Unknown error'}`, nodeId, runIndex);
								handlers.onEndMessage(nodeId, runIndex);
								break;
						}
					}
				} finally {
					reader.releaseLock();
				}

				resolve(hasReceivedChunks);
			} catch (error) {
				// Catch any unexpected errors (network errors, parsing errors, etc.)
				reject(
					new NodeApiError(this.getNode(), {
						message: `Unexpected error while processing stream: ${error instanceof Error ? error.message : 'Unknown error'}`,
						code: 500,
					}),
				);
			}
		});

		const timeoutInMinutes = (options.timeout as number) || 10;
		const timeoutPromise = new Promise<void>((_resolve, reject) => {
			setTimeout(
				() => {
					reject(
						new NodeApiError(this.getNode(), {
							message: 'Timeout reached while waiting for the operation to complete',
							code: 500,
						}),
					);
				},
				timeoutInMinutes * 60 * 1000,
			);
		});

		await Promise.race([eventPromise, timeoutPromise]);
		const output = streamingManager
			.getAllMessages()
			.find(
				(message) => message.id === larkMessageId && message.type === 'text',
			) as ChatMessageText;

		if (output) {
			await updateStreamingMessage(this, larkMessageId, output.text);

			return {
				output: output.text,
			};
		}

		throw new NodeOperationError(this.getNode(), {
			message: 'No output received',
		});
	},
} as ResourceOperation;
