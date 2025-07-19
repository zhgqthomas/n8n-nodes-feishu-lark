import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { DESCRIPTIONS } from '../../../help/description';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';

export default {
	name: WORDING.CopyBaseApp,
	value: OperationType.CopyBaseApp,
	order: 199,
	options: [
		DESCRIPTIONS.BASE_APP_TOKEN,
		DESCRIPTIONS.FOLDER_TOKEN,
		DESCRIPTIONS.BASE_APP_NAME,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.WHETHER_COPY_CONTENT, DESCRIPTIONS.TIME_ZONE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/copy">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const app_token = this.getNodeParameter('app_token', index, undefined, {
			extractValue: true,
		}) as string;
		const folder_token = this.getNodeParameter('folder_token', index) as string;
		const name = this.getNodeParameter('name', index) as string;
		const options = this.getNodeParameter('options', index, {});
		const without_content = options.without_content as boolean;
		const time_zone = options.time_zone as string;

		const {
			data: { app },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/bitable/v1/apps/${app_token}/copy`,
			body: {
				time_zone,
				without_content: !without_content,
				...(folder_token && { folder_token }),
				...(name && { name }),
			},
		});

		return app;
	},
} as ResourceOperation;
