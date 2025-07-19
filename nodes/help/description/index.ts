export const DESCRIPTIONS = {
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
		type: 'string',
		typeOptions: { password: true },
		default: '',
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
