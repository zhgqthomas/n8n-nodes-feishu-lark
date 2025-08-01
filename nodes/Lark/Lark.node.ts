import {
	IExecuteFunctions,
	INodeListSearchResult,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';
import ResourceFactory from '../help/builder/ResourceFactory';

import { configuredOutputs } from '../help/utils';
import { Credentials, FileType, OutputType } from '../help/type/enums';
import {
	getFileList,
	larkApiRequestBaseRoleList,
	larkApiRequestTableFieldList,
	larkApiRequestTableList,
	larkApiRequestTableViewList,
} from './GenericFunctions';
import RequestUtils from '../help/utils/RequestUtils';

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
				name: Credentials.Name,
				required: true,
			},
		],
		properties: resourceBuilder.build(),
	};

	methods = {
		listSearch: {
			async searchBitables(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const bitables = await getFileList.call(
					this as unknown as IExecuteFunctions,
					FileType.Bitable,
				);
				return {
					results: bitables.map((bitable) => ({
						name: bitable.name as string,
						value: bitable.token as string,
						url: bitable.url as string,
					})),
				};
			},

			async searchFolders(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const folders = await getFileList.call(
					this as unknown as IExecuteFunctions,
					FileType.Folder,
				);
				return {
					results: folders.map((folder) => ({
						name: folder.name as string,
						value: folder.token as string,
						url: folder.url as string,
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

			async searchTableViews(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const app_token = this.getNodeParameter('app_token', undefined, {
					extractValue: true,
				}) as string;
				const table_id = this.getNodeParameter('table_id', undefined, {
					extractValue: true,
				}) as string;
				const user_id_type = this.getNodeParameter('user_id_type', 'open_id') as string;
				const views = await larkApiRequestTableViewList.call(this as unknown as IExecuteFunctions, {
					app_token,
					table_id,
					user_id_type,
				});
				return {
					results: views.map((view) => ({
						name: view.view_name as string,
						value: view.view_id as string,
					})),
				};
			},

			async searchTableFields(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const app_token = this.getNodeParameter('app_token', undefined, {
					extractValue: true,
				}) as string;
				const table_id = this.getNodeParameter('table_id', undefined, {
					extractValue: true,
				}) as string;
				const fields = await larkApiRequestTableFieldList.call(
					this as unknown as IExecuteFunctions,
					{
						app_token,
						table_id,
					},
				);
				return {
					results: fields.map((field) => ({
						name: field.field_name as string,
						value: field.field_id as string,
					})),
				};
			},

			async searchBaseRoles(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const app_token = this.getNodeParameter('app_token', undefined, {
					extractValue: true,
				}) as string;
				const roles = await larkApiRequestBaseRoleList.call(this as unknown as IExecuteFunctions, {
					app_token,
				});
				return {
					results: roles.map((role) => ({
						name: role.role_name as string,
						value: role.role_id as string,
					})),
				};
			},

			async searchUserIds(
				this: ILoadOptionsFunctions,
				query?: string,
			): Promise<INodeListSearchResult> {
				if (!query) {
					throw new NodeOperationError(this.getNode(), 'Query required for search');
				}

				// Check if query is in email format using regex
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				const body = emailRegex.test(query) ? { emails: [query] } : { mobiles: [query] };

				const results: any[] = [];
				const userIdTypes = ['open_id', 'user_id', 'union_id'];
				for (const userIdType of userIdTypes) {
					const {
						data: { user_list: users },
					} = await RequestUtils.request.call(this as unknown as IExecuteFunctions, {
						method: 'POST',
						url: '/open-apis/contact/v3/users/batch_get_id',
						qs: {
							user_id_type: userIdType,
						},
						body,
					});

					if (!users[0].user_id) {
						throw new NodeOperationError(this.getNode(), `No user found for: ${query}`);
					}

					results.push({
						name: userIdType,
						value: users[0]?.user_id || '',
					});
				}

				return {
					results,
				};
			},

			async searchDocuments(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const allDocs: IDataObject[] = [];

				const docList = await getFileList.call(this as unknown as IExecuteFunctions, FileType.Doc);
				allDocs.push(...docList);

				const docxList = await getFileList.call(
					this as unknown as IExecuteFunctions,
					FileType.Docx,
				);
				allDocs.push(...docxList);

				return {
					results: allDocs.map((doc) => ({
						name: doc.name as string,
						value: doc.token as string,
						url: doc.url as string,
					})),
				};
			},

			async searchSpreadsheets(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const spreadsheets = await getFileList.call(
					this as unknown as IExecuteFunctions,
					FileType.Sheet,
				);
				return {
					results: spreadsheets.map((spreadsheet) => ({
						name: spreadsheet.name as string,
						value: spreadsheet.token as string,
						url: spreadsheet.url as string,
					})),
				};
			},

			async searchFiles(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const fileType = this.getNodeParameter('space_file_type', undefined) as FileType;
				if (!fileType) {
					throw new NodeOperationError(this.getNode(), 'File type is required');
				}

				const files = await getFileList.call(this as unknown as IExecuteFunctions, fileType);
				return {
					results: files.map((file) => ({
						name: file.name as string,
						value: file.token as string,
						url: file.url as string,
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
