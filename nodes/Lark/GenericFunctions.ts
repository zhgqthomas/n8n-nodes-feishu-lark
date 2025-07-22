import { BINARY_ENCODING, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../help/utils/RequestUtils';
import { FileType } from '../help/type/enums';

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

export async function larkApiRequestFolderList(
	this: IExecuteFunctions,
	body: {
		page_size: number;
		page_token?: string;
		folder_token?: string;
		order_by: 'EditedTime' | 'CreatedTime';
		direction: 'ASC' | 'DESC';
		user_id_type: 'user_id' | 'open_id' | 'union_id';
	},
): Promise<IDataObject> {
	return await RequestUtils.request.call(this, {
		method: 'GET',
		url: `/open-apis/drive/v1/files`,
		qs: {
			page_size: body.page_size,
			page_token: body.page_token,
			folder_token: body.folder_token,
			order_by: body.order_by,
			direction: body.direction,
			user_id_type: body.user_id_type,
		},
	});
}

export async function getFileList(
	this: IExecuteFunctions,
	type: FileType,
	folderToken?: string,
): Promise<IDataObject[]> {
	let hasMore = true;
	let pageToken = '';
	const allFiles: IDataObject[] = [];

	while (hasMore) {
		const response = await larkApiRequestFolderList.call(this, {
			page_size: 100,
			page_token: pageToken,
			folder_token: folderToken,
			order_by: 'EditedTime',
			direction: 'DESC',
			user_id_type: 'open_id',
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
			if (file.type === type) {
				allFiles.push(file);
			}

			if (file.type === FileType.Folder) {
				const results = await getFileList.call(this, type, file.token as string);
				allFiles.push(...results);
			}
		}
	}

	return allFiles;
}
