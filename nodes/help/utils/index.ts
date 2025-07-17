import { INodeParameters, NodeConnectionType } from 'n8n-workflow';
import { OperationType, ResourceType } from '../type/enums';

export const configuredOutputs = (parameters: INodeParameters) => {
	if (
		parameters.resource === ResourceType.Message &&
		parameters.operation === OperationType.ParseMessageContent
	) {
		const messageTypes = (parameters.messageTypes as string[]) || [];
		// Return different outputs based on message types
		return messageTypes.map((type: string) => ({
			type: NodeConnectionType.Main,
			displayName: type,
		}));
	}

	return [NodeConnectionType.Main];
};
