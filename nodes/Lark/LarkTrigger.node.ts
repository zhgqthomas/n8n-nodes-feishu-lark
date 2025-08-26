import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { LarkTriggerV1 } from './v1/LarkTriggerV1.node';
import { LarkTriggerV2 } from './v2/LarkTriggerV2.node';

export class LarkTrigger extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Lark Trigger',
			name: 'larkTrigger',
			icon: 'file:lark_icon.svg',
			group: ['trigger'],
			subtitle: '=Events: {{$parameter["events"].join(", ")}}',
			description: 'Starts the workflow on Lark events',
			defaultVersion: 2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new LarkTriggerV1(baseDescription),
			2: new LarkTriggerV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
