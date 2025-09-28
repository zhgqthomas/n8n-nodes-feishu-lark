import { IDataObject } from 'n8n-workflow';

export const isString = (val: unknown): val is string => typeof val === 'string';

export const isNumber = (val: unknown): val is number => typeof val === 'number';

export const isObject = (val: unknown): val is IDataObject => typeof val === 'object';

export const isArray = (val: unknown): val is unknown[] => Array.isArray(val);

export function isStringArray(input: unknown): input is string[] {
	return Array.isArray(input) && input.every((item) => typeof item === 'string');
}
