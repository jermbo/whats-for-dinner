import { describe, expect, it } from 'vitest';
import { recipeText, type IntakeDraft } from '../../src/intake/recipe-text';
import { showName } from '../../src/match/names';
import { readRecipe } from '../../src/recipemd/parse';
import type { Recipe } from '../../src/recipemd/types';

const LINES: [string, string][] = [
	['3 eggs', 'Larder/Pantry/Eggs.md'],
	['50 g spinach', 'Larder/Pantry/Spinach.md'],
	['30 g cheddar cheese, grated', 'Larder/Pantry/Cheddar cheese.md'],
	['1 tbsp butter', 'Larder/Pantry/Butter.md'],
	['salt', 'Larder/Pantry/Salt.md'],
	['black pepper', 'Larder/Pantry/Black pepper.md']
];

const STEPS = [
	'Beat the eggs with salt and pepper.',
	'Melt the butter in a small pan with medium heat. Cook the spinach for 1 minute.',
	'Add the eggs. Cook for 2 minutes, and move the edges to the center.',
	'Put the cheese on one half. Fold the omelette and serve.'
];

const OMELETTE: IntakeDraft = {
	title: 'Spinach omelette',
	tags: ['breakfast', 'vegetarian', 'fast'],
	yields: '1 serving',
	source: '',
	sourcePhotos: [],
	description: '',
	ingredients: LINES.map(([text, link]) => ({ is: 'food', text, link, isNew: false, raw: null })),
	steps: STEPS.map((text) => ({ text, photos: [] })),
	after: ''
};

function recipeOf(markdown: string): Recipe {
	const result = readRecipe(markdown);
	if (!result.ok) throw new Error(result.reason);
	return result.recipe;
}

describe('the recipe note that intake saves', () => {
	const recipe = recipeOf(recipeText(OMELETTE));

	it('the spinach omelette reads back with the same title, tags, and yield', () => {
		expect(recipe.title).toBe('Spinach omelette');
		expect(recipe.tags).toEqual(['breakfast', 'vegetarian', 'fast']);
		expect(recipe.yields).toMatchObject([{ factor: 1, unit: 'serving' }]);
	});

	it('the spinach omelette reads back with the same 6 ingredients and amounts', () => {
		expect(
			recipe.ingredients.map(({ name, amount }) => [showName(name), amount?.factor, amount?.unit])
		).toEqual([
			['eggs', 3, null],
			['spinach', 50, 'g'],
			['cheddar cheese, grated', 30, 'g'],
			['butter', 1, 'tbsp'],
			['salt', undefined, undefined],
			['black pepper', undefined, undefined]
		]);
	});

	it('each ingredient of the spinach omelette links to its food item', () => {
		expect(recipe.ingredients[0].name).toBe('[[Larder/Pantry/Eggs|eggs]]');
	});

	it('the spinach omelette reads back with the same 4 steps', () => {
		expect(recipe.instructions).toBe(STEPS.map((step, at) => `${at + 1}. ${step}`).join('\n'));
	});
});
