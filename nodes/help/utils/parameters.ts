import { INodeParameters } from 'n8n-workflow';
import { OperationType, ResourceType } from '../type/enums';

export const configuredOutputs = (parameters: INodeParameters) => {
	if (
		parameters.resource === ResourceType.Message &&
		parameters.operation === OperationType.ParseMessageContent
	) {
		const messageTypes = (parameters.messageTypes as string[]) || [];
		// Return different outputs based on message types
		return messageTypes.map((type: string) => ({
			type: 'main',
			displayName: type,
		}));
	}

	return ['main'];
};

export const hexToRgbInt32 = (hex: string): number => {
	// Remove # if present
	const cleanHex = hex.replace('#', '');

	// Parse RGB values
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	// Convert to int32: (r << 16) | (g << 8) | b
	return (r << 16) | (g << 8) | b;
};
