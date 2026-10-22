import { describe, expect, it } from 'vitest';
import { indexFoods, matchRecipe } from '../../src/match/match';
import type { FoodNote } from '../../src/note';
import { readFoodItem } from '../../src/pantry/food-item';
import type { Meal } from '../../src/plan/types';
import { readRecipe } from '../../src/recipemd/parse';
import { calculatedList, mealNeeds } from '../../src/shop/calculated-list';

const OMELETTE = `# Spinach omelette

*breakfast, vegetarian, fast*

**1 serving**

---

- *3* eggs
- *50 g* spinach
- *30 g* cheddar cheese, grated
- *1 tbsp* butter
- salt
- black pepper
`;

const HEADER = '| Place | Left | Size | Use by |\n| ----- | ---- | ---- | ------ |';

const food = (name: string, rows: string[]): FoodNote => ({
	path: `Larder/Pantry/${name}.md`,
	item: readFoodItem(name, {}, [HEADER, ...rows].join('\n'))
});

const EGGS = food('Eggs', ['| Fridge | 4 | 12 | 2026-10-25 |', '| Fridge | 12 | 12 | 2026-11-16 |']);
const OPEN_CARTON = food('Eggs', ['| Fridge | 4 | 12 | 2026-10-25 |']);
const NO_EGGS = food('Eggs', []);
const SPINACH = food('Spinach', ['| Fridge | 1/2 | 284 g | 2026-10-21 |']);

function omelette(pantry: FoodNote[], cooked = false): Meal {
	const result = readRecipe(OMELETTE);
	if (!result.ok) throw new Error(result.reason);
	const match = matchRecipe(result.recipe, indexFoods(pantry), '2026-10-20', 5);
	const path = 'Recipes/Spinach omelette.md';
	return {
		path,
		cooked,
		day: null,
		prepDone: false,
		sides: [],
		entry: { path, recipe: result.recipe, rating: null, match, prep: null, photo: null }
	};
}

function listOf(meals: Meal[], today = '2026-10-20') {
	return calculatedList(mealNeeds(meals, 'Larder/Pantry'), today);
}

const rowOf = (rows: { name: string; amount: string }[], name: string) =>
	rows.find((row) => row.name === name);

describe('the rows of the shopping list', () => {
	it('the planned spinach omelette gives no row of the eggs and no row of the spinach, because the pantry has them', () => {
		const { missing } = listOf([omelette([EGGS, SPINACH])]);
		expect(rowOf(missing, 'Eggs')).toBeUndefined();
		expect(rowOf(missing, 'Spinach')).toBeUndefined();
	});

	it('the planned spinach omelette with no eggs in the pantry gives a row of the eggs with 3', () => {
		const { missing } = listOf([omelette([NO_EGGS, SPINACH])]);
		expect(rowOf(missing, 'Eggs')?.amount).toBe('3');
	});

	it('the spinach omelette planned two times with 4 eggs gives one row of the eggs with 2', () => {
		const meal = omelette([OPEN_CARTON, SPINACH]);
		const { missing } = listOf([meal, meal]);
		expect(missing.filter((row) => row.name === 'Eggs').map((row) => row.amount)).toEqual(['2']);
	});

	it('the beef tacos with the side spinach omelette and no eggs in the pantry give a row of the eggs with 3, for the beef tacos', () => {
		const side = omelette([NO_EGGS, SPINACH]);
		const tacos: Meal = {
			...side,
			path: 'Recipes/Beef tacos.md',
			entry: null,
			sides: [{ path: side.path, name: 'Spinach omelette', entry: side.entry }]
		};
		const { missing } = listOf([tacos]);
		expect(rowOf(missing, 'Eggs')?.amount).toBe('3');
		expect(missing.find((row) => row.name === 'Eggs')?.recipes).toEqual(['Beef tacos']);
	});

	it('the cooked spinach omelette with no eggs in the pantry gives no row of the eggs', () => {
		const { missing } = listOf([omelette([NO_EGGS, SPINACH], true)]);
		expect(rowOf(missing, 'Eggs')).toBeUndefined();
	});
});

describe('the food of the meals that is past its date', () => {
	it('the spinach of 2026-10-21 is past its date on 2026-10-22', () => {
		const { past } = listOf([omelette([EGGS, SPINACH])], '2026-10-22');
		expect(past.map((row) => row.name)).toContain('Spinach');
	});

	it('the spinach of 2026-10-21 is not past its date on 2026-10-21', () => {
		const { past } = listOf([omelette([EGGS, SPINACH])], '2026-10-21');
		expect(past.map((row) => row.name)).not.toContain('Spinach');
	});

	it('the spinach of the cooked spinach omelette is not past its date on 2026-10-22', () => {
		const { past } = listOf([omelette([EGGS, SPINACH], true)], '2026-10-22');
		expect(past.map((row) => row.name)).not.toContain('Spinach');
	});
});
