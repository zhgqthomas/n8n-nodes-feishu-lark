import { DESCRIPTION_NAMES } from '../i18n/descriptions';
import { FileType, MessageType } from '../type/enums';
import { OBJECT_JSON } from './base';

const t = DESCRIPTION_NAMES;

export const DESCRIPTIONS = {
	TENANT_TOKEN_TIP: {
		displayName: t.TENANT_TOKEN_TIP,
		name: 'notice',
		type: 'notice',
		default: '',
	},

	INTERACTIVE_TOKEN: {
		displayName: t.INTERACTIVE_TOKEN,
		name: 'interactive_token',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		description: 'The token parameter value contained in the card callback interaction callback',
	},

	FILE_BINARY_FIELD: {
		displayName: t.FILE_BINARY_FIELD,
		name: 'file_binary_field',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the field that will contain the file binary data',
	},

	MEDIA_FILE_TOKENS: {
		displayName: t.MEDIA_FILE_TOKENS,
		description: 'The tokens of multiple media files',
		name: 'media_file_tokens',
		type: 'json',
		default: '[]',
		required: true,
		placeholder: '["boxcnrHpsg1QDqXAAAyachabcef"]',
	},

	MEDIA_FILE_TOKEN: {
		displayName: t.MEDIA_FILE_TOKEN,
		description: 'The token of a media file',
		name: 'media_file_token',
		type: 'string',
		required: true,
		default: '',
		typeOptions: {
			password: true,
		},
	},

	PARENT_TYPE: {
		displayName: t.PARENT_TYPE,
		name: 'parent_type',
		type: 'options',
		options: [
			{ name: t.PARENT_TYPE_BITABLE_FILE, value: 'bitable_file' },
			{ name: t.PARENT_TYPE_BITABLE_IMAGE, value: 'bitable_image' },
			{ name: t.PARENT_TYPE_CCM_IMPORT_OPEN, value: 'ccm_import_open' },
			{ name: t.PARENT_TYPE_SHEET_FILE, value: 'sheet_file' },
			{ name: t.PARENT_TYPE_SHEET_IMAGE, value: 'sheet_image' },
			{ name: t.PARENT_TYPE_DOCX_FILE, value: 'docx_file' },
			{ name: t.PARENT_TYPE_DOCX_IMAGE, value: 'docx_image' },
			{ name: t.PARENT_TYPE_VC_VIRTUAL_BG, value: 'vc_virtual_background' },
		],
		required: true,
		default: 'bitable_file',
		description: 'The type of media to upload to the specified type of Docs',
	},

	PARENT_NODE: {
		displayName: t.PARENT_NODE,
		name: 'parent_node',
		type: 'string',
		required: true,
		default: '',
		description:
			'The document or location to which the media will be uploaded. block_id for upgraded docs, spreadsheet_token for sheet, app_token for bitable, empty for importing into docs.',
	},

	JSON_OUTPUT: {
		displayName: t.JSON_OUTPUT,
		name: 'jsonOutput',
		type: 'json',
		typeOptions: {
			rows: 5,
		},
		default: '{\n  "my_field_1": "value",\n  "my_field_2": 1\n}\n',
	},

	SHEET_VALUES: {
		displayName: t.SHEET_VALUES,
		name: 'values',
		type: 'json',
		required: true,
		default: '[]',
	},

	MATCH_CASE: {
		displayName: t.MATCH_CASE,
		name: 'matchCase',
		type: 'boolean',
		default: false,
	},

	MATCH_ENTIRE_CELL: {
		displayName: t.MATCH_ENTIRE_CELL,
		name: 'matchEntireCell',
		type: 'boolean',
		default: false,
	},

	SEARCH_BY_REGEX: {
		displayName: t.SEARCH_BY_REGEX,
		name: 'searchByRegex',
		type: 'boolean',
		default: false,
	},

	INCLUDE_FORMULAS: {
		displayName: t.INCLUDE_FORMULAS,
		name: 'includeFormulas',
		type: 'boolean',
		default: false,
	},

	CELL_RANGE: {
		displayName: t.CELL_RANGE,
		name: 'range',
		type: 'string',
		default: '',
		required: true,
		placeholder: '!A1:B2',
		hint: 'https://open.feishu.cn/document/server-docs/docs/sheets-v3/overview#9049d332',
		description:
			'The range of cells to merge, in the format of &lt;start position&gt;:&lt;end position&gt;. Example: !A1:B2.',
	},

	START_INDEX: {
		displayName: t.START_INDEX,
		name: 'startIndex',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: {
			minValue: 0,
			numberPrecision: 0,
		},
	},

	END_INDEX: {
		displayName: t.END_INDEX,
		name: 'endIndex',
		type: 'number',
		required: true,
		default: 1,
		typeOptions: {
			minValue: 0,
			numberPrecision: 0,
		},
	},

	MAJOR_DIMENSION: {
		displayName: t.MAJOR_DIMENSION,
		name: 'majorDimension',
		type: 'options',
		options: [
			{ name: 'ROWS', value: 'ROWS' },
			{ name: 'COLUMNS', value: 'COLUMNS' },
		],
		required: true,
		default: 'ROWS',
	},

	SHEET_INDEX: {
		displayName: t.SHEET_INDEX,
		name: 'sheet_index',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
			numberPrecision: 0,
		},
	},

	SHEET_ID: {
		displayName: t.SHEET_ID,
		name: 'sheet_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Sheet',
				typeOptions: {
					searchListMethod: 'searchSheets',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Sheet ID',
				default: '',
			},
		],
	},

	CHAT_ID: {
		displayName: t.CHAT_ID,
		name: 'chat_id',
		type: 'string',
		required: true,
		default: '',
	},

	SYNC_TOKEN: {
		displayName: t.SYNC_TOKEN,
		name: 'sync_token',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		description: 'Incremental synchronization mark, not filled in for the first request',
	},

	ANCHOR_TIME: {
		displayName: t.ANCHOR_TIME,
		name: 'anchor_time',
		type: 'string',
		default: '',
		description:
			'Used to set a specific point in time for pulling events, thereby avoiding the need to pull all events',
	},

	MAX_ATTENDEE_NUM: {
		displayName: t.MAX_ATTENDEE_NUM,
		name: 'max_attendee_num',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
			numberPrecision: 0,
		},
		default: 100,
	},

	NEED_ATTENDEE: {
		displayName: t.NEED_ATTENDEE,
		name: 'need_attendee',
		type: 'boolean',
		default: false,
	},

	NEED_MEETING_SETTINGS: {
		displayName: t.NEED_MEETING_SETTINGS,
		name: 'need_meeting_settings',
		type: 'boolean',
		default: false,
		description: 'Whether the meeting type (vc_type) of the event needs to be vc',
	},

	NEED_NOTIFICATION: {
		displayName: t.NEED_NOTIFICATION,
		name: 'need_notification',
		type: 'boolean',
		default: true,
		description: 'Whether to send Bot notifications to event participants when deleting a event',
	},

	CALENDAR_EVENT_ID: {
		displayName: t.CALENDAR_EVENT_ID,
		name: 'calendar_event_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Input event key word',
				typeOptions: {
					searchListMethod: 'searchCalendarEvents',
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

	ONLY_BUSY: {
		displayName: t.ONLY_BUSY,
		name: 'only_busy',
		type: 'boolean',
		default: true,
	},

	INCLUDE_EXTERNAL_CALENDAR: {
		displayName: t.INCLUDE_EXTERNAL_CALENDAR,
		name: 'include_external_calendar',
		type: 'boolean',
		default: true,
	},

	START_TIME: {
		displayName: t.START_TIME,
		name: 'start_time',
		type: 'dateTime',
		default: '',
		required: true,
	},

	END_TIME: {
		displayName: t.END_TIME,
		name: 'end_time',
		type: 'dateTime',
		default: '',
		required: true,
	},

	CALENDAR_ID: {
		displayName: t.CALENDAR_ID,
		name: 'calendar_id',
		required: true,
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select Calendar',
				typeOptions: {
					searchListMethod: 'searchCalendars',
					searchFilterRequired: false,
					searchable: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Calendar ID',
				default: '',
			},
		],
	},

	ARRAY_JSON: {
		displayName: t.ARRAY_JSON,
		name: 'array_json',
		type: 'json',
		default: [],
	},

	OFFSET: {
		displayName: t.OFFSET,
		name: 'offset',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
			numberPrecision: 0,
		},
	},

	COUNT: {
		displayName: t.COUNT,
		name: 'count',
		type: 'number',
		default: 20,
		typeOptions: {
			minValue: 0,
			maxValue: 50,
			numberPrecision: 0,
		},
	},

	SEARCH_KEY: {
		displayName: t.SEARCH_KEY,
		name: 'search_key',
		type: 'string',
		default: '',
		required: true,
	},

	SEARCH_FILE_TYPE: {
		displayName: t.SEARCH_FILE_TYPE,
		name: 'search_file_type',
		type: 'multiOptions',
		default: [],
		options: [
			{ name: t.SEARCH_FILE_TYPE_BITABLE, value: FileType.Bitable },
			{ name: t.SEARCH_FILE_TYPE_DOC, value: FileType.Doc },
			{ name: t.SEARCH_FILE_TYPE_FILE, value: FileType.File },
			{ name: t.SEARCH_FILE_TYPE_MINDNOTE, value: FileType.Mindnote },
			{ name: t.SEARCH_FILE_TYPE_SLIDES, value: FileType.Slides },
			{ name: t.SEARCH_FILE_TYPE_SPREADSHEET, value: FileType.Sheet },
		],
	},

	DEPARTMENT_ID_TYPE: {
		displayName: t.DEPARTMENT_ID_TYPE,
		name: 'department_id_type',
		type: 'options',
		options: [
			{ name: 'Department ID', value: 'department_id' },
			{ name: 'Open Department ID', value: 'open_department_id' },
		],
		default: 'open_department_id',
	},

	INCLUDE_RESIGNED: {
		displayName: t.INCLUDE_RESIGNED,
		name: 'include_resigned',
		type: 'boolean',
		description: 'Whether the query results contain user information of resigned employees',
		default: false,
	},

	ORDER_BY: {
		displayName: t.ORDER_BY,
		name: 'order_by',
		type: 'options',
		default: 'EditedTime',
		options: [
			{ name: t.ORDER_BY_EDITED_TIME, value: 'EditedTime' },
			{ name: t.ORDER_BY_CREATED_TIME, value: 'CreatedTime' },
		],
	},

	DIRECTION: {
		displayName: t.DIRECTION,
		name: 'direction',
		type: 'options',
		default: 'DESC',
		options: [
			{ name: t.DIRECTION_ASC, value: 'ASC' },
			{ name: t.DIRECTION_DESC, value: 'DESC' },
		],
	},

	FILE_TOKEN: {
		displayName: t.FILE_TOKEN,
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
		displayName: t.SPACE_FILE_TYPE,
		name: 'space_file_type',
		type: 'multiOptions',
		default: [],
		required: true,
		options: [
			{ name: t.SPACE_FILE_TYPE_BITABLE, value: FileType.Bitable },
			{ name: t.SPACE_FILE_TYPE_DOC, value: FileType.Doc },
			{ name: t.SPACE_FILE_TYPE_DOCX, value: FileType.Docx },
			{ name: t.SPACE_FILE_TYPE_FOLDER, value: FileType.Folder },
			{ name: t.SPACE_FILE_TYPE_MINDNOTE, value: FileType.Mindnote },
			{ name: t.SPACE_FILE_TYPE_SHORTCUT, value: FileType.Shortcut },
			{ name: t.SPACE_FILE_TYPE_SLIDES, value: FileType.Slides },
			{ name: t.SPACE_FILE_TYPE_SPREADSHEET, value: FileType.Sheet },
		],
	},

	NAME: {
		displayName: t.NAME,
		name: 'name',
		type: 'string',
		default: '',
		required: true,
	},

	CONVERT_BLOCK_CONTENT_TYPE: {
		displayName: t.CONVERT_BLOCK_CONTENT_TYPE,
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
		displayName: t.CONVERT_BLOCK_CONTENT,
		name: 'content',
		type: 'string',
		default: '',
		required: true,
	},

	SPREADSHEET_ID: {
		displayName: t.SPREADSHEET_ID,
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
		displayName: t.DOCUMENT_BLOCK_ID,
		name: 'block_id',
		type: 'string',
		default: '',
		required: true,
		description: 'The block_id of the parent block',
	},

	DOCUMENT_REVISION_ID: {
		displayName: t.DOCUMENT_REVISION_ID,
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
		displayName: t.DOCUMENT_ID,
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
		displayName: t.TITLE,
		name: 'title',
		type: 'string',
		default: '',
		description: 'Only supports plain text. Length range: 1 characters ～ 800 characters.',
	},

	FILE_DURATION: {
		displayName: t.FILE_DURATION,
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
		displayName: t.FILE_NAME,
		name: 'file_name',
		type: 'string',
		default: '',
		hint: 'File name with a suffix, like test.mp4',
	},

	MESSAGE_UPLOAD_FILE_TYPE: {
		displayName: t.MESSAGE_UPLOAD_FILE_TYPE,
		name: 'file_type',
		type: 'options',
		options: [
			{ name: t.MESSAGE_UPLOAD_FILE_TYPE_DOC, value: 'doc' },
			{
				name: t.MESSAGE_UPLOAD_FILE_TYPE_MP4,
				value: 'mp4',
				description: 'Only supports mp4 format for video',
			},
			{
				name: t.MESSAGE_UPLOAD_FILE_TYPE_OPUS,
				value: 'opus',
				description: 'Only supports opus format for audio',
			},
			{ name: t.MESSAGE_UPLOAD_FILE_TYPE_PDF, value: 'pdf' },
			{ name: t.MESSAGE_UPLOAD_FILE_TYPE_PPT, value: 'ppt' },
			{
				name: t.MESSAGE_UPLOAD_FILE_TYPE_STREAM,
				value: 'stream',
				description: 'For other format that not listed',
			},
			{ name: t.MESSAGE_UPLOAD_FILE_TYPE_XLS, value: 'xls' },
		],
		default: 'opus',
	},

	BINARY_PROPERTY_NAME: {
		displayName: t.BINARY_PROPERTY_NAME,
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: '',
		description: 'The name of the input binary field containing the file/image to be uploaded',
	},

	OUTPUT_AS_BINARY: {
		displayName: t.OUTPUT_AS_BINARY,
		name: 'outputAsBinary',
		type: 'boolean',
		default: true,
		description:
			'Whether returns data as binary attachment. If disabled, returns JSON with base64-encoded data.',
	},

	DOWNLOAD_RESOURCE: {
		displayName: t.DOWNLOAD_RESOURCE,
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
		displayName: t.RECEIVE_MESSAGE_TYPES,
		name: 'messageTypes',
		type: 'multiOptions',
		options: [
			{
				name: t.MESSAGE_TYPE_IMAGE,
				value: MessageType.Image,
				description: MessageType.Image,
			},
			{
				name: t.MESSAGE_TYPE_FILE,
				value: MessageType.File,
				description: MessageType.File,
			},
			{
				name: t.MESSAGE_TYPE_RICH_TEXT,
				value: MessageType.RichText,
				description: MessageType.RichText,
			},
			{
				name: t.MESSAGE_TYPE_AUDIO,
				value: MessageType.Audio,
				description: MessageType.Audio,
			},
			{
				name: t.MESSAGE_TYPE_VIDEO,
				value: MessageType.Video,
				description: MessageType.Video,
			},
			{
				name: t.MESSAGE_TYPE_CARD,
				value: MessageType.Card,
				description: MessageType.Card,
			},
			{
				name: t.MESSAGE_TYPE_LOCATION,
				value: MessageType.Location,
				description: MessageType.Location,
			},
			{
				name: t.MESSAGE_TYPE_TODO,
				value: MessageType.Todo,
				description: MessageType.Todo,
			},
			{
				name: t.MESSAGE_TYPE_CALENDAR_EVENT,
				value: MessageType.CalendarEvent,
				description: MessageType.CalendarEvent,
			},
			{
				name: t.MESSAGE_TYPE_TEXT,
				value: MessageType.Text,
				description: MessageType.Text,
			},
		],
		required: true,
		default: [MessageType.Text],
	},

	RESOURCE_KEY: {
		displayName: t.RESOURCE_KEY,
		name: 'file_key',
		type: 'string',
		required: true,
		default: '',
		description: 'The key of the resource to be queried',
	},

	RESOURCE_TYPE: {
		displayName: t.RESOURCE_TYPE,
		name: 'type',
		type: 'options',
		options: [
			{
				name: t.RESOURCE_TYPE_IMAGE,
				value: 'image',
				description: 'The image in the content',
			},
			{
				name: t.RESOURCE_TYPE_FILE,
				value: 'file',
				description: 'The file, audio, video (except emoticons) in the content',
			},
		],
		default: 'image',
	},

	MESSAGE_REPLY_IN_THREAD: {
		displayName: t.MESSAGE_REPLY_IN_THREAD,
		name: 'reply_in_thread',
		type: 'boolean',
		default: false,
		description:
			'Whether to reply in thread form. If the value is true, the reply will be in thread form.',
	},

	MESSAGE_ID: {
		displayName: t.MESSAGE_ID,
		name: 'message_id',
		type: 'string',
		required: true,
		default: '',
	},

	MESSAGE_CONTENT: {
		displayName: t.MESSAGE_CONTENT,
		require: true,
		...OBJECT_JSON,
		name: 'content',
	},

	MESSAGE_TYPE: {
		displayName: t.MESSAGE_TYPE,
		name: 'msg_type',
		type: 'options',
		options: [
			{ name: t.MSG_TYPE_AUDIO, value: 'audio' },
			{ name: t.MSG_TYPE_FILE, value: 'file' },
			{ name: t.MSG_TYPE_IMAGE, value: 'image' },
			{ name: t.MSG_TYPE_INTERACTIVE, value: 'interactive' },
			{ name: t.MSG_TYPE_POST, value: 'post' },
			{ name: t.MSG_TYPE_SHARE_CHAT, value: 'share_chat' },
			{ name: t.MSG_TYPE_SHARE_USER, value: 'share_user' },
			{ name: t.MSG_TYPE_STICKER, value: 'sticker' },
			{ name: t.MSG_TYPE_SYSTEM, value: 'system' },
			{ name: t.MSG_TYPE_TEXT, value: 'text' },
			{ name: t.MSG_TYPE_MEDIA, value: 'media' },
		],
		required: true,
		default: 'text',
	},

	MESSAGE_REACTION: {
		displayName: t.MESSAGE_REACTION,
		name: 'reaction',
		type: 'string',
		required: true,
		default: '',
	},

	RECEIVE_ID_TYPE: {
		displayName: t.RECEIVE_ID_TYPE,
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
		displayName: t.CALENDAR_COLOR,
		name: 'color',
		type: 'color',
		default: '',
	},

	CALENDAR_SUMMARY_ALIAS: {
		displayName: t.CALENDAR_SUMMARY_ALIAS,
		name: 'summary_alias',
		type: 'string',
		default: '',
		description:
			'Setting this field (including subsequent modification of this field) only takes effect for the current identity',
	},

	CALENDAR_PERMISSIONS: {
		displayName: t.CALENDAR_PERMISSIONS,
		name: 'permissions',
		type: 'options',
		options: [
			{ name: t.CALENDAR_PERMISSIONS_PRIVATE, value: 'private' },
			{ name: t.CALENDAR_PERMISSIONS_SHOW_ONLY_FREE_BUSY, value: 'show_only_free_busy' },
			{ name: t.CALENDAR_PERMISSIONS_PUBLIC, value: 'public' },
		],
		default: 'show_only_free_busy',
		description: 'Calendar visibility range',
	},

	CALENDAR_DESCRIPTION: {
		displayName: t.CALENDAR_DESCRIPTION,
		name: 'description',
		type: 'string',
		default: '',
		description: 'Maximum length: 255 characters',
	},

	CALENDAR_TITLE: {
		displayName: t.CALENDAR_TITLE,
		name: 'summary',
		type: 'string',
		default: '',
		description: 'Maximum length: 255 characters',
	},

	MEMBER_ID: {
		displayName: t.MEMBER_ID,
		name: 'member_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
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
		displayName: t.MEMBER_ID_TYPE,
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
		displayName: t.BASE_ROLE_ID,
		name: 'role_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
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
		displayName: t.TEXT_FIELD_AS_ARRAY,
		name: 'text_field_as_array',
		type: 'boolean',
		default: false,
		description:
			'Whether to control the return format of field description (multi-line text format) data, true means return in array rich text form',
	},

	TABLE_FIELD_ID: {
		displayName: t.TABLE_FIELD_ID,
		name: 'field_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
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
		displayName: t.AUTOMATIC_FIELDS,
		name: 'automatic_fields',
		type: 'boolean',
		default: false,
	},

	WITH_SHARED_URL: {
		displayName: t.WITH_SHARED_URL,
		name: 'with_shared_url',
		type: 'boolean',
		default: false,
	},

	TABLE_RECORD_ID: {
		displayName: t.TABLE_RECORD_ID,
		name: 'record_id',
		type: 'string',
		required: true,
		default: '',
	},

	TABLE_VIEW_PROPERTY: {
		displayName: t.TABLE_VIEW_PROPERTY,
		...OBJECT_JSON,
	},

	TABLE_VIEW_ID: {
		displayName: t.TABLE_VIEW_ID,
		name: 'view_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
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
		displayName: t.TABLE_VIEW_TYPE,
		name: 'view_type',
		required: true,
		type: 'options',
		options: [
			{ name: t.TABLE_VIEW_TYPE_FORM, value: 'form' },
			{ name: t.TABLE_VIEW_TYPE_GALLERY, value: 'gallery' },
			{ name: t.TABLE_VIEW_TYPE_GANTT, value: 'gantt' },
			{ name: t.TABLE_VIEW_TYPE_GRID, value: 'grid' },
			{ name: t.TABLE_VIEW_TYPE_KANBAN, value: 'kanban' },
		],
		default: 'grid',
	},

	TABLE_VIEW_NAME: {
		displayName: t.TABLE_VIEW_NAME,
		name: 'view_name',
		type: 'string',
		required: true,
		default: '',
		description:
			'Name cannot contain special characters, must be no more than 100 characters long, cannot be empty, and must not contain these special symbols: [ ]',
	},

	PAGE_SIZE: {
		displayName: t.PAGE_SIZE,
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
		displayName: t.PAGE_TOKEN,
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
		displayName: t.WHETHER_PAGING,
		name: 'whether_paging',
		type: 'boolean',
		default: false,
	},

	NEW_NAME: {
		displayName: t.NEW_NAME,
		name: 'name',
		type: 'string',
		required: true,
		default: '',
	},

	IS_ADVANCED: {
		displayName: t.IS_ADVANCED,
		name: 'is_advanced',
		type: 'boolean',
		default: false,
	},

	WHETHER_COPY_CONTENT: {
		displayName: t.WHETHER_COPY_CONTENT,
		name: 'without_content',
		type: 'boolean',
		default: false,
		description:
			'Whether to copy the content from the original table, True is copy, False is not copy',
	},

	TIME_ZONE: {
		displayName: t.TIME_ZONE,
		name: 'time_zone',
		type: 'string',
		default: 'Asia/Shanghai',
		description:
			'<a target="_blank" href="https://bytedance.larkoffice.com/docx/YKRndTM7VoyDqpxqqeEcd67MnEf">Open document</a>',
	},

	FOLDER_TOKEN: {
		displayName: t.FOLDER_TOKEN,
		name: 'folder_token',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
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
		displayName: t.BASE_APP_NAME,
		name: 'name',
		type: 'string',
		default: '',
	},

	REQUEST_BODY: {
		displayName: t.REQUEST_BODY,
		require: true,
		...OBJECT_JSON,
	},

	REQUEST_ID: {
		displayName: t.REQUEST_ID,
		name: 'request_id',
		type: 'string',
		default: '',
		description: 'Unique identifier for the request, used to ensure idempotency',
	},

	USER_ID_TYPE: {
		displayName: t.USER_ID_TYPE,
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
		displayName: t.BASE_APP_TOKEN,
		name: 'app_token',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
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

	RECORD_IDS: {
		displayName: t.RECORD_IDS,
		name: 'record_ids',
		type: 'json',
		default: '[]',
		required: true,
		description: 'List of record IDs to retrieve',
	},

	BASE_TABLE_ID: {
		displayName: t.BASE_TABLE_ID,
		name: 'table_id',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
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
		displayName: t.IGNORE_CONSISTENCY_CHECK,
		name: 'ignore_consistency_check',
		type: 'boolean',
		default: true,
		description: 'Whether to ignore consistency checks',
	},

	CALENDAR_EVENT_ATTENDEES: {
		displayName: t.CALENDAR_EVENT_ATTENDEES,
		name: 'attendees',
		type: 'json',
		default: '[]',
		required: true,
		description: 'List of attendees to add to the event',
	},

	INSTANCE_START_TIME_ADMIN: {
		displayName: t.INSTANCE_START_TIME_ADMIN,
		name: 'instance_start_time_admin',
		type: 'string',
		default: '',
		description:
			'This parameter is only used to modify a event instance in a repeating event. This field does not need to be filled in for non-repeating events.',
	},

	IS_ENABLE_ADMIN: {
		displayName: t.IS_ENABLE_ADMIN,
		name: 'is_enable_admin',
		type: 'boolean',
		default: false,
		description:
			'Whether to enable the meeting room administrator status (you need to set a member as the meeting room administrator in the management background first)',
	},

	ADD_OPERATOR_TO_ATTENDEE: {
		displayName: t.ADD_OPERATOR_TO_ATTENDEE,
		name: 'add_operator_to_attendee',
		type: 'boolean',
		default: false,
		description: 'Whether to add the meeting room contact (operate_id) to the schedule invitees',
	},

	CALENDAR_EVENT_ATTENDEE_IDS: {
		displayName: t.CALENDAR_EVENT_ATTENDEE_IDS,
		name: 'attendee_ids',
		type: 'json',
		default: '[]',
		required: true,
		description: 'List of attendee IDs to delete',
	},

	CALENDAR_EVENT_DELETE_IDS: {
		displayName: t.CALENDAR_EVENT_DELETE_IDS,
		name: 'delete_ids',
		type: 'json',
		default: '[]',
		description:
			'The ID corresponding to the invitee type, which is a supplementary field to the attendee_ids field',
	},

	NEED_RESOURCE_CUSTOMIZATION: {
		displayName: t.NEED_RESOURCE_CUSTOMIZATION,
		name: 'need_resource_customization',
		type: 'boolean',
		default: false,
		description: 'Whether meeting room form information is required',
	},

	MEETING_CHAT_ID: {
		displayName: t.MEETING_CHAT_ID,
		name: 'meeting_chat_id',
		type: 'string',
		required: true,
		default: '',
		description: 'The group ID is returned when the group is created',
	},
};
