import {
	BINARY_ENCODING,
	IDataObject,
	IExecuteFunctions,
	INode,
	jsonParse,
	NodeOperationError,
} from 'n8n-workflow';
import RequestUtils from '../help/utils/RequestUtils';
import { FileType } from '../help/type/enums';

export async function larkApiRequestSheetList(
	this: IExecuteFunctions,
	spreadsheetId: string,
): Promise<IDataObject[]> {
	const {
		data: { sheets },
	} = await RequestUtils.request.call(this, {
		method: 'GET',
		url: `/open-apis/sheets/v3/spreadsheets/${spreadsheetId}/sheets/query`,
	});

	return sheets;
}

export async function larkApiRequestCalendarEventList(
	this: IExecuteFunctions,
	options: IDataObject,
): Promise<IDataObject[]> {
	const { calendarId, query, user_id_type } = options;

	const allEvents: IDataObject[] = [];
	let hasMore = false;
	let pageToken = '';

	do {
		const {
			data: { page_token, items },
		} = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/open-apis/calendar/v4/calendars/${calendarId}/events/search`,
			qs: {
				user_id_type,
				...(pageToken && { page_token: pageToken }),
				page_size: 100,
			},
			body: {
				query,
			},
		});

		hasMore = page_token ? true : false;
		pageToken = page_token;
		if (items) {
			allEvents.push(...items);
		}
	} while (hasMore);

	return allEvents;
}

export async function larkApiRequestCalendarList(this: IExecuteFunctions): Promise<IDataObject[]> {
	const allCalendars: IDataObject[] = [];
	let hasMore = false;
	let pageToken = '';

	do {
		const {
			data: { has_more, page_token, calendar_list },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/calendar/v4/calendars`,
			qs: {
				...(pageToken && { page_token: pageToken }),
				page_size: 1000,
			},
		});

		hasMore = has_more;
		pageToken = page_token;
		if (calendar_list) {
			allCalendars.push(...calendar_list);
		}
	} while (hasMore);

	return allCalendars;
}

export async function larkApiRequestBaseRoleList(
	this: IExecuteFunctions,
	options: IDataObject,
): Promise<IDataObject[]> {
	const allRoles: IDataObject[] = [];
	let hasMore = false;
	let pageToken = '';
	const { app_token } = options;

	do {
		const {
			data: { has_more, page_token, items },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/base/v2/apps/${app_token}/roles`,
			qs: {
				...(pageToken && { page_token: pageToken }),
				page_size: 100,
			},
		});

		hasMore = has_more;
		pageToken = page_token;
		if (items) {
			allRoles.push(...items);
		}
	} while (hasMore);

	return allRoles;
}

export async function larkApiRequestTableFieldList(
	this: IExecuteFunctions,
	options: IDataObject,
): Promise<IDataObject[]> {
	const allFields: IDataObject[] = [];
	let hasMore = false;
	let pageToken = '';
	const { app_token, table_id } = options;

	do {
		const {
			data: { has_more, page_token, items },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/fields`,
			qs: {
				page_token: pageToken,
				page_size: 100,
			},
		});

		hasMore = has_more;
		pageToken = page_token;
		if (items) {
			allFields.push(...items);
		}
	} while (hasMore);

	return allFields;
}

export async function larkApiRequestTableViewList(
	this: IExecuteFunctions,
	options: IDataObject,
): Promise<IDataObject[]> {
	const allViews: IDataObject[] = [];
	let hasMore = false;
	let pageToken = '';
	const { app_token, table_id, user_id_type } = options;
	do {
		const {
			data: { has_more, page_token, items },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/views`,
			qs: {
				page_token: pageToken,
				page_size: 100,
				user_id_type,
			},
		});

		hasMore = has_more;
		pageToken = page_token;
		if (items) {
			allViews.push(...items);
		}
	} while (hasMore);

	return allViews;
}

export async function larkApiRequestTableList(
	this: IExecuteFunctions,
	appToken: string,
): Promise<IDataObject[]> {
	const allTables: IDataObject[] = [];
	let hasMore = false;
	let pageToken = '';
	do {
		const {
			data: { has_more, page_token, items },
		} = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/bitable/v1/apps/${appToken}/tables`,
			qs: {
				page_token: pageToken,
				page_size: 100,
			},
		});

		hasMore = has_more;
		pageToken = page_token;
		if (items) {
			allTables.push(...items);
		}
	} while (hasMore);

	return allTables;
}

export async function larkApiRequestMessageResourceData(
	this: IExecuteFunctions,
	options: {
		type: string;
		messageId: string;
		key: string;
	},
): Promise<String> {
	const { type, messageId, key } = options;
	const data = await RequestUtils.request.call(this, {
		method: 'GET',
		url: `/open-apis/im/v1/messages/${messageId}/resources/${key}`,
		qs: {
			type,
		},
		encoding: 'arraybuffer',
		json: false,
	});

	return Buffer.from(data).toString(BINARY_ENCODING);
}

export async function getFileList(
	this: IExecuteFunctions,
	type: FileType[],
	order_by: string = 'EditedTime',
	direction: string = 'DESC',
	user_id_type: string = 'open_id',
	folderToken?: string,
): Promise<IDataObject[]> {
	let hasMore = true;
	let pageToken = '';
	const allFiles: IDataObject[] = [];

	while (hasMore) {
		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/open-apis/drive/v1/files`,
			qs: {
				page_size: 100,
				page_token: pageToken,
				folder_token: folderToken,
				order_by,
				direction,
				user_id_type,
			},
		});

		const responseData = response.data as IDataObject & {
			files: IDataObject[];
			has_more: boolean;
			next_page_token: string;
		};

		const { files, has_more, next_page_token: nextPageToken } = responseData;
		hasMore = has_more;
		pageToken = nextPageToken || '';

		for (const file of files) {
			if (type.includes(file.type as FileType)) {
				allFiles.push(file);
			}

			if (file.type === FileType.Folder) {
				const results = await getFileList.call(
					this,
					type,
					order_by,
					direction,
					user_id_type,
					file.token as string,
				);
				allFiles.push(...results);
			}
		}
	}

	return allFiles;
}

export const parseJsonParameter = (
	jsonData: string | IDataObject,
	node: INode,
	i: number,
	entryName?: string,
) => {
	let returnData: IDataObject;
	const location = entryName ? `entry "${entryName}" inside 'Fields to Set'` : "'JSON Output'";

	if (typeof jsonData === 'string') {
		try {
			returnData = jsonParse<IDataObject>(jsonData);
		} catch (error) {
			let recoveredData = '';
			try {
				recoveredData = jsonData
					.replace(/'/g, '"') // Replace single quotes with double quotes
					.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Wrap keys in double quotes
					.replace(/,\s*([\]}])/g, '$1') // Remove trailing commas from objects
					.replace(/,+$/, ''); // Remove trailing comma
				returnData = jsonParse<IDataObject>(recoveredData);
			} catch (err) {
				const description =
					recoveredData === jsonData ? jsonData : `${recoveredData};\n Original input: ${jsonData}`;
				throw new NodeOperationError(node, `The ${location} in item ${i} contains invalid JSON`, {
					description,
				});
			}
		}
	} else {
		returnData = jsonData;
	}

	if (returnData === undefined || typeof returnData !== 'object' || Array.isArray(returnData)) {
		throw new NodeOperationError(
			node,
			`The ${location} in item ${i} does not contain a valid JSON object`,
		);
	}

	return returnData;
};
