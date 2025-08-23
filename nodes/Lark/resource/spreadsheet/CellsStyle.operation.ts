import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperation } from '../../../help/type/IResource';
import { WORDING } from '../../../help/wording';
import { OperationType } from '../../../help/type/enums';
import { DESCRIPTIONS } from '../../../help/description';

export default {
	name: WORDING.SetCellStyle,
	value: OperationType.SetCellStyle,
	order: 142,
	options: [
		DESCRIPTIONS.SPREADSHEET_ID,
		DESCRIPTIONS.SHEET_ID,
		DESCRIPTIONS.CELL_RANGE,
		{
			displayName: 'Style(样式)',
			name: 'style',
			type: 'collection',
			default: {},
			options: [
				{
					displayName: 'Background Color(背景颜色)',
					name: 'backColor',
					type: 'color',
					default: '',
					description: 'Background color, in hexadecimal color code',
				},
				{
					displayName: 'Border Color(边框颜色)',
					name: 'borderColor',
					type: 'color',
					default: '',
					description: 'Border color, in hexadecimal color code',
				},
				{
					displayName: 'Border Type(边框类型)',
					name: 'borderType',
					type: 'options',
					default: 'NO_BORDER',
					options: [
						{
							name: 'Bottom Border(下边框)',
							value: 'BOTTOM_BORDER',
						},
						{
							name: 'Full Border(全边框)',
							value: 'FULL_BORDER',
						},
						{
							name: 'Inner Border(内边框)',
							value: 'INNER_BORDER',
						},
						{
							name: 'Left Border(左边框)',
							value: 'LEFT_BORDER',
						},
						{
							name: 'No Border(无边框)',
							value: 'NO_BORDER',
						},
						{
							name: 'Outer Border(外边框)',
							value: 'OUTER_BORDER',
						},
						{
							name: 'Right Border(右边框)',
							value: 'RIGHT_BORDER',
						},
						{
							name: 'Top Border(上边框)',
							value: 'TOP_BORDER',
						},
					],
				},
				{
					displayName: 'Font Color(字体颜色)',
					name: 'foreColor',
					type: 'color',
					default: '',
					description: 'Font color, in hexadecimal color code',
				},
				{
					displayName: 'Font Style(字体样式)',
					name: 'font',
					type: 'collection',
					default: {},
					options: [
						{
							displayName: 'Font Size(字体大小)',
							name: 'fontSize',
							type: 'string',
							default: '',
							hint: '10pt/1.5',
							description: 'Font size: 9 to 36, line spacing fixed at 1.5, for example: 10pt/1.5',
						},
						{
							displayName: 'Bold(加粗)',
							name: 'bold',
							type: 'boolean',
							default: false,
						},
						{
							displayName: 'Italic(斜体)',
							name: 'italic',
							type: 'boolean',
							default: false,
						},
						{
							displayName: 'Clean(清除字体格式)',
							name: 'clean',
							type: 'boolean',
							default: false,
						},
					],
				},
				{
					displayName: 'Horizontal Alignment(水平对齐方式)',
					name: 'hAlign',
					type: 'options',
					default: 0,
					options: [
						{
							name: 'Left(左对齐)',
							value: 0,
						},
						{
							name: 'Middle(中对齐)',
							value: 1,
						},
						{
							name: 'Right(右对齐)',
							value: 2,
						},
					],
					description: 'Horizontal alignment. Optional values: 0: left, 1: middle, 2: right.',
				},
				{
					displayName: 'Number Format(数字格式)',
					name: 'formatter',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Text Decoration(文本其他样式)',
					name: 'textDecoration',
					type: 'options',
					default: 0,
					options: [
						{
							name: 'Default(默认)',
							value: 0,
						},
						{
							name: 'Underline(下划线)',
							value: 1,
						},
						{
							name: 'Strikethrough(删除线)',
							value: 2,
						},
						{
							name: 'Underline and Strikethrough(下划线和删除线)',
							value: 3,
						},
					],
				},
				{
					displayName: 'Vertical Alignment(垂直对齐方式)',
					name: 'vAlign',
					type: 'options',
					default: 0,
					options: [
						{
							name: 'Top(上对齐)',
							value: 0,
						},
						{
							name: 'Middle(中对齐)',
							value: 1,
						},
						{
							name: 'Bottom(下对齐)',
							value: 2,
						},
					],
					description: 'Vertical alignment. Optional values: 0: top, 1: middle, 2: bottom.',
				},
			],
		},
		{
			displayName: `<a target="_blank" href="https://open.feishu.cn/document/server-docs/docs/sheets-v3/data-operation/set-cell-style">${WORDING.OpenDocument}</a>`,
			name: 'notice',
			type: 'notice',
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const spreadsheet_id = this.getNodeParameter('spreadsheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const sheet_id = this.getNodeParameter('sheet_id', index, undefined, {
			extractValue: true,
		}) as string;
		const cell_range = this.getNodeParameter('range', index, '') as string;
		const style = this.getNodeParameter('style', index) as IDataObject;

		const body: IDataObject = {
			appendStyle: {
				range: `${sheet_id}${cell_range}`,
				style,
			},
		};

		const { data } = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/open-apis/sheets/v2/spreadsheets/${spreadsheet_id}/style`,
			body,
		});

		return data;
	},
} as ResourceOperation;
