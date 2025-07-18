import {
	IExecuteFunctions,
	INodeListSearchResult,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import ResourceFactory from '../help/builder/ResourceFactory';

import { configuredOutputs } from '../help/utils';
import { OutputType } from '../help/type/enums';
import { larkApiRequestBitableList, larkApiRequestTableList } from './GenericFunctions';

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

	methods = {
		listSearch: {
			async searchBitables(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const bitables = await larkApiRequestBitableList.call(this as unknown as IExecuteFunctions);
				return {
					results: bitables.map((bitable) => ({
						name: bitable.name as string,
						value: bitable.token as string,
						url: bitable.url as string,
					})),
				};
			},
			async searchTables(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const appToken = this.getNodeParameter('app_token', undefined, {
					extractValue: true,
				}) as string;
				const tables = await larkApiRequestTableList.call(
					this as unknown as IExecuteFunctions,
					appToken,
				);
				return {
					results: tables.map((table) => ({
						name: table.name as string,
						value: table.table_id as string,
					})),
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let returnData: INodeExecutionData[][] = Array.from({ length: 1 }, () => []);

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

				const responseData = await callFunc.call(this, itemIndex);
				const { outputType } = responseData;
				if (!outputType) {
					// Default to single output
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: itemIndex } },
					);
					returnData[0].push(...executionData);
				} else if (outputType === OutputType.Multiple) {
					const { outputData } = responseData as { outputData: INodeExecutionData[][] };
					returnData = outputData;
				} else {
					return [];
				}
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
					returnData[0].push(...executionErrorData);
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

		return returnData;
	}
}
