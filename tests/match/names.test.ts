import { describe, expect, it } from 'vitest';
import { titleInUse } from '../../src/intake/known';
import { foodNameOf, nameKey, showName } from '../../src/match/names';
import type { Recipe } from '../../src/recipemd/types';

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

describe('the name of a recipe as the kitchen shows it', () => {
	it('the title `[[Apple Pie]]` shows "Apple Pie"', () => {
		expect(showName('[[Apple Pie]]')).toBe('Apple Pie');
	});

	it('the title `[[Apple Pie|Grandma\'s pie]]` shows the name after the bar', () => {
		expect(showName("[[Apple Pie|Grandma's pie]]")).toBe("Grandma's pie");
	});

	it('the text outside the link stays: `[[Apple Pie]] (vegan)` shows "Apple Pie (vegan)"', () => {
		expect(showName('[[Apple Pie]] (vegan)')).toBe('Apple Pie (vegan)');
	});
});

describe('a recipe that intake finds by its title', () => {
	const recipes = [{ title: '[[Old Fashioned Lemonade]]' }] as Recipe[];

	it('"Old Fashioned Lemonade" finds the recipe with the title `[[Old Fashioned Lemonade]]`', () => {
		expect(titleInUse('old fashioned lemonade', recipes)).toBe('Old Fashioned Lemonade');
	});
});
