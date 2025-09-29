import {
	assertParamIsArray,
	IDataObject,
	IExecuteFunctions,
	jsonParse,
	NodeOperationError,
} from 'n8n-workflow';

class NodeUtils {
	static getNodeFixedCollection(data: IDataObject, collectionName: string): IDataObject[] {
		return (data[collectionName] as IDataObject[]) || [];
	}

	static getNodeFixedCollectionList(
		data: IDataObject,
		collectionName: string,
		propertyName: string,
	): any[] {
		const list = this.getNodeFixedCollection(data, collectionName);

		const result: IDataObject[] = [];
		for (const item of list) {
			// @ts-ignore
			result.push(item[propertyName]);
		}

		return result;
	}

	static async buildUploadFileData(
		this: IExecuteFunctions,
		inputDataFieldName: string,
		index: number = 0,
	) {
		const binaryData = this.helpers.assertBinaryData(index, inputDataFieldName);
		if (!binaryData) {
			throw new Error('未找到二进制数据');
		}
		const buffer = await this.helpers.getBinaryDataBuffer(index, inputDataFieldName);

		return {
			value: buffer,
			options: {
				filename: binaryData.fileName,
				filelength: binaryData.fileSize,
				contentType: binaryData.mimeType,
			},
		};
	}

	static getNodeJsonData(
		data: IExecuteFunctions,
		propertyName: string,
		index: number,
		failValue?: any,
	): any {
		const text = data.getNodeParameter(propertyName, index, failValue);
		if (!text) {
			return failValue;
		}
		try {
			return JSON.parse(text as string);
		} catch (e) {
			throw new NodeOperationError(
				data.getNode(),
				`Can't parse [${propertyName}] JSON data: ${e.message}`,
			);
		}
	}

	static getObjectData(
		context: IExecuteFunctions,
		index: number,
		failValue?: any,
	): IDataObject | any {
		const dataObject = context.getNodeParameter('body', index, failValue);
		return typeof dataObject === 'string' ? jsonParse<IDataObject>(dataObject) : dataObject;
	}

	static getArrayData<T>(
		context: IExecuteFunctions,
		propertyName: string,
		index: number,
		validator: (val: unknown) => val is T,
		failValue?: any,
	): T[] {
		const arrayJson = context.getNodeParameter(propertyName, index, failValue) as T[];
		const parsedArrayObject: T[] = typeof arrayJson === 'string' ? jsonParse(arrayJson) : arrayJson;

		assertParamIsArray<T>(propertyName, parsedArrayObject, validator, context.getNode());

		if (parsedArrayObject.length === 0) {
			throw new NodeOperationError(context.getNode(), `The ${propertyName} can not be empty`);
		}

		return parsedArrayObject;
	}
}

export default NodeUtils;
