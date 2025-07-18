export declare const enum TriggerEventType {
	ReceiveMessage = 'im.message.receive_v1',
}

export declare const enum MessageType {
	Image = 'image',
	File = 'file',
	RichText = 'post',
	Audio = 'audio',
	Video = 'media',
	Card = 'interactive',
	Location = 'location',
	Todo = 'todo',
	CalendarEvent = 'share_calendar_event',
	Text = 'text',
}

export declare const enum ResourceType {
	Base = 'base',
	Calendar = 'calendar',
	Contacts = 'contacts',
	Document = 'document',
	Message = 'message',
	Spreadsheet = 'spreadsheet',
	Space = 'space',
	Task = 'task',
	Wiki = 'wiki_spaces',
}

export declare const enum OperationType {
	// Base App
	CreateBaseApp = 'createApp',
	CopyBaseApp = 'copyApp',
	GetBaseAppInfo = 'getAppInfo',
	UpdateBaseApp = 'updateApp',

	// Base Table
	CreateBaseTable = 'createTable',
	BatchCreateBaseTable = 'batchCreateTables',
	UpdateBaseTable = 'updateTable',
	GetBaseTableList = 'getTableList',
	DeleteBaseTable = 'deleteTable',
	BatchDeleteBaseTables = 'batchDeleteTables',

	// Base Table View
	CreateTableView = 'createView',
	UpdateTableView = 'updateView',
	GetTableViewList = 'getViewList',
	GetTableViewInfo = 'getViewInfo',
	DeleteTableView = 'deleteView',

	// Base Table Record
	CreateTableRecord = 'createRecord',
	UpdateTableRecord = 'updateRecord',
	SearchTableRecords = 'searchRecords',
	DeleteTableRecord = 'deleteRecord',
	BatchCreateTableRecords = 'batchCreateRecords',
	BatchUpdateTableRecords = 'batchUpdateRecords',
	GetTableRecordList = 'getRecordList',
	BatchDeleteTableRecords = 'batchDeleteRecords',

	// Message
	ParseMessageContent = 'parseContent',
}

export declare const enum OutputType {
	Single = 'single',
	Multiple = 'multiple',
	None = 'none',
}

export declare const enum FileType {
	Doc = 'doc',
	Sheet = 'sheet',
	Mindnote = 'mindnote',
	Bitable = 'bitable',
	File = 'file',
	Docx = 'docx',
	Folder = 'folder',
	Shortcut = 'shortcut',
}
