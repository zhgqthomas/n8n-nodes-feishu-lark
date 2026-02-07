import { IWording } from '../types';

export const WORDING_ZH: IWording = {
	// Base App
	CreateBaseApp: '创建多维表格',
	CopyBaseApp: '复制多维表格',
	GetBaseAppInfo: '获取多维表格元数据',
	UpdateBaseApp: '更新多维表格元数据',

	// Base Table
	CreateBaseTable: '新增数据表',
	BatchCreateBaseTables: '批量创建数据表',
	UpdateBaseTable: '更新数据表',
	GetBaseTableList: '列出数据表',
	DeleteBaseTable: '删除数据表',
	BatchDeleteBaseTables: '批量删除数据表',

	// Base Table View
	CreateTableView: '新增视图',
	UpdateTableView: '更新视图',
	GetTableViewList: '列出视图',
	GetTableViewInfo: '获取视图',
	DeleteTableView: '删除视图',

	// Base Table Record
	CreateTableRecord: '新增记录',
	UpdateTableRecord: '更新记录',
	SearchTableRecords: '查询记录',
	DeleteTableRecord: '删除记录',
	BatchCreateTableRecords: '批量新增记录',
	BatchUpdateTableRecords: '批量更新记录',
	GetTableRecordList: '批量获取记录',
	BatchDeleteTableRecords: '批量删除记录',

	// Base Table Field
	CreateTableField: '新增字段',
	UpdateTableField: '更新字段',
	GetTableFieldList: '列出字段',
	DeleteTableField: '删除字段',

	// Base Role
	CreateBaseRole: '新增自定义角色',
	UpdateBaseRole: '更新自定义角色',
	GetBaseRoleList: '列出自定义角色',
	DeleteBaseRole: '删除自定义角色',

	// Base Role Member
	CreateBaseRoleMember: '新增协作者',
	BatchCreateBaseRoleMembers: '批量新增协作者',
	GetBaseRoleMemberList: '列出协作者',
	DeleteBaseRoleMember: '删除协作者',
	BatchDeleteBaseRoleMembers: '批量删除协作者',

	// Message
	SendMessage: '发送消息',
	ReplyMessage: '回复消息',
	EditMessage: '编辑消息',
	ForwardMessage: '转发消息',
	RecallMessage: '撤回消息',
	GetMessageContentResource: '获取消息中的资源文件',
	GetMessageContentInfo: '获取消息内容',
	ParseMessageContent: '解析消息中的内容',
	UploadImage: '上传图片',
	DownloadImage: '下载图片',
	UploadFile: '上传文件',
	DownloadFile: '下载文件',
	SendLimitedCard: '发送特定可见卡片消息',
	UpdateMessageCard: '更新卡片消息',
	DeleteLimitedCard: '删除特定可见卡片消息',
	SendAndWaitMessage: '发送并等待',
	ParseWebhookMessage: '解析 Webhook 消息',
	SendStreamMessage: '发送流式消息',
	UpdateInteractiveCard: '延时更新消息卡片',
	AddReactionForMessage: "添加消息表情回复",

	// Document
	CreateDocument: '创建文档',
	GetDocumentInfo: '获取文档信息',
	GetRawContent: '获取文档纯文本内容',
	GetBlockList: '获取文档块列表',

	// Document Block
	CreateDocumentBlock: '创建文档块',
	CreateNestedDocumentBlock: '创建嵌套文档块',
	UpdateDocumentBlock: '更新文档块内容',
	GetDocumentBlock: '获取文档块内容',
	DeleteDocumentBlock: '删除文档块',
	ConvertDocumentBlock: 'Markdown/HTML 转换为文档块',

	// Space
	CreateFolder: '创建文件夹',
	DeleteFileOrFolder: '删除文件或文件夹',
	GetFileList: '获取文件列表',
	SearchFiles: '搜索文档',
	UploadFileAll: '上传文件',
	UploadMedia: '上传素材',
	DownloadMedia: '下载素材',
	GetMediaTempDownloadLink: '获取素材临时下载链接',

	// Contact
	BatchGetUserInfo: '批量获取用户信息',
	Emails: '用户邮箱列表',
	PhoneNumbers: '用户手机号列表',
	GetUserInfo: '获取用户信息',
	UserId: '用户ID',

	// Spreadsheet
	CreateSpreadsheet: '创建电子表格',
	UpdateSpreadsheet: '更新电子表格',
	GetSpreadsheetInfo: '获取电子表格信息',
	CreateSheet: '新建工作表',
	CopySheet: '复制工作表',
	DeleteSheet: '删除工作表',
	UpdateSheet: '更新工作表',
	GetSheetList: '获取工作表列表',
	GetSheetInfo: '获取工作表信息',
	CreateDimension: '增加行列',
	InsertDimension: '插入行列',
	UpdateDimension: '更新行列',
	MoveDimension: '移动行列',
	DeleteDimension: '删除行列',
	MergeCells: '合并单元格',
	SplitCells: '拆分单元格',
	FindCells: '查找单元格',
	ReplaceCells: '替换单元格',
	SetCellStyle: '设置单元格样式',
	ValuesInsert: '插入数据',
	ValuesAppend: '追加数据',
	ValuesImageInsert: '插入图片',
	ValuesRead: '读取数据',
	ValuesWrite: '写入数据',

	// Calendar
	CreateCalendar: '创建共享日历',
	DeleteCalendar: '删除共享日历',
	GetPrimaryCalendarInfo: '获取主日历信息',
	GetCalendarInfo: '获取日历信息',
	GetCalendarList: '获取日历列表',
	UpdateCalendar: '更新日历信息',
	SearchCalendar: '搜索日历',
	CalendarAvailability: '获取日程忙闲信息',
	CalendarEventCreate: '创建日程',
	CalendarEventDelete: '删除日程',
	CalendarEventSearch: '搜索日程',
	CalendarEventGet: '获取日程',
	CalendarEventGetList: '获取日程列表',
	CalendarEventUpdate: '更新日程',
	CalendarEventAttendeeCreate: '添加日程参与人',
	CalendarEventAttendeeDelete: '删除日程参与人',
	CalendarEventAttendeeGetList: '获取日程参与人列表',
	CalendarMeetingChatCreate: '创建会议群',
	CalendarMeetingChatUnbind: '解绑会议群',

	// MCP
	GetToolList: '获取工具列表',
	ExecuteTool: '执行工具',

	// Common
	Options: '选项',
	AddField: '添加字段',
	OpenDocument: '浏览官方文档',

	// Resource Names
	ResourceBase: '多维表格',
	ResourceMessage: '消息',
	ResourceDocument: '文档',
	ResourceSpace: '云空间',
	ResourceContacts: '通讯录',
	ResourceSpreadsheet: '表格',
	ResourceCalendar: '日历',
};
