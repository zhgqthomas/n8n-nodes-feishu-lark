export const WORDING = {
	// Base App
	CreateBaseApp: 'Create Base App | 创建多维表格',
	CopyBaseApp: 'Copy Base App | 复制多维表格',
	GetBaseAppInfo: 'Get App Info | 获取多维表格元数据',
	UpdateBaseApp: 'Update App Info | 更新多维表格元数据',

	// Base Table
	CreateBaseTable: 'Create Table | 新增数据表',
	BatchCreateBaseTables: 'Batch Create Tables | 批量创建数据表',
	UpdateBaseTable: 'Update Table | 更新数据表',
	GetBaseTableList: 'Get Tables | 列出数据表',
	DeleteBaseTable: 'Delete Table | 删除数据表',
	BatchDeleteBaseTables: 'Batch Delete Tables | 批量删除数据表',

	// Base Table View
	CreateTableView: 'Create View | 新增视图',
	UpdateTableView: 'Update View | 更新视图',
	GetTableViewList: 'Get Views | 列出视图',
	GetTableViewInfo: 'Get View Info | 获取视图',
	DeleteTableView: 'Delete View | 删除视图',

	// Base Table Record
	CreateTableRecord: 'Create Record | 新增记录',
	UpdateTableRecord: 'Update Record | 更新记录',
	SearchTableRecords: 'Search Records | 查询记录',
	DeleteTableRecord: 'Delete Record | 删除记录',
	BatchCreateTableRecords: 'Batch Create Records | 批量新增记录',
	BatchUpdateTableRecords: 'Batch Update Records | 批量更新记录',
	GetTableRecordList: 'Get Records | 批量获取记录',
	BatchDeleteTableRecords: 'Batch Delete Records | 批量删除记录',
	TableRecordIdList: 'Record IDs(记录 ID 列表)',

	// Base Table Field
	CreateTableField: 'Create Field | 新增字段',
	UpdateTableField: 'Update Field | 更新字段',
	GetTableFieldList: 'Get Fields | 列出字段',
	DeleteTableField: 'Delete Field | 删除字段',

	// Base Role
	CreateBaseRole: 'Create Role | 新增自定义角色',
	UpdateBaseRole: 'Update Role | 更新自定义角色',
	GetBaseRoleList: 'Get Roles | 列出自定义角色',
	DeleteBaseRole: 'Delete Role | 删除自定义角色',

	// Base Role Member
	CreateBaseRoleMember: 'Create Role Member | 新增协作者',
	BatchCreateBaseRoleMembers: 'Batch Create Role Members | 批量新增协作者',
	GetBaseRoleMemberList: 'Get Role Members | 列出协作者',
	DeleteBaseRoleMember: 'Delete Role Member | 删除协作者',
	BatchDeleteBaseRoleMembers: 'Batch Delete Role Members | 批量删除协作者',
	RoleMemberIdList: 'Member IDs(协作者 ID 列表)',

	// Message
	SendMessage: 'Send | 发送消息',
	ReplyMessage: 'Reply | 回复消息',
	EditMessage: 'Edit | 编辑消息',
	ForwardMessage: 'Forward | 转发消息',
	RecallMessage: 'Recall | 撤回消息',
	GetMessageContentResource: 'Get Content Resource | 获取消息中的资源文件',
	GetMessageContentInfo: 'Get Content Info | 获取消息内容',
	ParseMessageContent: 'Parse Content | 解析消息中的内容',
	UploadImage: 'Upload Image | 上传图片',
	DownloadImage: 'Download Image | 下载图片',
	UploadFile: 'Upload File | 上传文件',
	DownloadFile: 'Download File | 下载文件',
	SendMessageCard: 'Send Card Message | 发送卡片消息',
	UpdateMessageCard: 'Update Card Message | 更新卡片消息',
	DeleteMessageCard: 'Delete Card Message | 删除卡片消息',
	SendAndWaitMessage: 'Send and Wait',
	ParseWebhookMessage: 'Parse Webhook Message',
	SendStreamMessage: 'Send Stream Message | 发送流式消息',

	// Document
	CreateDocument: 'Create | 创建文档',
	GetDocumentInfo: 'Get Info | 获取文档信息',
	GetRawContent: 'Get Raw Content | 获取文档纯文本内容',
	GetBlockList: 'Get Block List | 获取文档块列表',

	// Document Block
	CreateDocumentBlock: 'Create Block | 创建文档块',
	CreateNestedDocumentBlock: 'Create Nested Block | 创建嵌套文档块',
	UpdateDocumentBlock: 'Update Block | 更新文档块内容',
	GetDocumentBlock: 'Get Block | 获取文档块内容',
	DeleteDocumentBlock: 'Delete Block | 删除文档块',
	ConvertDocumentBlock: 'Markdown/HTML Convert to Block',

	// Space
	CreateFolder: 'Create Folder | 创建文件夹',
	DeleteFileOrFolder: 'Delete File or Folder | 删除文件或文件夹',
	GetFileList: 'Get File List | 获取文件列表',
	SearchFiles: 'Search Files | 搜索文档',
	UploadFileAll: 'Upload File | 上传文件',
	UploadMedia: 'Upload Media | 上传素材',

	// Contact
	BatchGetUserInfo: 'Batch Get User Info | 批量获取用户信息',
	Emails: 'Emails(用户邮箱列表)',
	PhoneNumbers: 'Phone Numbers(用户手机号列表)',
	GetUserInfo: 'Get User Info | 获取用户信息',
	UserId: 'User ID(用户ID)',

	// Spreadsheet
	CreateSpreadsheet: 'Create | 创建电子表格',
	UpdateSpreadsheet: 'Update | 更新电子表格',
	GetSpreadsheetInfo: 'Get Info | 获取电子表格信息',
	CreateSheet: 'Create Sheet | 新建工作表',
	CopySheet: 'Copy Sheet | 复制工作表',
	DeleteSheet: 'Delete Sheet | 删除工作表',
	UpdateSheet: 'Update Sheet | 更新工作表',
	GetSheetList: 'Get Sheet List | 获取工作表列表',
	GetSheetInfo: 'Get Sheet Info | 获取工作表信息',
	CreateDimension: 'Create Dimension | 增加行列',
	InsertDimension: 'Insert Dimension | 插入行列',
	UpdateDimension: 'Update Dimension | 更新行列',
	MoveDimension: 'Move Dimension | 移动行列',
	DeleteDimension: 'Delete Dimension | 删除行列',
	MergeCells: 'Merge Cells | 合并单元格',
	SplitCells: 'Split Cells | 拆分单元格',
	FindCells: 'Find Cells | 查找单元格',
	ReplaceCells: 'Replace Cells | 替换单元格',
	SetCellStyle: 'Set Cell Style | 设置单元格样式',
	ValuesInsert: 'Insert Values | 插入数据',
	ValuesAppend: 'Append Values | 追加数据',
	ValuesImageInsert: 'Insert Image | 插入图片',
	ValuesRead: 'Read Values | 读取数据',
	ValuesWrite: 'Write Values | 写入数据',

	// Calendar
	CreateCalendar: 'Create Calendar | 创建共享日历',
	DeleteCalendar: 'Delete Calendar | 删除共享日历',
	GetPrimaryCalendarInfo: 'Get Primary Info | 获取主日历信息',
	GetCalendarInfo: 'Get Info | 获取日历信息',
	GetCalendarList: 'Get List | 获取日历列表',
	UpdateCalendar: 'Update Calendar | 更新日历信息',
	SearchCalendar: 'Search Calendar | 搜索日历',
	CalendarAvailability: 'Availability | 获取日程忙闲信息',
	CalendarEventCreate: 'Create Event | 创建日程',
	CalendarEventDelete: 'Delete Event | 删除日程',
	CalendarEventSearch: 'Search Event | 搜索日程',
	CalendarEventGet: 'Get Event | 获取日程',
	CalendarEventGetList: 'Get Event List | 获取日程列表',
	CalendarEventUpdate: 'Update Event | 更新日程',
	CalendarEventAttendeeCreate: 'Create Event Attendee | 添加日程参与人',
	CalendarEventAttendeeDelete: 'Delete Event Attendee | 删除日程参与人',
	CalendarEventAttendeeGetList: 'Get Event Attendee List | 获取日程参与人列表',
	CalendarMeetingChatCreate: 'Create Meeting Chat | 创建会议群',
	CalendarMeetingChatUnbind: 'Unbind Meeting Chat | 解绑会议群',

	// MCP
	GetToolList: 'List Tools | 获取工具列表',
	ExecuteTool: 'Execute Tool | 执行工具',

	// Common
	Options: 'Options(选项)',
	AddField: 'Add Field | 添加字段',
	OpenDocument: 'Open official document | 浏览官方文档',
};
