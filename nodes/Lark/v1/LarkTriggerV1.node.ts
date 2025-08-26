import {
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
} from 'n8n-workflow';
import { larkTrigger } from '../TriggerFunctions';
import { Credentials } from '../../help/type/enums';
import { triggerEventProperty } from '../../help/utils/properties';

const descriptionV1: INodeTypeDescription = {
	displayName: 'Lark Trigger',
	name: 'larkTrigger',
	group: ['trigger'],
	version: 1,
	description: 'Starts the workflow on Lark events',
	defaults: {
		name: 'Lark Trigger',
	},
	inputs: [],
	outputs: [NodeConnectionType.Main],
	credentials: [
		{
			name: Credentials.TenantToken,
			required: true,
		},
	],
	properties: [
		{
			displayName:
				'Due to Lark API limitations, you can use just one Lark trigger for each lark bot at a time',
			name: 'LarkTriggerNotice',
			type: 'notice',
			default: '',
		},
		triggerEventProperty,
	],
};

export class LarkTriggerV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...descriptionV1,
		};
	}

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		return await larkTrigger(this);
	}
}
