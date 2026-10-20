import { describe, expect, it } from 'vitest';
import { readLine } from '../../src/intake/line';

describe('one ingredient line of intake', () => {
	it('"30 g cheddar cheese, grated" is 30 g of "cheddar cheese", and ", grated" stays with the line', () => {
		expect(readLine('30 g cheddar cheese, grated')).toMatchObject({
			amount: { factor: 30, unit: 'g' },
			name: 'cheddar cheese',
			extra: ', grated'
		});
	});

	it('"salt" has no amount, and the name "salt"', () => {
		expect(readLine('salt')).toEqual({ amount: null, name: 'salt', extra: '' });
	});
});
