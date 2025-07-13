import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import ResourceFactory from '../help/builder/ResourceFactory';

import { configuredOutputs } from '../help/utils';

const resourceBuilder = ResourceFactory.build(__dirname);

export class Lark implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lark',
		name: 'lark',
		icon: 'file:lark_icon.svg',
		group: ['output'],
		version: [1],
		defaultVersion: 1,
		description: 'Consume Lark API',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Lark',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: `={{(${configuredOutputs})($parameter)}}`,
		credentials: [
			{
				name: 'larkCredentialsApi',
				required: true,
			},
		],
		properties: resourceBuilder.build(),
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let responseData: IDataObject = {};
		let returnData = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		const callFunc = resourceBuilder.getCall(resource, operation);

		if (!callFunc) {
			throw new NodeOperationError(
				this.getNode(),
				'No resources and operatons find: ' + resource + '.' + operation,
			);
		}

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				this.logger.debug('call function', {
					resource,
					operation,
					itemIndex,
				});

				responseData = await callFunc.call(this, itemIndex);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject),
					{ itemData: { item: itemIndex } },
				);
				returnData.push(...executionData);
			} catch (error) {
				this.logger.error('call function error', {
					resource,
					operation,
					itemIndex,
					errorMessage: error.message,
					stack: error.stack,
				});

				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.description ?? error.message }),
						{ itemData: { item: itemIndex } },
					);
					returnData.push(...executionErrorData);
					continue;
				} else if (error.name === 'NodeApiError') {
					throw error;
				} else {
					throw new NodeOperationError(this.getNode(), error, {
						message: error.message,
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
