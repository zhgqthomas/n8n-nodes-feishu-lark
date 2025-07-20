import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.CreateBaseApp,
	value: OperationType.CreateBaseApp,
	order: 200,
	options: [
		DESCRIPTIONS.BASE_APP_NAME,
		DESCRIPTIONS.FOLDER_TOKEN,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.TIME_ZONE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/create">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const name = this.getNodeParameter('name', index) as string;
		const folder_token = this.getNodeParameter('folder_token', index, undefined, {
			extractValue: true,
		}) as string;
		const options = this.getNodeParameter('options', index, {});
		const time_zone = options.time_zone as string | undefined;

		const {
			data: { app },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/open-apis/bitable/v1/apps',
			body: {
				...(name && { name }),
				...(folder_token && { folder_token }),
				...(time_zone && { time_zone }),
			},
		});

		return app;
	},
} as ResourceOperation;
