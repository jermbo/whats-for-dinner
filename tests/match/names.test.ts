import { describe, expect, it } from 'vitest';
import { foodNameOf, nameKey } from '../../src/match/names';

describe('the name of the food of an ingredient', () => {
	it('"Chicken thighs" is the same name as "chicken thigh"', () => {
		expect(nameKey('Chicken thighs')).toBe(nameKey('chicken thigh'));
	});

	it('the name of "cheddar cheese, grated" stops at the comma: "cheddar cheese"', () => {
		expect(foodNameOf('cheddar cheese, grated')).toBe('cheddar cheese');
	});

	it('the name of "onion (diced)" stops at the parenthesis: "onion"', () => {
		expect(foodNameOf('onion (diced)')).toBe('onion');
	});

	it('the name of `[[Larder/Pantry/Rice|rice]], cooked` is the name of its note: "Rice"', () => {
		expect(foodNameOf('[[Larder/Pantry/Rice|rice]], cooked')).toBe('Rice');
	});
});
