import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
import zodToJsonSchema from 'zod-to-json-schema';
import z from 'zod';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { createStdioClientTransport } from '../../../mcp/utils';
import { CLIENT_NAME, CLIENT_VERSION, REQUEST_OPTIONS } from '../../../mcp/constants';

export default {
	name: WORDING.GetToolList,
	value: OperationType.ListTools,
	order: 100,
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const transport = await createStdioClientTransport(this);

		try {
			const client = new Client({
				name: CLIENT_NAME,
				version: CLIENT_VERSION,
			});

			try {
				if (!transport) {
					throw new NodeOperationError(this.getNode(), 'No transport available');
				}
				await client.connect(transport);
				this.logger.debug('Client connected to MCP server');
			} catch (connectionError) {
				this.logger.error(`MCP client connection error: ${(connectionError as Error).message}`);
				throw new NodeOperationError(
					this.getNode(),
					`Failed to connect to MCP server: ${(connectionError as Error).message}`,
				);
			}

			const rawTools = await client.listTools();
			const tools = Array.isArray(rawTools)
				? rawTools
				: Array.isArray(rawTools?.tools)
					? rawTools.tools
					: typeof rawTools?.tools === 'object' && rawTools.tools !== null
						? Object.values(rawTools.tools)
						: [];

			if (!tools.length) {
				throw new NodeOperationError(this.getNode(), `No tools found from ${CLIENT_NAME}`);
			}

			const aiTools = tools.map((tool: any) => {
				const paramSchema = tool.inputSchema?.properties
					? z.object(
							Object.entries(tool.inputSchema.properties).reduce(
								(acc: any, [key, prop]: [string, any]) => {
									let zodType: z.ZodType;

									switch (prop.type) {
										case 'string':
											zodType = z.string();
											break;
										case 'number':
											zodType = z.number();
											break;
										case 'integer':
											zodType = z.number().int();
											break;
										case 'boolean':
											zodType = z.boolean();
											break;
										case 'array':
											if (prop.items?.type === 'string') {
												zodType = z.array(z.string());
											} else if (prop.items?.type === 'number') {
												zodType = z.array(z.number());
											} else if (prop.items?.type === 'boolean') {
												zodType = z.array(z.boolean());
											} else {
												zodType = z.array(z.any());
											}
											break;
										case 'object':
											zodType = z.record(z.string(), z.any());
											break;
										default:
											zodType = z.any();
									}

									if (prop.description) {
										zodType = zodType.describe(prop.description);
									}

									if (!tool.inputSchema?.required?.includes(key)) {
										zodType = zodType.optional();
									}

									return {
										...acc,
										[key]: zodType,
									};
								},
								{},
							),
						)
					: z.object({});

				return new DynamicStructuredTool({
					name: tool.name,
					description: tool.description || `Execute the ${tool.name} tool`,
					schema: paramSchema,
					func: async (params) => {
						try {
							const result = await client.callTool(
								{
									name: tool.name,
									arguments: params,
								},
								CallToolResultSchema,
								REQUEST_OPTIONS,
							);

							return typeof result === 'object' ? JSON.stringify(result) : String(result);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Failed to execute ${tool.name}: ${(error as Error).message}`,
							);
						}
					},
				});
			});

			return {
				tools: aiTools.map((t: DynamicStructuredTool) => ({
					name: t.name,
					description: t.description,
					schema: zodToJsonSchema((t.schema as z.ZodTypeAny) || z.object({})),
				})),
			};
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Failed to get tool list: ${(error as Error).message}`,
			);
		} finally {
			if (transport) {
				await transport.close();
			}
		}
	},
} as ResourceOperation;
