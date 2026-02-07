/**
 * Supported locales for the application
 */
export type Locale = 'en' | 'zh';

/**
 * Default locale when N8N_DEFAULT_LOCALE is not set or invalid
 */
export const DEFAULT_LOCALE: Locale = 'zh';

/**
 * Type definition for WORDING translations
 */
export interface IWording {
	// Base App
	CreateBaseApp: string;
	CopyBaseApp: string;
	GetBaseAppInfo: string;
	UpdateBaseApp: string;

	// Base Table
	CreateBaseTable: string;
	BatchCreateBaseTables: string;
	UpdateBaseTable: string;
	GetBaseTableList: string;
	DeleteBaseTable: string;
	BatchDeleteBaseTables: string;

	// Base Table View
	CreateTableView: string;
	UpdateTableView: string;
	GetTableViewList: string;
	GetTableViewInfo: string;
	DeleteTableView: string;

	// Base Table Record
	CreateTableRecord: string;
	UpdateTableRecord: string;
	SearchTableRecords: string;
	DeleteTableRecord: string;
	BatchCreateTableRecords: string;
	BatchUpdateTableRecords: string;
	GetTableRecordList: string;
	BatchDeleteTableRecords: string;

	// Base Table Field
	CreateTableField: string;
	UpdateTableField: string;
	GetTableFieldList: string;
	DeleteTableField: string;

	// Base Role
	CreateBaseRole: string;
	UpdateBaseRole: string;
	GetBaseRoleList: string;
	DeleteBaseRole: string;

	// Base Role Member
	CreateBaseRoleMember: string;
	BatchCreateBaseRoleMembers: string;
	GetBaseRoleMemberList: string;
	DeleteBaseRoleMember: string;
	BatchDeleteBaseRoleMembers: string;

	// Message
	SendMessage: string;
	ReplyMessage: string;
	EditMessage: string;
	ForwardMessage: string;
	RecallMessage: string;
	GetMessageContentResource: string;
	GetMessageContentInfo: string;
	ParseMessageContent: string;
	UploadImage: string;
	DownloadImage: string;
	UploadFile: string;
	DownloadFile: string;
	SendLimitedCard: string;
	UpdateMessageCard: string;
	DeleteLimitedCard: string;
	SendAndWaitMessage: string;
	ParseWebhookMessage: string;
	SendStreamMessage: string;
	UpdateInteractiveCard: string;
	AddReactionForMessage: string;

	// Document
	CreateDocument: string;
	GetDocumentInfo: string;
	GetRawContent: string;
	GetBlockList: string;

	// Document Block
	CreateDocumentBlock: string;
	CreateNestedDocumentBlock: string;
	UpdateDocumentBlock: string;
	GetDocumentBlock: string;
	DeleteDocumentBlock: string;
	ConvertDocumentBlock: string;

	// Space
	CreateFolder: string;
	DeleteFileOrFolder: string;
	GetFileList: string;
	SearchFiles: string;
	UploadFileAll: string;
	UploadMedia: string;
	DownloadMedia: string;
	GetMediaTempDownloadLink: string;

	// Contact
	BatchGetUserInfo: string;
	Emails: string;
	PhoneNumbers: string;
	GetUserInfo: string;
	UserId: string;

	// Spreadsheet
	CreateSpreadsheet: string;
	UpdateSpreadsheet: string;
	GetSpreadsheetInfo: string;
	CreateSheet: string;
	CopySheet: string;
	DeleteSheet: string;
	UpdateSheet: string;
	GetSheetList: string;
	GetSheetInfo: string;
	CreateDimension: string;
	InsertDimension: string;
	UpdateDimension: string;
	MoveDimension: string;
	DeleteDimension: string;
	MergeCells: string;
	SplitCells: string;
	FindCells: string;
	ReplaceCells: string;
	SetCellStyle: string;
	ValuesInsert: string;
	ValuesAppend: string;
	ValuesImageInsert: string;
	ValuesRead: string;
	ValuesWrite: string;

	// Calendar
	CreateCalendar: string;
	DeleteCalendar: string;
	GetPrimaryCalendarInfo: string;
	GetCalendarInfo: string;
	GetCalendarList: string;
	UpdateCalendar: string;
	SearchCalendar: string;
	CalendarAvailability: string;
	CalendarEventCreate: string;
	CalendarEventDelete: string;
	CalendarEventSearch: string;
	CalendarEventGet: string;
	CalendarEventGetList: string;
	CalendarEventUpdate: string;
	CalendarEventAttendeeCreate: string;
	CalendarEventAttendeeDelete: string;
	CalendarEventAttendeeGetList: string;
	CalendarMeetingChatCreate: string;
	CalendarMeetingChatUnbind: string;

	// MCP
	GetToolList: string;
	ExecuteTool: string;

	// Common
	Options: string;
	AddField: string;
	OpenDocument: string;

	// Resource Names
	ResourceBase: string;
	ResourceMessage: string;
	ResourceDocument: string;
	ResourceSpace: string;
	ResourceContacts: string;
	ResourceSpreadsheet: string;
	ResourceCalendar: string;
}

/**
 * Get the current locale from environment variable
 */
export function getCurrentLocale(): Locale {
	const locale = process.env.N8N_DEFAULT_LOCALE;
	if (locale === 'en' || locale === 'en-US' || locale === 'en_US') {
		return 'en';
	}
	return DEFAULT_LOCALE;
}
