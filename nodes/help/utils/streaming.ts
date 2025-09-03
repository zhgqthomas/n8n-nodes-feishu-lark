import { IExecuteFunctions } from 'n8n-workflow';
import { v4 as uuidv4 } from 'uuid';
import RequestUtils from './RequestUtils';

export type ChunkType = 'begin' | 'item' | 'end' | 'error';
export interface StructuredChunk {
	type: ChunkType;
	content?: string;
	metadata: {
		nodeId: string;
		nodeName: string;
		timestamp: number;
		runIndex: number;
		itemIndex: number;
	};
}

export interface StreamingEventHandlers {
	onBeginMessage: (nodeId: string, runIndex?: number) => void;
	onChunk: (chunk: string, nodeId?: string, runIndex?: number) => void;
	onEndMessage: (nodeId: string, runIndex?: number) => void;
}

export type ChatMessage<T = Record<string, unknown>> = ChatMessageComponent<T> | ChatMessageText;

export interface ChatMessageComponent<T = Record<string, unknown>> extends ChatMessageBase {
	type: 'component';
	key: string;
	arguments: T;
}

export interface ChatMessageText extends ChatMessageBase {
	type?: 'text';
	text: string;
}

interface ChatMessageBase {
	id: string;
	transparent?: boolean;
	sender: 'user' | 'bot';
	files?: File[];
}

export interface NodeRunData {
	content: string;
	isComplete: boolean;
	message: ChatMessageText;
}

/**
 * Function throttling decorator
 * Limits function execution to once within specified time interval to prevent frequent calls
 *
 */
function pThrottle<T extends (...args: any[]) => Promise<any>>(fn: T, wait: number): T {
	// Record last execution time
	let lastTime = 0;

	return (async (...args: any[]) => {
		const now = Date.now();

		// Check if wait time has elapsed
		if (now - lastTime >= wait) {
			// Update last execution time and execute function
			lastTime = now;
			return await fn(...args);
		} else {
			// Calls within wait period are discarded, return empty Promise
			return Promise.resolve();
		}
	}) as T;
}

export function generateStreamingCardMessage(content: string) {
	return {
		schema: '2.0',
		config: {
			update_multi: true,
			streaming_mode: false,
		},
		body: {
			direction: 'vertical',
			padding: '12px 12px 12px 12px',
			elements: [
				{
					tag: 'markdown',
					content,
					text_align: 'left',
					text_size: 'normal',
					margin: '0px 0px 0px 0px',
				},
			],
		},
	};
}

/**
 * Throttled message update function
 * Limit update frequency to once per 200ms to prevent excessive API calls
 */
export async function updateStreamingMessage(
	context: IExecuteFunctions,
	larkMessageId: string,
	message: string,
): Promise<void> {
	return await RequestUtils.request.call(context, {
		method: 'PATCH',
		url: `/open-apis/im/v1/messages/${larkMessageId}`,
		body: {
			content: JSON.stringify(generateStreamingCardMessage(message)),
		},
	});
}

const throttledUpdateMessage = pThrottle(updateStreamingMessage, 200);

export async function handleStreamingChunk(
	context: IExecuteFunctions,
	chunk: string,
	nodeId: string | undefined,
	streamingManager: StreamingMessageManager,
	receivedMessage: ChatMessageText | null,
	messages: ChatMessage[],
	larkMessageId: string,
	runIndex?: number,
): Promise<void> {
	try {
		// Only skip empty chunks, but not whitespace only chunks
		if (chunk === '') {
			return;
		}

		if (!nodeId) {
			// Simple single-node streaming (backwards compatibility)
			if (!receivedMessage) {
				receivedMessage = createBotMessage(larkMessageId);
				messages.push(receivedMessage);
			}

			const updatedMessage: ChatMessageText = {
				...receivedMessage,
				text: receivedMessage.text + chunk,
			};

			updateMessageInArray(messages, receivedMessage.id, updatedMessage);
			receivedMessage = updatedMessage;
		} else {
			// Multi-run streaming with separate messages per runIndex
			// Create message on first chunk if it doesn't exist
			let runMessage = streamingManager.getRunMessage(nodeId, runIndex);
			if (!runMessage) {
				runMessage = streamingManager.addRunToActive(nodeId, runIndex, larkMessageId);
				messages.push(runMessage);
			}

			// Add chunk to the run
			const updatedMessage = streamingManager.addChunkToRun(nodeId, chunk, runIndex);
			if (updatedMessage) {
				updateMessageInArray(messages, updatedMessage.id, updatedMessage);
			}
		}

		throttledUpdateMessage(
			context,
			larkMessageId,
			(
				messages.find(
					(message) => message.id === larkMessageId && message.type === 'text',
				) as ChatMessageText
			)?.text,
		);
	} catch (error) {
		context.logger.error('Error handling stream chunk:', error);
		// Continue gracefully without breaking the stream
	}
}

export function handleNodeStart(
	nodeId: string,
	streamingManager: StreamingMessageManager,
	runIndex?: number,
): void {
	// Just register the run as starting, don't create a message yet
	// Message will be created when first chunk arrives
	streamingManager.registerRunStart(nodeId, runIndex);
}

export function handleNodeComplete(
	nodeId: string,
	streamingManager: StreamingMessageManager,
	runIndex?: number,
): void {
	streamingManager.removeRunFromActive(nodeId, runIndex);
}

export function createBotMessage(id?: string): ChatMessageText {
	return {
		id: id ?? uuidv4(),
		type: 'text',
		text: '',
		sender: 'bot',
	};
}

export function updateMessageInArray(
	messages: ChatMessage[],
	messageId: string,
	updatedMessage: ChatMessageText,
): void {
	const messageIndex = messages.findIndex((msg: ChatMessage) => msg.id === messageId);
	if (messageIndex === -1) {
		throw new Error(`Can't update message. No message with id ${messageId} found`);
	}

	messages[messageIndex] = updatedMessage;
}

// Create a transform stream that parses newline-delimited JSON
export function createLineParser(): TransformStream<Uint8Array, StructuredChunk> {
	let buffer = '';
	const decoder = new TextDecoder();

	return new TransformStream({
		transform(chunk, controller) {
			buffer += decoder.decode(chunk, { stream: true });

			// Process all complete lines in the buffer
			const lines = buffer.split('\n');
			buffer = lines.pop() ?? ''; // Keep incomplete line in buffer

			for (const line of lines) {
				if (line.trim()) {
					try {
						const parsed = JSON.parse(line) as StructuredChunk;
						controller.enqueue(parsed);
					} catch (error) {
						// Handle non-JSON lines as plain text
						controller.enqueue({
							type: 'item',
							content: line,
						} as StructuredChunk);
					}
				}
			}
		},

		flush(controller) {
			// Process any remaining buffer content
			if (buffer.trim()) {
				try {
					const parsed = JSON.parse(buffer) as StructuredChunk;
					controller.enqueue(parsed);
				} catch (error) {
					controller.enqueue({
						type: 'item',
						content: buffer,
					} as StructuredChunk);
				}
			}
		},
	});
}

export class StreamingMessageManager {
	private nodeRuns = new Map<string, NodeRunData>();
	private runOrder: string[] = [];
	private activeRuns = new Set<string>();

	constructor() {}

	private getRunKey(nodeId: string, runIndex?: number): string {
		if (runIndex !== undefined) {
			return `${nodeId}-${runIndex}`;
		}
		return nodeId;
	}

	initializeRun(nodeId: string, runIndex?: number, id?: string): ChatMessageText {
		const runKey = this.getRunKey(nodeId, runIndex);
		if (!this.nodeRuns.has(runKey)) {
			const message = createBotMessage(id);
			this.nodeRuns.set(runKey, {
				content: '',
				isComplete: false,
				message,
			});
			this.runOrder.push(runKey);
			return message;
		}
		return this.nodeRuns.get(runKey)!.message;
	}

	registerRunStart(nodeId: string, runIndex?: number): void {
		const runKey = this.getRunKey(nodeId, runIndex);
		this.activeRuns.add(runKey);
	}

	addRunToActive(nodeId: string, runIndex?: number, id?: string): ChatMessageText {
		const runKey = this.getRunKey(nodeId, runIndex);
		this.activeRuns.add(runKey);
		return this.initializeRun(nodeId, runIndex, id);
	}

	removeRunFromActive(nodeId: string, runIndex?: number): void {
		const runKey = this.getRunKey(nodeId, runIndex);
		this.activeRuns.delete(runKey);
		const runData = this.nodeRuns.get(runKey);
		if (runData) {
			runData.isComplete = true;
		}
	}

	addChunkToRun(nodeId: string, chunk: string, runIndex?: number): ChatMessageText | null {
		const runKey = this.getRunKey(nodeId, runIndex);
		const runData = this.nodeRuns.get(runKey);
		if (runData) {
			runData.content += chunk;
			// Create a new message object to trigger Vue reactivity
			const updatedMessage: ChatMessageText = {
				...runData.message,
				text: runData.content,
			};
			runData.message = updatedMessage;
			return updatedMessage;
		}
		return null;
	}

	getRunMessage(nodeId: string, runIndex?: number): ChatMessageText | null {
		const runKey = this.getRunKey(nodeId, runIndex);
		const runData = this.nodeRuns.get(runKey);
		return runData?.message ?? null;
	}

	areAllRunsComplete(): boolean {
		return Array.from(this.nodeRuns.values()).every((data) => data.isComplete);
	}

	getRunCount(): number {
		return this.runOrder.length;
	}

	getActiveRunCount(): number {
		return this.activeRuns.size;
	}

	getAllMessages(): ChatMessageText[] {
		return this.runOrder
			.map((key) => this.nodeRuns.get(key)?.message)
			.filter((message): message is ChatMessageText => message !== undefined);
	}

	reset(): void {
		this.nodeRuns.clear();
		this.runOrder = [];
		this.activeRuns.clear();
	}
}
