import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { CLIENT_NAME, CLIENT_VERSION, REQUEST_OPTIONS } from '../../../mcp/constants';
import { createStdioClientTransport } from '../../../mcp/utils';

export default {
	name: WORDING.ExecuteTool,
	value: OperationType.ExecuteTool,
	order: 90,
	options: [
		{
			displayName: 'Tool Name',
			name: 'toolName',
			type: 'string',
			required: true,
			default: '',
			description: 'Name of the tool to execute',
		},
		{
			displayName: 'Tool Parameters',
			name: 'toolParameters',
			type: 'json',
			required: true,
			default: '',
			description: 'Parameters to pass to the tool in JSON format',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const transport = await createStdioClientTransport(this);
		const toolName = this.getNodeParameter('toolName', index) as string;

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

			const rawParams = this.getNodeParameter('toolParameters', index, undefined, {
				ensureType: 'json',
			}) as IDataObject;
			let toolParams;

			this.logger.debug(`Raw tool parameters: ${JSON.stringify(rawParams)}`);

			// Handle different parameter types
			if (rawParams === undefined || rawParams === null) {
				// Handle null/undefined case
				toolParams = {};
			} else if (typeof rawParams === 'string') {
				// Handle string input (typical direct node usage)
				if (!rawParams || (rawParams as string).trim() === '') {
					toolParams = {};
				} else {
					toolParams = JSON.parse(rawParams);
				}
			} else if (typeof rawParams === 'object') {
				// Handle object input (when used as a tool in AI Agent)
				toolParams = rawParams;
			} else {
				// Try to convert other types to object
				try {
					toolParams = JSON.parse(JSON.stringify(rawParams));
				} catch (parseError) {
					throw new NodeOperationError(
						this.getNode(),
						`Invalid parameter type: ${typeof rawParams}`,
					);
				}
			}

			// Ensure toolParams is an object
			if (typeof toolParams !== 'object' || toolParams === null || Array.isArray(toolParams)) {
				throw new NodeOperationError(this.getNode(), 'Tool parameters must be a JSON object');
			}

			// Validate tool exists before executing

			const availableTools = await client.listTools();
			const toolsList = Array.isArray(availableTools)
				? availableTools
				: Array.isArray(availableTools?.tools)
					? availableTools.tools
					: Object.values(availableTools?.tools || {});

			const toolExists = toolsList.some((tool: any) => tool.name === toolName);

			if (!toolExists) {
				const availableToolNames = toolsList.map((t: any) => t.name).join(', ');
				throw new NodeOperationError(
					this.getNode(),
					`Tool '${toolName}' does not exist. Available tools: ${availableToolNames}`,
				);
			}

			this.logger.debug(`Executing tool: ${toolName} with params: ${JSON.stringify(toolParams)}`);

			const result = await client.callTool(
				{
					name: toolName,
					arguments: toolParams,
				},
				CallToolResultSchema,
				REQUEST_OPTIONS,
			);

			this.logger.debug(`Tool executed successfully: ${JSON.stringify(result)}`);

			return result as IDataObject;
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Failed to execute tool '${toolName}': ${(error as Error).message}`,
			);
		} finally {
			if (transport) {
				await transport.close();
			}
		}
	},
} as ResourceOperation;
