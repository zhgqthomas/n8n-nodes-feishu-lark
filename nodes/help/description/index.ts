import { FileType, MessageType } from '../type/enums';

export const DESCRIPTIONS = {
	ORDER_BY: {
		displayName: 'Order By(排序方式)',
		name: 'order_by',
		type: 'options',
		default: 'EditedTime',
		options: [
			{ name: 'Edited Time | 按编辑时间排序', value: 'EditedTime' },
			{ name: 'Created Time | 按创建时间排序', value: 'CreatedTime' },
		],
	},

	DIRECTION: {
		displayName: 'Direction(排序方向)',
		name: 'direction',
		type: 'options',
		default: 'DESC',
		options: [
			{ name: 'ASC | 升序', value: 'ASC' },
			{ name: 'DESC | 降序', value: 'DESC' },
		],
	},

	FILE_TOKEN: {
		displayName: 'File Token(文件唯一标识)',
		name: 'file_token',
		required: true,
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select File',
				typeOptions: {
					searchListMethod: 'searchFiles',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter File Token',
				default: '',
			},
		],
	},

	SPACE_FILE_TYPE: {
		displayName: 'File Type(文件类型)',
		name: 'space_file_type',
		type: 'options',
		required: true,
		options: [
			{
				name: 'Bitable(多维表格)',
				value: FileType.Bitable,
			},
			{
				name: 'Doc(文档)',
				value: FileType.Doc,
			},
			{
				name: 'Docx(新版文档类型)',
				value: FileType.Docx,
			},
			{
				name: 'Folder(文件夹)',
				value: FileType.Folder,
			},
			{
				name: 'Mindnote(思维笔记)',
				value: FileType.Mindnote,
			},
			{
				name: 'Shortcut(快捷方式)',
				value: FileType.Shortcut,
			},
			{
				name: 'Slides(幻灯片)',
				value: FileType.Slides,
			},
			{
				name: 'Spreadsheet(电子表格)',
				value: FileType.Sheet,
			},
		],
		default: FileType.Bitable,
	},

	NAME: {
		displayName: 'Name(名称)',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
	},

	CONVERT_BLOCK_CONTENT_TYPE: {
		displayName: 'Content Type(内容类型)',
		name: 'content_type',
		type: 'options',
		default: 'markdown',
		required: true,
		options: [
			{ name: 'Markdown', value: 'markdown' },
			{ name: 'HTML', value: 'html' },
		],
	},

	CONVERT_BLOCK_CONTENT: {
		displayName: 'Markdown/HTML Content(Markdown/HTML 内容)',
		name: 'content',
		type: 'string',
		default: '',
		required: true,
	},

	SPREADSHEET_ID: {
		displayName: 'Spreadsheet ID(电子表格 ID)',
		name: 'spreadsheet_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Spreadsheet',
				typeOptions: {
					searchListMethod: 'searchSpreadsheets',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Spreadsheet ID',
				default: '',
			},
		],
	},

	DOCUMENT_BLOCK_ID: {
		displayName: 'Parent Block ID(父块 ID)',
		name: 'block_id',
		type: 'string',
		default: '',
		required: true,
		description: 'The block_id of the parent block',
	},

	DOCUMENT_REVISION_ID: {
		displayName: 'Document Version ID(文档版本)',
		name: 'document_revision_id',
		type: 'number',
		typeOptions: {
			minValue: -1,
			numberPrecision: 0,
		},
		default: -1,
		description:
			'-1 indicates the latest version of the document. Once the document is created, the document_revision_id is 1.',
	},

	DOCUMENT_ID: {
		displayName: 'Document ID(文档 ID)',
		name: 'document_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		description: 'Need to have the read permission of base role',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Document',
				typeOptions: {
					searchListMethod: 'searchDocuments',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Document ID',
				default: '',
			},
		],
	},

	TITLE: {
		displayName: 'Title(标题)',
		name: 'title',
		type: 'string',
		default: '',
		description: 'Only supports plain text. Length range: 1 characters ～ 800 characters.',
	},

	FILE_DURATION: {
		displayName: 'File Duration(文件时长)',
		name: 'file_duration',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
			numberPrecision: 0,
		},
		displayOptions: {
			show: {
				file_type: ['mp4', 'opus'],
			},
		},
	},

	FILE_NAME: {
		displayName: 'File Name(文件名称)',
		name: 'file_name',
		type: 'string',
		default: '',
		hint: 'File name with a suffix, like test.mp4',
	},

	MESSAGE_UPLOAD_FILE_TYPE: {
		displayName: 'File Type(文件类型)',
		name: 'file_type',
		type: 'options',
		options: [
			{
				name: 'DOC(文档)',
				value: 'doc',
			},
			{
				name: 'MP4(视频)',
				value: 'mp4',
				description: 'Only supports mp4 format for video',
			},
			{
				name: 'OPUS(音频)',
				value: 'opus',
				description: 'Only supports opus format for audio',
			},
			{
				name: 'PDF',
				value: 'pdf',
			},
			{
				name: 'PPT(幻灯片)',
				value: 'ppt',
			},
			{
				name: 'Stream(流)',
				value: 'stream',
				description: 'For other format that not listed',
			},
			{
				name: 'XLS(表格)',
				value: 'xls',
			},
		],
		default: 'opus',
	},

	BINARY_PROPERTY_NAME: {
		displayName: 'Binary Field(二进制字段名称)',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: '',
		description: 'The name of the input binary field containing the file/image to be uploaded',
	},

	DOWNLOAD_RESOURCE: {
		displayName: 'Whether Download Resource(是否下载资源)',
		name: 'downloadResource',
		type: 'boolean',
		default: false,
		required: true,
		description: 'Whether to download resources such as images, files, etc',
		displayOptions: {
			show: {
				messageTypes: [
					MessageType.Image,
					MessageType.File,
					MessageType.Audio,
					MessageType.Video,
					MessageType.RichText,
				],
			},
		},
	},

	RECEIVE_MESSAGE_TYPES: {
		displayName: 'Message Type(消息类型)',
		name: 'messageTypes',
		type: 'multiOptions',
		options: [
			{
				name: 'Image(图片)',
				value: MessageType.Image,
				description: MessageType.Image,
			},
			{
				name: 'File(文件)',
				value: MessageType.File,
				description: MessageType.File,
			},
			{
				name: 'Rich Text(富文本)',
				value: MessageType.RichText,
				description: MessageType.RichText,
			},
			{
				name: 'Audio(音频)',
				value: MessageType.Audio,
				description: MessageType.Audio,
			},
			{
				name: 'Video(视频)',
				value: MessageType.Video,
				description: MessageType.Video,
			},
			{
				name: 'Card(卡片)',
				value: MessageType.Card,
				description: MessageType.Card,
			},
			{
				name: '位置(Location)',
				value: MessageType.Location,
				description: MessageType.Location,
			},
			{
				name: 'Todo(任务)',
				value: MessageType.Todo,
				description: MessageType.Todo,
			},
			{
				name: 'Calendar Event(日程)',
				value: MessageType.CalendarEvent,
				description: MessageType.CalendarEvent,
			},
			{
				name: 'Text(文本)',
				value: MessageType.Text,
				description: MessageType.Text,
			},
		],
		required: true,
		default: [MessageType.Text],
	},

	RESOURCE_KEY: {
		displayName: 'Resource Key(资源唯一标识)',
		name: 'file_key',
		type: 'string',
		required: true,
		default: '',
		description: 'The key of the resource to be queried',
	},

	RESOURCE_TYPE: {
		displayName: 'Resource Type(资源类型)',
		name: 'type',
		type: 'options',
		options: [
			{
				name: 'Image(图片)',
				value: 'image',
				description: 'The image in the content',
			},
			{
				name: 'File(文件)',
				value: 'file',
				description: 'The file, audio, video (except emoticons) in the content',
			},
		],
		default: 'image',
	},

	MESSAGE_REPLY_IN_THREAD: {
		displayName: 'Whether Reply in Thread(是否以话题形式回复)',
		name: 'reply_in_thread',
		type: 'boolean',
		default: false,
		description:
			'Whether to reply in thread form. If the value is true, the reply will be in thread form.',
	},

	MESSAGE_ID: {
		displayName: 'Message ID(消息ID)',
		name: 'message_id',
		type: 'string',
		required: true,
		default: '',
	},

	MESSAGE_CONTENT: {
		displayName: 'Message Content(消息内容)',
		name: 'content',
		type: 'json',
		default: '{}',
		required: true,
	},

	MESSAGE_TYPE: {
		displayName: 'Message Type(消息类型)',
		name: 'msg_type',
		type: 'options',
		options: [
			{ name: 'Audio(语音)', value: 'audio' },
			{ name: 'File(文件)', value: 'file' },
			{ name: 'Image(图片)', value: 'image' },
			{ name: 'Interactive Card(卡片)', value: 'interactive' },
			{ name: 'Rich Text(富文本)', value: 'post' },
			{ name: 'Share Chat(分享群名片)', value: 'share_chat' },
			{ name: 'Share User(分享个人名片)', value: 'share_user' },
			{ name: 'Sticker(表情包)', value: 'sticker' },
			{ name: 'System Message(系统消息)', value: 'system' },
			{ name: 'Text(文本)', value: 'text' },
			{ name: 'Video(视频)', value: 'media' },
		],
		required: true,
		default: 'text',
	},

	RECEIVE_ID_TYPE: {
		displayName: 'Receiver ID Type(接收者ID类型)',
		name: 'receive_id_type',
		type: 'options',
		options: [
			{
				name: 'Chat ID',
				value: 'chat_id',
				description: 'Identifies group chats by chat_id',
			},
			{
				name: 'Email',
				value: 'email',
				description: 'Identifies users by "email"',
			},
			{
				name: 'Open ID',
				value: 'open_id',
				description: 'Identifies a user to an app',
			},
			{
				name: 'Union ID',
				value: 'union_id',
				description: 'Identifies a user to a tenant that acts as a developer',
			},
			{
				name: 'User ID',
				value: 'user_id',
				description: 'Identifies a user to a tenant',
			},
		],
		required: true,
		default: 'open_id',
	},

	CALENDAR_COLOR: {
		displayName: 'Color(日历颜色)',
		name: 'color',
		type: 'color',
		default: '',
	},

	CALENDAR_SUMMARY_ALIAS: {
		displayName: 'Summary Alias(日历备注名)',
		name: 'summary_alias',
		type: 'string',
		default: '',
		description:
			'Setting this field (including subsequent modification of this field) only takes effect for the current identity',
	},

	CALENDAR_PERMISSIONS: {
		displayName: 'Permissions(日历公开范围)',
		name: 'permissions',
		type: 'options',
		options: [
			{ name: 'Private | 私密', value: 'private' },
			{ name: 'Show Only Free Busy | 仅展示忙闲信息', value: 'show_only_free_busy' },
			{ name: 'Public | 公开，他人可查看日程详情', value: 'public' },
		],
		default: 'show_only_free_busy',
		description: 'Calendar visibility range',
	},

	CALENDAR_DESCRIPTION: {
		displayName: 'Description(日历描述)',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Maximum length: 255 characters',
	},

	CALENDAR_TITLE: {
		displayName: 'Summary(日历标题)',
		name: 'summary',
		type: 'string',
		default: '',
		description: 'Maximum length: 255 characters',
	},

	MEMBER_ID: {
		displayName: 'Member ID(自定义角色协作者 ID)',
		name: 'member_id',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Need to have the read permission of base role',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Input phone number or email',
				typeOptions: {
					searchListMethod: 'searchUserIds',
					searchFilterRequired: true,
					searchable: true,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter ID',
				default: '',
			},
		],
	},

	MEMBER_ID_TYPE: {
		displayName: 'Member ID Type(协作者 ID 类型)',
		name: 'member_id_type',
		type: 'options',
		options: [
			{ name: 'Chat ID', value: 'chat_id' },
			{ name: 'Department ID', value: 'department_id' },
			{ name: 'Open Department ID', value: 'open_department_id' },
			{ name: 'Open ID', value: 'open_id' },
			{ name: 'Union ID', value: 'union_id' },
			{ name: 'User ID', value: 'user_id' },
		],
		default: 'open_id',
	},

	BASE_ROLE_ID: {
		displayName: 'Role ID(自定义角色唯一标识)',
		name: 'role_id',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Need to have the read permission of base role',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Role',
				typeOptions: {
					searchListMethod: 'searchBaseRoles',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Role ID',
				default: '',
			},
		],
	},

	TEXT_FIELD_AS_ARRAY: {
		displayName: 'Text Field as Array(字段描述数组形式返回)',
		name: 'text_field_as_array',
		type: 'boolean',
		default: false,
		description:
			'Whether to control the return format of field description (multi-line text format) data, true means return in array rich text form',
	},

	TABLE_FIELD_ID: {
		displayName: 'Field ID(字段唯一标识)',
		name: 'field_id',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Need to have the permission to view the Base above',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Field',
				typeOptions: {
					searchListMethod: 'searchTableFields',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Field ID',
				default: '',
			},
		],
	},

	AUTOMATIC_FIELDS: {
		displayName: 'Whether to Return Automatic Fields(是否返回自动计算的字段)',
		name: 'automatic_fields',
		type: 'boolean',
		default: false,
	},

	WITH_SHARED_URL: {
		displayName: 'Whether to Return Shared Link(是否返回记录的分享链接)',
		name: 'with_shared_url',
		type: 'boolean',
		default: false,
	},

	TABLE_RECORD_ID: {
		displayName: 'Record ID(记录唯一标识)',
		name: 'record_id',
		type: 'string',
		required: true,
		default: '',
	},

	TABLE_VIEW_PROPERTY: {
		displayName: 'View Property(视图属性)',
		name: 'property',
		type: 'json',
		default: '{}',
	},

	TABLE_VIEW_ID: {
		displayName: 'View(视图)',
		name: 'view_id',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Need to have the permission to view the Base above',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select View',
				typeOptions: {
					searchListMethod: 'searchTableViews',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter View ID',
				default: '',
			},
		],
	},

	TABLE_VIEW_TYPE: {
		displayName: 'View Type(视图类型)',
		name: 'view_type',
		required: true,
		type: 'options',
		options: [
			{
				name: 'Form View(表单视图)',
				value: 'form',
			},
			{
				name: 'Gallery View(画册视图)',
				value: 'gallery',
			},
			{
				name: 'Gantt View(甘特视图)',
				value: 'gantt',
			},
			{
				name: 'Grid View(表格视图)',
				value: 'grid',
			},
			{
				name: 'Kanban View(看板视图)',
				value: 'kanban',
			},
		],
		default: 'grid',
	},

	TABLE_VIEW_NAME: {
		displayName: 'View Name(视图名称)',
		name: 'view_name',
		type: 'string',
		required: true,
		default: '',
		description:
			'Name cannot contain special characters, must be no more than 100 characters long, cannot be empty, and must not contain these special symbols: [ ]',
	},

	PAGE_SIZE: {
		displayName: 'Page Size(分页大小)',
		name: 'page_size',
		type: 'number',
		default: 20,
		displayOptions: {
			show: {
				whether_paging: [true],
			},
		},
	},

	PAGE_TOKEN: {
		displayName: 'Page Token(分页标记)',
		name: 'page_token',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		description:
			'It is not filled in the first request, indicating traversal from the beginning; when there will be more groups, the new page_token will be returned at the same time, and the next traversal can use the page_token to get more groups',
		displayOptions: {
			show: {
				whether_paging: [true],
			},
		},
	},

	WHETHER_PAGING: {
		displayName: 'Whether Paging(是否分页)',
		name: 'whether_paging',
		type: 'boolean',
		default: false,
	},

	NEW_NAME: {
		displayName: 'New Name(新名称)',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
	},

	IS_ADVANCED: {
		displayName: 'Turn on/off Advanced(是否开启高级权限)',
		name: 'is_advanced',
		type: 'boolean',
		default: false,
	},

	WHETHER_COPY_CONTENT: {
		displayName: 'Copy the Content(是否复制内容)',
		name: 'without_content',
		type: 'boolean',
		default: false,
		description:
			'Whether to copy the content from the original table, True is copy, False is not copy',
	},

	TIME_ZONE: {
		displayName: 'Time Zone(时区)',
		name: 'time_zone',
		type: 'string',
		default: 'Asia/Shanghai',
		description:
			'<a target="_blank" href="https://bytedance.larkoffice.com/docx/YKRndTM7VoyDqpxqqeEcd67MnEf">Open document</a>',
	},

	FOLDER_TOKEN: {
		displayName: 'Folder Token(文件夹唯一标识)',
		name: 'folder_token',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Need to have the read permission of base role',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Folder',
				typeOptions: {
					searchListMethod: 'searchFolders',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Folder Token',
				default: '',
			},
		],
	},

	BASE_APP_NAME: {
		displayName: 'App Name(多维表格名称)',
		name: 'name',
		type: 'string',
		default: '',
	},

	REQUEST_BODY: {
		displayName: 'Request Body(请求体)',
		name: 'body',
		type: 'json',
		required: true,
		default: '{}',
	},

	REQUEST_ID: {
		displayName: 'Request ID(请求 ID)',
		name: 'request_id',
		type: 'string',
		default: '',
		description: 'Unique identifier for the request, used to ensure idempotency',
	},

	USER_ID_TYPE: {
		displayName: 'User ID Type(用户 ID 类型)',
		name: 'user_id_type',
		type: 'options',
		options: [
			{ name: 'Open ID', value: 'open_id' },
			{ name: 'Union ID', value: 'union_id' },
			{ name: 'User ID', value: 'user_id' },
		],
		default: 'open_id',
	},

	BASE_APP_TOKEN: {
		displayName: 'Base App(多维表格)',
		name: 'app_token',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Need to have the permission to view all files in my space',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Base App',
				typeOptions: {
					searchListMethod: 'searchBitables',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter App Token',
				default: '',
			},
		],
	},

	BASE_TABLE_ID: {
		displayName: 'Table(数据表)',
		name: 'table_id',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'Need to have the permission to view the Base above',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Table',
				typeOptions: {
					searchListMethod: 'searchTables',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Table ID',
				default: '',
			},
		],
	},

	IGNORE_CONSISTENCY_CHECK: {
		displayName: 'Ignore Consistency Check(忽略一致性读写检查)',
		name: 'ignore_consistency_check',
		type: 'boolean',
		default: true,
		description: 'Whether to ignore consistency checks',
	},
};
