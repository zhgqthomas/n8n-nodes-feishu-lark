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
	Message = 'messaging',
	Sheets = 'sheets',
	Space = 'space',
	Task = 'task',
	Wiki = 'wiki_spaces',
}

export declare const enum OperationType {
	ParseMessageContent = 'parseContent',
}

export declare const enum OutputType {
	Single = 'single',
	Multiple = 'multiple',
	None = 'none',
}
