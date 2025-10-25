import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionTypes,
	NodeOperationError,
	IRun,
	IDataObject,
	IExecuteFunctions,
} from 'n8n-workflow';
import { Credentials, FileType } from '../help/type/enums';
import { WSClient } from '../lark-sdk/ws-client';
import { EventDispatcher } from '../lark-sdk/handler/event-handler';
import { triggerEventProperty } from '../help/utils/properties';
import { WORDING } from '../help/wording';
import { ANY_EVENT } from '../lark-sdk/consts';
import RequestUtils from '../help/utils/RequestUtils';

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
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: Credentials.TenantToken,
				required: true,
				displayOptions: {
					show: {
						authentication: [Credentials.TenantToken],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				default: `${Credentials.TenantToken}`,
				options: [
					{
						name: 'Tenant Access Token',
						value: Credentials.TenantToken,
					},
				],
			},
			{
				displayName:
					'This trigger only supports Feishu China. And due to Lark API limitations, you can use just one Lark trigger for each lark bot at a time.',
				name: 'LarkTriggerNotice',
				type: 'notice',
				default: '',
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
						displayName: 'Subscription Docs Event(订阅云文档事件)',
						name: 'subscriptionEventsUi',
						placeholder: 'Add New Subscription',
						type: 'fixedCollection',
						default: {},
						typeOptions: {
							multipleValues: true,
						},
						options: [
							{
								name: 'eventValues',
								displayName: 'New Subscription',
								values: [
									{
										displayName: 'File Type(文件类型)',
										name: 'type',
										type: 'options',
										required: true,
										default: 'bitable',
										options: [
											{
												name: 'Bitable(多维表格)',
												value: FileType.Bitable,
											},
											{
												name: 'Docx(新版文档类型)',
												value: FileType.Docx,
											},
											{
												name: 'Folder(文件夹)',
												value: FileType.Folder,
											},
											{
												name: 'File(文件)',
												value: FileType.File,
											},
											{
												name: 'Slides(幻灯片)',
												value: FileType.Slides,
											},
										],
									},
									{
										displayName: 'File Token(文件唯一标识)',
										name: 'fileId',
										required: true,
										type: 'string',
										default: '',
										description:
											'Document token. For details, <a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/faq">check documentation</a>.',
									},
								],
							},
						],
					},
					{
						displayName: 'Unsubscribe on Deactivate | 停用时取消订阅',
						name: 'unsubscribeOnDeactivate',
						type: 'boolean',
						default: false,
						description: 'Whether to unsubscribe the events on deactivation',
					},
					{
						displayName: 'Callback Toast | 回调提示',
						name: 'callbackToast',
						type: 'string',
						default: '',
						description:
							'Set the toast message displayed to users when the callback is triggered. If not set, no toast will be shown.',
					},
				],
			},
			{
				displayName:
					'Before adding this event, please ensure that you have add the subscription in the options field. <a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/event/subscribe">Open Documentation</a>',
				name: 'subscriptionNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						events: [
							ANY_EVENT,
							'drive.file.bitable_field_changed_v1',
							'drive.file.bitable_record_changed_v1',
						],
					},
				},
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials(Credentials.TenantToken);

		if (!(credentials.appid && credentials.appsecret && credentials.baseUrl)) {
			throw new NodeOperationError(this.getNode(), 'Missing required Lark credentials');
		}

		const options = this.getNodeParameter('options', {}) as IDataObject;
		const callbackToast = (options.callbackToast as string) || undefined;

		const handleSubscribeEvents = async (cmd: 'subscribe' | 'delete_subscribe') => {
			const unsubscribeOnDeactivate = (options.unsubscribeOnDeactivate as boolean) || false;
			if (cmd === 'delete_subscribe' && !unsubscribeOnDeactivate) {
				return;
			}

			if (options.subscriptionEventsUi) {
				const subscriptionEvents = (options.subscriptionEventsUi as IDataObject)
					.eventValues as IDataObject[];

				const subscriptionPromises = subscriptionEvents.map(async (subscription) => {
					const { type, fileId } = subscription;

					return RequestUtils.request.call(this as unknown as IExecuteFunctions, {
						method: cmd === 'subscribe' ? 'POST' : 'DELETE',
						url: `/open-apis/drive/v1/files/${fileId}/${cmd}`,
						qs: {
							file_type: type,
							...(type === FileType.Folder && { event_type: 'file.created_in_folder_v1' }),
						},
					});
				});

				// Wait for all subscription requests to complete
				await Promise.all(subscriptionPromises);
			}
		};

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
			await handleSubscribeEvents('delete_subscribe'); // Unsubscribe from events if needed
		};

		const startWsClient = async () => {
			const events = this.getNodeParameter('events', []) as string[];
			const isAnyEvent = events.includes('any_event');
			const handlers: Record<string, (data: any) => Promise<IDataObject>> = {};

			for (const event of events) {
				handlers[event] = async (data) => {
					let donePromise = undefined;

					donePromise = this.helpers.createDeferredPromise<IRun>();
					this.emit([this.helpers.returnJsonArray(data)], undefined, donePromise);
					// if (donePromise) {
					// 	await donePromise.promise;
					// }

					this.logger.info(`Handled event: ${event}`);

					if (callbackToast) {
						return {
							toast: {
								type: 'info',
								content: callbackToast,
							},
						};
					}

					return {};
				};
			}

			const eventDispatcher = new EventDispatcher({ logger: this.logger, isAnyEvent }).register(
				handlers,
			);

			await wsClient.start({ eventDispatcher });
		};

		if (this.getMode() !== 'manual') {
			await handleSubscribeEvents('subscribe');
			await startWsClient();
			return {
				closeFunction,
			};
		} else {
			const manualTriggerFunction = async () => {
				await handleSubscribeEvents('subscribe');
				await startWsClient();
			};

			return {
				closeFunction,
				manualTriggerFunction,
			};
		}
	}
}
