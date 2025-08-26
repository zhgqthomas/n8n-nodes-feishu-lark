import crypto from 'crypto';

export class AESCipher {
	key: Buffer;

	constructor(key: string) {
		const hash = crypto.createHash('sha256');
		hash.update(key);
		this.key = hash.digest();
	}

	decrypt(encrypt: string) {
		const encryptBuffer = Buffer.from(encrypt, 'base64');
		const decipher = crypto.createDecipheriv(
			'aes-256-cbc',
			this.key,
			encryptBuffer.subarray(0, 16),
		);
		let decrypted = decipher.update(encryptBuffer.subarray(16).toString('hex'), 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}
}
