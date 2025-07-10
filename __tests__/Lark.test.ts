import { Lark } from '../nodes/Lark/Lark.node';

describe('Lark Node', () => {
	let lark: Lark;

	beforeEach(() => {
		lark = new Lark();
	});

	it('should have the correct node type', () => {
		expect(lark.description.name).toBe('Lark');
	});

	it('should have properties defined', () => {
		expect(lark.description.properties).toBeDefined();
	});
});
