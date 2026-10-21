import { describe, expect, it } from 'vitest';
import type { IngredientMatch, Status } from '../../src/match/match';
import { toGetFirst } from '../../src/recipes/to-get';

// The ingredients of Chicken noodle soup, with the state of each in the pantry of the test vault.
const soup: [string, Status][] = [
	['chicken thighs', 'enough'],
	['chicken broth', 'short'],
	['carrots', 'unknown'],
	['onion', 'enough'],
	['celery', 'missing'],
	['elbow pasta', 'missing'],
	['olive oil', 'enough']
];

const matches = (rows: [string, Status][]): IngredientMatch[] =>
	rows.map(([name, status]) => ({
		ingredient: { name, amount: null, link: null },
		candidates: [],
		food: null,
		status,
		need: null
	}));

const names = (rows: IngredientMatch[]) => rows.map((one) => one.ingredient.name);

describe('what you must get first', () => {
	it('none comes first, then low, then check, each in the sequence of the recipe', () => {
		expect(names(toGetFirst(matches(soup)))).toEqual([
			'celery',
			'elbow pasta',
			'chicken broth',
			'carrots'
		]);
	});

	it('a recipe with each ingredient in the pantry has nothing to get', () => {
		expect(toGetFirst(matches([['salt', 'enough']]))).toEqual([]);
	});
});
