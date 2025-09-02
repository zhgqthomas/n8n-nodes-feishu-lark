import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { Credentials } from '../help/type/enums';

export async function createStdioClientTransport(
	context: IExecuteFunctions,
): Promise<StdioClientTransport> {
	const credentials = await context.getCredentials(Credentials.UserToken);
	if (!credentials) {
		throw new NodeOperationError(context.getNode(), 'Missing required Lark OAuth2 credentials');
	}

	const { clientId, clientSecret, baseUrl, oauthTokenData, presetToolSets, customTools } =
		credentials as {
			clientId: string;
			clientSecret: string;
			baseUrl: string;
			oauthTokenData: any;
			presetToolSets: string[];
			customTools: string;
		};

	// Build command arguments
	const args = [
		'-y',
		'@larksuiteoapi/lark-mcp',
		'mcp',
		'-a',
		clientId,
		'-s',
		clientSecret,
		'-d',
		baseUrl,
	];

	if (customTools) {
		presetToolSets.push(...customTools.split(','));
	}

	if (presetToolSets.includes('custom')) {
		presetToolSets.splice(presetToolSets.indexOf('custom'), 1);
	}

	console.log(presetToolSets);
	args.push('-t', presetToolSets.join(','));

	const access_token = (oauthTokenData as any)?.access_token;
	if (access_token) {
		args.push('-u', access_token);
		args.push('--token-mode', 'user_access_token');
	}

	// Create and return MCP client using stdio transport
	const transport = new StdioClientTransport({
		command: 'npx',
		args: args as string[],
	});

	// Add error handling to transport
	if (transport) {
		transport.onerror = (error: Error) => {
			throw new NodeOperationError(context.getNode(), `Transport error: ${error.message}`);
		};
	}

	return transport;
}
