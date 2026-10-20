import { describe, expect, it } from 'vitest';
import { parseAmount } from '../../src/recipemd/amount';

describe('the number of an amount', () => {
	it('"1 1/2 cups" is 1.5 cups', () => {
		expect(parseAmount('1 1/2 cups')).toMatchObject({ factor: 1.5, unit: 'cups' });
	});

	it('"½ tsp" is 0.5 tsp', () => {
		expect(parseAmount('½ tsp')).toMatchObject({ factor: 0.5, unit: 'tsp' });
	});

	it('"1,5 kg" is 1.5, because a comma is a decimal mark', () => {
		expect(parseAmount('1,5 kg')?.factor).toBe(1.5);
	});

	it('"1,000 g" is 1, because a comma is not a thousands mark', () => {
		expect(parseAmount('1,000 g')?.factor).toBe(1);
	});

	it('"6" is 6 with no unit', () => {
		expect(parseAmount('6')).toMatchObject({ factor: 6, unit: null });
	});

	it('"a pinch" has no number, so it is no amount', () => {
		expect(parseAmount('a pinch')).toBeNull();
	});
});
