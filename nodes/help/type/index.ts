export type FormResponseTypeOptions = {
	messageButtonLabel?: string;
	responseFormTitle?: string;
	responseFormDescription?: string;
	responseFormButtonLabel?: string;
	responseFormCustomCss?: string;
};

export type SendAndWaitConfig = {
	title: string;
	message: string;
	options: Array<{ label: string; url: string; style: string }>;
	appendAttribution?: boolean;
};

export type FormTriggerInput = {
	isSelect?: boolean;
	isMultiSelect?: boolean;
	isTextarea?: boolean;
	isFileInput?: boolean;
	isInput?: boolean;
	label: string;
	defaultValue?: string;
	id: string;
	errorId: string;
	type?: 'text' | 'number' | 'date';
	inputRequired: 'form-required' | '';
	selectOptions?: string[];
	multiSelectOptions?: Array<{ id: string; label: string }>;
	acceptFileTypes?: string;
	multipleFiles?: 'multiple' | '';
	placeholder?: string;
};

export type FormTriggerData = {
	testRun: boolean;
	formTitle: string;
	formDescription?: string;
	formDescriptionMetadata?: string;
	formSubmittedHeader?: string;
	formSubmittedText?: string;
	redirectUrl?: string;
	n8nWebsiteLink: string;
	formFields: FormTriggerInput[];
	useResponseData?: boolean;
	appendAttribution?: boolean;
	buttonLabel?: string;
	dangerousCustomCss?: string;
};
