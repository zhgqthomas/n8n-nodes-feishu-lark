import {
	INodePropertyOptions,
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	INodeExecutionData,
} from 'n8n-workflow';

export type ResourceOperation = INodePropertyOptions & {
	options: INodeProperties[];
	call?: (
		this: IExecuteFunctions,
		index: number,
	) => Promise<IDataObject | IDataObject[] | INodeExecutionData[]>;
	// default value = 100
	order?: number;
};

export type ResourceOptions = INodePropertyOptions & {
	// default value = 100
	order?: number;
};

export interface IResource extends INodePropertyOptions {
	operations: ResourceOperation[];
}
