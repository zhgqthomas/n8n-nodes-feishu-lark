import { Logger } from 'n8n-workflow';
import RequestHandle from './request-handle';
import { CAppTicket, CEventType } from '../consts';
import { Cache } from '../interfaces';
import { internalCache } from './cache';

export class CardActionHandler {
	verificationToken: string = '';

	encryptKey: string = '';

	requestHandle?: RequestHandle;

	cardHandler: Function;

	handles: Map<string, Function> = new Map();

	cache: Cache;

	logger: Logger;

	constructor(
		params: {
			logger: Logger;
			verificationToken?: string;
			encryptKey?: string;
		},
		cardHandler: Function,
	) {
		const { verificationToken, encryptKey, logger } = params;

		this.encryptKey = encryptKey || '';
		this.verificationToken = verificationToken || '';

		this.cardHandler = cardHandler;

		this.logger = logger;

		this.requestHandle = new RequestHandle({
			encryptKey,
			verificationToken,
			logger: this.logger,
		});

		this.cache = internalCache;

		this.registerAppTicketHandle();

		this.logger.info('card-action-handle is ready');
	}

	private registerAppTicketHandle() {
		this.register({
			app_ticket: async (data: any) => {
				const { app_ticket, app_id } = data;

				if (app_ticket) {
					await this.cache.set(CAppTicket, app_ticket, undefined, {
						namespace: app_id,
					});
					this.logger.debug('set app ticket');
				} else {
					this.logger.warn('response not include app ticket');
				}
			},
		});
	}

	private register(handles: Record<string, Function>) {
		Object.keys(handles).forEach((key) => {
			this.handles.set(key, handles[key]);
			this.logger.debug(`register ${key} handle`);
		});

		return this;
	}

	async invoke(data: any) {
		if (!this.requestHandle?.checkIsCardEventValidated(data)) {
			this.logger.warn('verification failed event');
			return undefined;
		}

		const targetData = this.requestHandle?.parse(data);

		const type = targetData[CEventType];
		if (this.handles.has(type)) {
			try {
				const ret = await this.handles.get(type)!(targetData);
				return ret;
			} catch (e) {
				this.logger.error(e);
				return undefined;
			}
		}

		try {
			const result = await this.cardHandler(targetData);
			this.logger.debug('execute card handle');
			return result;
		} catch (e) {
			this.logger.error(e);
		}

		return undefined;
	}
}
