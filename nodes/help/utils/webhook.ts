import { isbot } from 'isbot';
import { DateTime } from 'luxon';
import {
	ApplicationError,
	FORM_TRIGGER_NODE_TYPE,
	FormFieldsParameter,
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	IWebhookFunctions,
	jsonParse,
	MultiPartFormData,
	NodeOperationError,
	tryToParseJsonToFormFields,
	WAIT_INDEFINITELY,
} from 'n8n-workflow';
import sanitize from 'sanitize-html';
import { ACTION_RECORDED_PAGE } from '../templates';

const INPUT_FIELD_IDENTIFIER = 'field-0';

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

// Webhook Function --------------------------------------------------------------
const getFormResponseCustomizations = (context: IWebhookFunctions) => {
	const message = context.getNodeParameter('message', '') as string;
	const options = context.getNodeParameter('options', {}) as FormResponseTypeOptions;

	let formTitle = '';
	if (options.responseFormTitle) {
		formTitle = options.responseFormTitle;
	}

	let formDescription = message;
	if (options.responseFormDescription) {
		formDescription = options.responseFormDescription;
	}
	formDescription = formDescription.replace(/\\n/g, '\n').replace(/<br>/g, '\n');

	let buttonLabel = 'Submit';
	if (options.responseFormButtonLabel) {
		buttonLabel = options.responseFormButtonLabel;
	}

	return {
		formTitle,
		formDescription,
		buttonLabel,
		customCss: options.responseFormCustomCss,
	};
};

export function sanitizeCustomCss(css: string | undefined): string | undefined {
	if (!css) return undefined;

	// Use sanitize-html with custom settings for CSS
	return sanitize(css, {
		allowedTags: [], // No HTML tags allowed
		allowedAttributes: {}, // No attributes allowed
		// This ensures we're only keeping the text content
		// which should be the CSS, while removing any HTML/script tags
	});
}

export function createDescriptionMetadata(description: string) {
	return description === ''
		? 'n8n form'
		: description.replace(/^\s*\n+|<\/?[^>]+(>|$)/g, '').slice(0, 150);
}

export function prepareFormData({
	formTitle,
	formDescription,
	formSubmittedHeader,
	formSubmittedText,
	redirectUrl,
	formFields,
	testRun,
	query,
	instanceId,
	useResponseData,
	appendAttribution = true,
	buttonLabel,
	customCss,
}: {
	formTitle: string;
	formDescription: string;
	formSubmittedText: string | undefined;
	redirectUrl: string | undefined;
	formFields: FormFieldsParameter;
	testRun: boolean;
	query: IDataObject;
	instanceId?: string;
	useResponseData?: boolean;
	appendAttribution?: boolean;
	buttonLabel?: string;
	formSubmittedHeader?: string;
	customCss?: string;
}) {
	const utm_campaign = instanceId ? `&utm_campaign=${instanceId}` : '';
	const n8nWebsiteLink = `https://n8n.io/?utm_source=n8n-internal&utm_medium=form-trigger${utm_campaign}`;

	if (formSubmittedText === undefined) {
		formSubmittedText = 'Your response has been recorded';
	}

	const formData: FormTriggerData = {
		testRun,
		formTitle,
		formDescription,
		formDescriptionMetadata: createDescriptionMetadata(formDescription),
		formSubmittedHeader,
		formSubmittedText,
		n8nWebsiteLink,
		formFields: [],
		useResponseData,
		appendAttribution,
		buttonLabel,
		dangerousCustomCss: sanitizeCustomCss(customCss),
	};

	if (redirectUrl) {
		if (!redirectUrl.includes('://')) {
			redirectUrl = `http://${redirectUrl}`;
		}
		formData.redirectUrl = redirectUrl;
	}

	for (const [index, field] of formFields.entries()) {
		const { fieldType, requiredField, multiselect, placeholder } = field;

		const input: IDataObject = {
			id: `field-${index}`,
			errorId: `error-field-${index}`,
			label: field.fieldLabel,
			inputRequired: requiredField ? 'form-required' : '',
			defaultValue: query[field.fieldLabel] ?? '',
			placeholder,
		};

		if (multiselect) {
			input.isMultiSelect = true;
			input.multiSelectOptions =
				field.fieldOptions?.values.map((e, i) => ({
					id: `option${i}_${input.id}`,
					label: e.option,
				})) ?? [];
		} else if (fieldType === 'file') {
			input.isFileInput = true;
			input.acceptFileTypes = field.acceptFileTypes;
			input.multipleFiles = field.multipleFiles ? 'multiple' : '';
		} else if (fieldType === 'dropdown') {
			input.isSelect = true;
			const fieldOptions = field.fieldOptions?.values ?? [];
			input.selectOptions = fieldOptions.map((e) => e.option);
		} else if (fieldType === 'textarea') {
			input.isTextarea = true;
		} else if (fieldType === 'html') {
			input.isHtml = true;
			input.html = field.html as string;
		} else if (fieldType === 'hiddenField') {
			input.isHidden = true;
			input.hiddenName = field.fieldName as string;
			input.hiddenValue =
				input.defaultValue === '' ? (field.fieldValue as string) : input.defaultValue;
		} else {
			input.isInput = true;
			input.type = fieldType as 'text' | 'number' | 'date' | 'email';
		}

		formData.formFields.push(input as FormTriggerInput);
	}

	return formData;
}

/**
 * @TECH_DEBT Explore replacing with handlebars
 */
export function getResolvables(expression: string) {
	if (!expression) return [];

	const resolvables = [];
	const resolvableRegex = /({{[\s\S]*?}})/g;

	let match;

	while ((match = resolvableRegex.exec(expression)) !== null) {
		if (match[1]) {
			resolvables.push(match[1]);
		}
	}

	return resolvables;
}

export function resolveRawData(context: IWebhookFunctions, rawData: string) {
	const resolvables = getResolvables(rawData);
	let returnData: string = rawData;

	if (returnData.startsWith('=')) {
		returnData = returnData.replace(/^=+/, '');
	} else {
		return returnData;
	}

	if (resolvables.length) {
		for (const resolvable of resolvables) {
			const resolvedValue = context.evaluateExpression(`${resolvable}`);

			if (typeof resolvedValue === 'object' && resolvedValue !== null) {
				returnData = returnData.replace(resolvable, JSON.stringify(resolvedValue));
			} else {
				returnData = returnData.replace(resolvable, resolvedValue as string);
			}
		}
	}
	return returnData;
}

export function addFormResponseDataToReturnItem(
	returnItem: INodeExecutionData,
	formFields: FormFieldsParameter,
	bodyData: IDataObject,
) {
	for (const [index, field] of formFields.entries()) {
		const key = `field-${index}`;
		const name = field.fieldLabel ?? field.fieldName;
		let value = bodyData[key] ?? null;

		if (value === null) {
			returnItem.json[name] = null;
			continue;
		}

		if (field.fieldType === 'html') {
			if (field.elementName) {
				returnItem.json[field.elementName] = value;
			}
			continue;
		}

		if (field.fieldType === 'number') {
			value = Number(value);
		}
		if (field.fieldType === 'text') {
			value = String(value).trim();
		}
		if (field.multiselect && typeof value === 'string') {
			value = jsonParse(value);
		}
		if (field.fieldType === 'date' && value && field.formatDate !== '') {
			value = DateTime.fromFormat(String(value), 'yyyy-mm-dd').toFormat(field.formatDate as string);
		}
		if (field.fieldType === 'file' && field.multipleFiles && !Array.isArray(value)) {
			value = [value];
		}

		returnItem.json[name] = value;
	}
}

export async function prepareFormReturnItem(
	context: IWebhookFunctions,
	formFields: FormFieldsParameter,
	mode: 'test' | 'production',
	useWorkflowTimezone: boolean = false,
) {
	const bodyData = (context.getBodyData().data as IDataObject) ?? {};
	const files = (context.getBodyData().files as IDataObject) ?? {};

	const returnItem: INodeExecutionData = {
		json: {},
	};
	if (files && Object.keys(files).length) {
		returnItem.binary = {};
	}

	for (const key of Object.keys(files)) {
		const processFiles: MultiPartFormData.File[] = [];
		let multiFile = false;
		const filesInput = files[key] as MultiPartFormData.File[] | MultiPartFormData.File;

		if (Array.isArray(filesInput)) {
			bodyData[key] = filesInput.map((file) => ({
				filename: file.originalFilename,
				mimetype: file.mimetype,
				size: file.size,
			}));
			processFiles.push(...filesInput);
			multiFile = true;
		} else {
			bodyData[key] = {
				filename: filesInput.originalFilename,
				mimetype: filesInput.mimetype,
				size: filesInput.size,
			};
			processFiles.push(filesInput);
		}

		const entryIndex = Number(key.replace(/field-/g, ''));
		const fieldLabel = isNaN(entryIndex) ? key : formFields[entryIndex].fieldLabel;

		let fileCount = 0;
		for (const file of processFiles) {
			let binaryPropertyName = fieldLabel.replace(/\W/g, '_');

			if (multiFile) {
				binaryPropertyName += `_${fileCount++}`;
			}

			returnItem.binary![binaryPropertyName] = await context.nodeHelpers.copyBinaryFile(
				file.filepath,
				file.originalFilename ?? file.newFilename,
				file.mimetype,
			);
		}
	}

	addFormResponseDataToReturnItem(returnItem, formFields, bodyData);

	const timezone = useWorkflowTimezone ? context.getTimezone() : 'UTC';
	returnItem.json.submittedAt = DateTime.now().setZone(timezone).toISO();

	returnItem.json.formMode = mode;

	if (
		context.getNode().type === FORM_TRIGGER_NODE_TYPE &&
		Object.keys(context.getRequestObject().query || {}).length
	) {
		returnItem.json.formQueryParameters = context.getRequestObject().query;
	}

	return returnItem;
}

/**
 * Escape HTML
 *
 * @param {string} text The text to escape
 */
export function escapeHtml(text: string): string {
	if (!text) return '';
	return text.replace(/&amp;|&lt;|&gt;|&#39;|&quot;/g, (match) => {
		switch (match) {
			case '&amp;':
				return '&';
			case '&lt;':
				return '<';
			case '&gt;':
				return '>';
			case '&#39;':
				return "'";
			case '&quot;':
				return '"';
			default:
				return match;
		}
	});
}

// Send and Wait Config -----------------------------------------------------------
export function getSendAndWaitConfig(context: IExecuteFunctions): SendAndWaitConfig {
	const message = escapeHtml((context.getNodeParameter('message', 0, '') as string).trim())
		.replace(/\\n/g, '\n')
		.replace(/<br>/g, '\n');
	const subject = escapeHtml(context.getNodeParameter('subject', 0, '') as string);
	const approvalOptions = context.getNodeParameter('approvalOptions.values', 0, {}) as {
		approvalType?: 'single' | 'double';
		approveLabel?: string;
		buttonApprovalStyle?: string;
		disapproveLabel?: string;
		buttonDisapprovalStyle?: string;
	};

	const options = context.getNodeParameter('options', 0, {});

	const config: SendAndWaitConfig = {
		title: subject,
		message,
		options: [],
		appendAttribution: options?.appendAttribution as boolean,
	};

	const responseType = context.getNodeParameter('responseType', 0, 'approval') as string;

	context.setSignatureValidationRequired();
	const approvedSignedResumeUrl = context.getSignedResumeUrl({ approved: 'true' });

	if (responseType === 'freeText' || responseType === 'customForm') {
		const label = context.getNodeParameter('options.messageButtonLabel', 0, 'Respond') as string;
		config.options.push({
			label,
			url: approvedSignedResumeUrl,
			style: 'primary_filled',
		});
	} else if (approvalOptions.approvalType === 'double') {
		const approveLabel = escapeHtml(approvalOptions.approveLabel || 'Approve');
		const buttonApprovalStyle = approvalOptions.buttonApprovalStyle || 'primary_filled';
		const disapproveLabel = escapeHtml(approvalOptions.disapproveLabel || 'Disapprove');
		const buttonDisapprovalStyle = approvalOptions.buttonDisapprovalStyle || 'danger_filled';
		// @ts-ignore
		const disapprovedSignedResumeUrl = context.getSignedResumeUrl({ approved: 'false' });

		config.options.push({
			label: approveLabel,
			url: approvedSignedResumeUrl,
			style: buttonApprovalStyle,
		});

		config.options.push({
			label: disapproveLabel,
			url: disapprovedSignedResumeUrl,
			style: buttonDisapprovalStyle,
		});
	} else {
		const label = escapeHtml(approvalOptions.approveLabel || 'Approve');
		const style = approvalOptions.buttonApprovalStyle || 'primary_filled';
		config.options.push({
			label,
			url: approvedSignedResumeUrl,
			style,
		});
	}

	return config;
}

function createButtonElements(options: { label: string; url: string; style: string }[]) {
	return options.map((option) => {
		return {
			tag: 'button',
			text: {
				tag: 'plain_text',
				content: option.label,
				i18n_content: {
					en_us: option.label,
				},
			},
			type: option.style,
			width: 'default',
			size: 'medium',
			behaviors: [
				{
					type: 'open_url',
					default_url: option.url,
				},
			],
		};
	});
}

export function createSendAndWaitMessageBody(context: IExecuteFunctions) {
	const config = getSendAndWaitConfig(context);
	const subject = config.title;
	const message = config.message;

	const content = {
		schema: '2.0',
		config: {
			locales: ['en_us'],
			style: {
				text_size: {
					normal_v2: {
						default: 'normal',
						pc: 'normal',
						mobile: 'heading',
					},
				},
			},
		},
		body: {
			direction: 'vertical',
			padding: '12px 12px 12px 12px',
			elements: [
				{
					tag: 'markdown',
					content: message,
					i18n_content: {
						en_us: message,
					},
					text_align: 'left',
					text_size: 'normal_v2',
					margin: '0px 0px 0px 0px',
				},
				{
					tag: 'hr',
					margin: '0px 0px 0px 0px',
				},
				{
					tag: 'column_set',
					horizontal_align: 'left',
					columns: [
						{
							tag: 'column',
							width: 'weighted',
							elements: createButtonElements(config.options),
							direction: 'horizontal',
							vertical_spacing: '8px',
							horizontal_align: 'left',
							vertical_align: 'top',
							weight: 1,
						},
					],
					margin: '0px 0px 0px 0px',
				},
			],
		},
		header: {
			title: {
				tag: 'plain_text',
				content: `${subject}`,
				i18n_content: {
					en_us: `${subject}`,
				},
			},
			template: 'blue',
			icon: {
				tag: 'standard_icon',
				token: 'approval_colorful',
			},
			padding: '12px 12px 12px 12px',
		},
	};

	return JSON.stringify(content);
}

export function configureWaitTillDate(context: IExecuteFunctions) {
	let waitTill = WAIT_INDEFINITELY;

	const limitOptions: IDataObject = context.getNodeParameter(
		'options.limitWaitTime.values',
		0,
		{},
	) as {
		limitType?: string;
		resumeAmount?: number;
		resumeUnit?: string;
		maxDateAndTime?: string;
	};

	if (Object.keys(limitOptions).length) {
		try {
			if (limitOptions.limitType === 'afterTimeInterval') {
				let waitAmount = limitOptions.resumeAmount as number;

				if (limitOptions.resumeUnit === 'minutes') {
					waitAmount *= 60;
				}
				if (limitOptions.resumeUnit === 'hours') {
					waitAmount *= 60 * 60;
				}
				if (limitOptions.resumeUnit === 'days') {
					waitAmount *= 60 * 60 * 24;
				}

				waitAmount *= 1000;
				waitTill = new Date(new Date().getTime() + waitAmount);
			} else {
				waitTill = new Date(limitOptions.maxDateAndTime as string);
			}

			if (isNaN(waitTill.getTime())) {
				throw new ApplicationError('Invalid date format');
			}
		} catch (error) {
			throw new NodeOperationError(context.getNode(), 'Could not configure Limit Wait Time', {
				description: error.message,
			});
		}
	}

	return waitTill;
}

export async function sendAndWaitWebhook(this: IWebhookFunctions) {
	const method = this.getRequestObject().method;
	const res = this.getResponseObject();
	const req = this.getRequestObject();

	const responseType = this.getNodeParameter('responseType', 'approval') as
		| 'approval'
		| 'freeText'
		| 'customForm';

	if (responseType === 'approval' && isbot(req.headers['user-agent'])) {
		res.send('');
		return { noWebhookResponse: true };
	}

	if (responseType === 'freeText') {
		if (method === 'GET') {
			const { formTitle, formDescription, buttonLabel, customCss } =
				getFormResponseCustomizations(this);

			const data = prepareFormData({
				formTitle,
				formDescription,
				formSubmittedHeader: 'Got it, thanks',
				formSubmittedText: 'This page can be closed now',
				buttonLabel,
				redirectUrl: undefined,
				formFields: [
					{
						fieldLabel: 'Response',
						fieldType: 'textarea',
						requiredField: true,
					},
				],
				testRun: false,
				query: {},
				customCss,
			});

			res.render('form-trigger', data);

			return {
				noWebhookResponse: true,
			};
		}
		if (method === 'POST') {
			const data = this.getBodyData().data as IDataObject;

			return {
				webhookResponse: ACTION_RECORDED_PAGE,
				workflowData: [[{ json: { data: { text: data[INPUT_FIELD_IDENTIFIER] } } }]],
			};
		}
	}

	if (responseType === 'customForm') {
		const defineForm = this.getNodeParameter('defineForm', 'fields') as 'fields' | 'json';
		let fields: FormFieldsParameter = [];

		if (defineForm === 'json') {
			try {
				const jsonOutput = this.getNodeParameter('jsonOutput', '', {
					rawExpressions: true,
				}) as string;

				fields = tryToParseJsonToFormFields(resolveRawData(this, jsonOutput));
			} catch (error) {
				throw new NodeOperationError(this.getNode(), error.message, {
					description: error.message,
				});
			}
		} else {
			fields = this.getNodeParameter('formFields.values', []) as FormFieldsParameter;
		}

		if (method === 'GET') {
			const { formTitle, formDescription, buttonLabel, customCss } =
				getFormResponseCustomizations(this);

			const data = prepareFormData({
				formTitle,
				formDescription,
				formSubmittedHeader: 'Got it, thanks',
				formSubmittedText: 'This page can be closed now',
				buttonLabel,
				redirectUrl: undefined,
				formFields: fields,
				testRun: false,
				query: {},
				customCss,
			});

			res.render('form-trigger', data);

			return {
				noWebhookResponse: true,
			};
		}
		if (method === 'POST') {
			const returnItem = await prepareFormReturnItem(this, fields, 'production', true);
			const json = returnItem.json;

			delete json.submittedAt;
			delete json.formMode;

			returnItem.json = { data: json };

			return {
				webhookResponse: ACTION_RECORDED_PAGE,
				workflowData: [[returnItem]],
			};
		}
	}

	const query = req.query as { approved: 'false' | 'true' };
	const approved = query.approved === 'true';
	return {
		webhookResponse: ACTION_RECORDED_PAGE,
		workflowData: [[{ json: { data: { approved } } }]],
	};
}
