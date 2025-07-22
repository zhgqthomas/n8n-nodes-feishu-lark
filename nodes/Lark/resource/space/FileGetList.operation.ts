import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { FileType, OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';
import { getFileList } from '../../GenericFunctions';

export default {
	name: WORDING.GetFileList,
	value: OperationType.GetFileList,
	order: 200,
	options: [
		DESCRIPTIONS.SPACE_FILE_TYPE,
		{
			displayName: WORDING.Options,
			name: 'options',
			type: 'collection',
			placeholder: WORDING.AddField,
			default: {},
			options: [DESCRIPTIONS.ORDER_BY, DESCRIPTIONS.DIRECTION, DESCRIPTIONS.USER_ID_TYPE],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/drive-v1/folder/list">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const type = this.getNodeParameter('space_file_type', index, FileType.Bitable) as FileType;
		const options = this.getNodeParameter('options', index, {});
		const order_by = (options.order_by as string) || 'EditedTime';
		const direction = (options.direction as string) || 'DESC';
		const user_id_type = (options.user_id_type as string) || 'open_id';

		return (await getFileList.call(this, type, order_by, direction, user_id_type)) as IDataObject[];
	},
} as ResourceOperation;
