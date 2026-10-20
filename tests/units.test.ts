import { describe, expect, it } from 'vitest';
import type { Amount } from '../src/recipemd/types';
import { compares, measure, showAmount, showMeasure } from '../src/units';

const amount = (factor: number, unit: string | null): Amount => ({ factor, unit, text: '' });

describe('a conversion in one family', () => {
	it('2 kg and 2000 g are 2000 g', () => {
		expect(measure(amount(2, 'kg'))).toEqual({ kind: 'mass', value: 2000 });
		expect(measure(amount(2000, 'g'))).toEqual({ kind: 'mass', value: 2000 });
	});

	it('1 gal and 4 qt compare, and are the same volume', () => {
		const gallon = measure(amount(1, 'gal'));
		const quarts = measure(amount(4, 'qt'));
		expect(compares(gallon.kind, quarts.kind)).toBe(true);
		expect(quarts.value).toBeCloseTo(gallon.value);
	});

	it('"2 Cups" and "2 cup" are the same amount, because a capital letter and a plural are the same unit', () => {
		expect(measure(amount(2, 'Cups'))).toEqual(measure(amount(2, 'cup')));
	});
});

describe('the amounts that do not compare', () => {
	it('2 cans and 1 jar do not compare', () => {
		expect(compares(measure(amount(2, 'cans')).kind, measure(amount(1, 'jar')).kind)).toBe(false);
	});

	it('a carton of 12 eggs and 500 g do not compare', () => {
		expect(compares(measure(amount(12, null)).kind, measure(amount(500, 'g')).kind)).toBe(false);
	});
});

describe('the text that the plugin writes for an amount', () => {
	it('1500 g is "1.5 kg"', () => {
		expect(showMeasure({ kind: 'mass', value: 1500 })).toBe('1.5 kg');
	});

	it('0.375 gal is "3/8 gal", because a gallon shows in eighths', () => {
		expect(showAmount(0.375, 'gal')).toBe('3/8 gal');
	});

	it('0.625 kg is "625 g"', () => {
		expect(showMeasure(measure(amount(0.625, 'kg')))).toBe('625 g');
	});
});
