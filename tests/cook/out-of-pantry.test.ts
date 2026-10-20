import { describe, expect, it } from 'vitest';
import { countMeal, stocksAfterMeal } from '../../src/cook/out-of-pantry';
import { indexFoods, matchRecipe } from '../../src/match/match';
import type { FoodNote } from '../../src/note';
import { isEmpty } from '../../src/pantry/empty-row';
import { readFoodItem } from '../../src/pantry/food-item';
import type { Stock } from '../../src/pantry/types';
import { parseAmount } from '../../src/recipemd/amount';

const HEADER = '| Place | Left | Size | Use by |\n| ----- | ---- | ---- | ------ |';

const food = (name: string, rows: string[]): FoodNote => ({
	path: `Larder/Pantry/${name}.md`,
	item: readFoodItem(name, {}, [HEADER, ...rows].join('\n'))
});

const EGGS = food('Eggs', ['| Fridge | 4 | 12 | 2026-10-25 |', '| Fridge | 12 | 12 | 2026-11-16 |']);
const SPINACH = food('Spinach', ['| Fridge | 1/2 | 284 g | 2026-10-21 |']);
const HALF_JUG = food('Milk', ['| Fridge | 1/2 | 1 gal | 2026-10-29 |']);
const FULL_JUG = food('Milk', ['| Fridge | full | 1 gal | 2026-10-29 |']);
const ONIONS = food('Onions', ['| Kitchen pantry | full | 1 kg | |']);
const WATER = food('Water', ['| Kitchen pantry | tap | | |']);

// A meal of one ingredient, with each of its counted ingredients used.
function endMeal(amount: string, name: string, pantry: FoodNote[]) {
	const recipe = {
		title: 'Test',
		description: null,
		tags: [],
		yields: [],
		ingredients: [{ name, amount: parseAmount(amount), link: null }],
		groups: [],
		instructions: null
	};
	const { ingredients } = matchRecipe(recipe, indexFoods(pantry), '2026-10-20', 5);
	const count = countMeal(ingredients, []);
	return { ...count, stocks: stocksAfterMeal(count.counted, count.counted.map(() => true)) };
}

const rowsOf = (stocks: Map<string, Stock[]>, food: FoodNote) =>
	(stocks.get(food.path) ?? []).map((stock) => [stock.left, stock.sizeText, stock.useBy]);

describe('the packages after a meal', () => {
	it('3 eggs take the open carton to 1 of 12, and the new carton stays at 12 of 12', () => {
		expect(rowsOf(endMeal('3', 'eggs', [EGGS]).stocks, EGGS)).toEqual([
			['1', '12', '2026-10-25'],
			['12', '12', '2026-11-16']
		]);
	});

	it('6 eggs take the open carton out, and the new carton goes to 10 of 12', () => {
		const [open, next] = endMeal('6', 'eggs', [EGGS]).stocks.get(EGGS.path) ?? [];
		expect(isEmpty(open)).toBe(true);
		expect([next.left, next.useBy]).toEqual(['10', '2026-11-16']);
	});

	it('the package with the first use-by date gives first, when no package is open', () => {
		const cartons = food('Eggs', ['| Fridge | 12 | 12 | 2026-11-16 |', '| Fridge | 12 | 12 | 2026-10-25 |']);
		expect(rowsOf(endMeal('3', 'eggs', [cartons]).stocks, cartons)).toEqual([
			['12', '12', '2026-11-16'],
			['9', '12', '2026-10-25']
		]);
	});

	it('a package with no use-by date gives last', () => {
		const cartons = food('Eggs', ['| Fridge | 12 | 12 | |', '| Fridge | 12 | 12 | 2026-11-16 |']);
		expect(rowsOf(endMeal('3', 'eggs', [cartons]).stocks, cartons)).toEqual([
			['12', '12', null],
			['9', '12', '2026-11-16']
		]);
	});

	it('50 g of spinach take the bag at 1/2 of 284 g to 1/4', () => {
		expect(rowsOf(endMeal('50 g', 'spinach', [SPINACH]).stocks, SPINACH)).toEqual([
			['1/4', '284 g', '2026-10-21']
		]);
	});

	it('300 g of spinach take the bag out, so the spinach has no package', () => {
		const [bag] = endMeal('300 g', 'spinach', [SPINACH]).stocks.get(SPINACH.path) ?? [];
		expect(isEmpty(bag)).toBe(true);
	});

	it('1 cup of milk leaves the jug of 1 gal at 1/2', () => {
		expect(rowsOf(endMeal('1 cup', 'milk', [HALF_JUG]).stocks, HALF_JUG)).toEqual([
			['1/2', '1 gal', '2026-10-29']
		]);
	});

	it('1 tbsp of milk takes the full jug of 1 gal to 3/4', () => {
		expect(rowsOf(endMeal('1 tbsp', 'milk', [FULL_JUG]).stocks, FULL_JUG)).toEqual([
			['3/4', '1 gal', '2026-10-29']
		]);
	});
});

describe('the food items to check after a meal', () => {
	it('1 onion against a row of 1 kg makes the onions to check, and the row stays', () => {
		const meal = endMeal('1', 'onion', [ONIONS]);
		expect(meal.check).toEqual([ONIONS.path]);
		expect(meal.stocks.has(ONIONS.path)).toBe(false);
	});

	it('1 l of water against the row "tap" does not make the water to check', () => {
		expect(endMeal('1 l', 'water', [WATER]).check).toEqual([]);
	});
});
