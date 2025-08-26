import { Logger } from 'n8n-workflow';
import crypto from 'crypto';
import { AESCipher } from '../utils/aes-cipher';
import { CEventType } from '../consts';

export default class RequestHandle {
	aesCipher?: AESCipher;

	verificationToken?: string;

	encryptKey?: string;

	logger: Logger;

	constructor(params: { logger: Logger; encryptKey?: string; verificationToken?: string }) {
		const { encryptKey, verificationToken, logger } = params;
		this.verificationToken = verificationToken;
		this.encryptKey = encryptKey;
		this.logger = logger;

		if (encryptKey) {
			this.aesCipher = new AESCipher(encryptKey);
		}
	}

	parse(data: any) {
		const targetData = (() => {
			const { encrypt, ...rest } = data || {};
			if (encrypt) {
				try {
					return {
						...JSON.parse(this.aesCipher?.decrypt(encrypt)!),
						...rest,
					};
				} catch (e) {
					this.logger.error('parse encrypt data failed');
					return {};
				}
			}

			return rest;
		})();

		// v1和v2版事件的区别：https://open.feishu.cn/document/ukTMukTMukTM/uUTNz4SN1MjL1UzM
		if ('schema' in targetData) {
			const { header, event, ...rest } = targetData;
			return {
				[CEventType]: targetData?.header?.event_type,
				...rest,
				...header,
				...event,
			};
		}
		const { event, ...rest } = targetData;
		return {
			[CEventType]: targetData?.event?.type,
			...event,
			...rest,
		};
	}

	checkIsCardEventValidated(data: any): boolean {
		/**
		 * 1. new message card encrypt ('encrypt' in data)
		 * 2. new message card but not encrypt ('schema' in data)
		 */
		if ('encrypt' in data || 'schema' in data) {
			return this.checkIsEventValidated(data);
		}

		const {
			'x-lark-request-timestamp': timestamp,
			'x-lark-request-nonce': nonce,
			'x-lark-signature': signature,
		} = data.headers;

		if (!this.verificationToken) {
			return true;
		}

		const computedSignature = crypto
			.createHash('sha1')
			.update(timestamp + nonce + this.verificationToken + JSON.stringify(data))
			.digest('hex');

		return computedSignature === signature;
	}

	checkIsEventValidated(data: any): boolean {
		if (!this.encryptKey) {
			return true;
		}

		const {
			'x-lark-request-timestamp': timestamp,
			'x-lark-request-nonce': nonce,
			'x-lark-signature': signature,
		} = data.headers;

		const content = timestamp + nonce + this.encryptKey + JSON.stringify(data);

		const computedSignature = crypto.createHash('sha256').update(content).digest('hex');

		return computedSignature === signature;
	}
}
