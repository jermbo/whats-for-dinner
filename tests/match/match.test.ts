import { describe, expect, it } from 'vitest';
import { indexFoods, matchRecipe, type IngredientMatch } from '../../src/match/match';
import type { FoodNote } from '../../src/note';
import { readFoodItem } from '../../src/pantry/food-item';
import { parseAmount } from '../../src/recipemd/amount';
import type { Recipe } from '../../src/recipemd/types';

const HEADER = '| Place | Left | Size | Use by |\n| ----- | ---- | ---- | ------ |';

const food = (name: string, rows: string[], aliases: string[] = []): FoodNote => ({
	path: `Larder/Pantry/${name}.md`,
	item: readFoodItem(name, { aliases }, [HEADER, ...rows].join('\n'))
});

const PANTRY = [
	food('Eggs', ['| Fridge | 4 | 12 | 2026-10-25 |', '| Fridge | 12 | 12 | 2026-11-16 |']),
	food('Spinach', ['| Fridge | 1/2 | 284 g | 2026-10-21 |']),
	food('Rice', ['| Kitchen pantry | 3/4 | 2 kg | |', '| Kitchen pantry | full | 900 g | |'], [
		'white rice'
	]),
	food('Elbow pasta', ['| Kitchen pantry | 1/4 | 454 g | |'], ['pasta', 'macaroni']),
	food('Shell pasta', [], ['pasta']),
	food('Onions', ['| Kitchen pantry | full | 1 kg | |']),
	food('Water', ['| Kitchen pantry | tap | | |']),
	food('Salt', ['| Kitchen pantry | full | 737 g | |'])
];

// One ingredient of a recipe: the amount and the name are two parts in RecipeMD.
function match(amount: string, name: string): IngredientMatch {
	const recipe: Recipe = {
		title: 'Test',
		description: null,
		tags: [],
		yields: [],
		ingredients: [{ name, amount: amount ? parseAmount(amount) : null, link: null }],
		groups: [],
		instructions: null
	};
	return matchRecipe(recipe, indexFoods(PANTRY), '2026-10-20', 5).ingredients[0];
}

describe('the match of an ingredient', () => {
	it('"3 eggs" finds the eggs, and they are in the pantry', () => {
		const eggs = match('3', 'eggs');
		expect([eggs.food?.item.name, eggs.status]).toEqual(['Eggs', 'enough']);
	});

	it('"50 g spinach" is in the pantry', () => {
		expect(match('50 g', 'spinach').status).toBe('enough');
	});

	it('"3 kg rice" is low, because the pantry has 2.4 kg', () => {
		expect(match('3 kg', 'rice').status).toBe('short');
	});

	it('"200 g white rice" finds the rice by its other name', () => {
		expect(match('200 g', 'white rice').food?.item.name).toBe('Rice');
	});

	it('"100 g quinoa" with no note of quinoa is missing', () => {
		const quinoa = match('100 g', 'quinoa');
		expect([quinoa.food, quinoa.status]).toEqual([null, 'missing']);
	});

	it('"pasta" finds the elbow pasta, because the shell pasta has no row', () => {
		expect(match('', 'pasta').food?.item.name).toBe('Elbow pasta');
	});

	it('`[[Larder/Pantry/Rice|rice]], cooked` finds the rice', () => {
		expect(match('200 g', '[[Larder/Pantry/Rice|rice]], cooked').food?.item.name).toBe('Rice');
	});

	it('"1 onion" against a row of 1 kg is in the pantry with "Check"', () => {
		expect(match('1', 'onion').status).toBe('unknown');
	});

	it('"1 l water" against the row "tap" is in the pantry with "Check"', () => {
		expect(match('1 l', 'water').status).toBe('unknown');
	});

	it('"salt" with no amount is in the pantry, because the salt has a row', () => {
		expect(match('', 'salt').status).toBe('enough');
	});
});
