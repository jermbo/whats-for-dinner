import { describe, expect, it } from 'vitest';
import { countMeal, stocksAfterMeal } from '../../src/cook/out-of-pantry';
import { indexFoods, matchRecipe } from '../../src/match/match';
import type { FoodNote } from '../../src/note';
import { readOccasion } from '../../src/occasion/occasion-note';
import { listedDishes, scaleMatches, yourDishes } from '../../src/occasion/occasion-list';
import type { Occasion } from '../../src/occasion/occasions';
import { withFood } from '../../src/pantry/empty-row';
import { readFoodItem } from '../../src/pantry/food-item';
import type { Meal } from '../../src/plan/types';
import { readRecipe } from '../../src/recipemd/parse';
import type { RecipeEntry } from '../../src/recipes/types';
import { calculatedList, mealNeeds } from '../../src/shop/calculated-list';

const CRUMBLE = `# Apple crumble

*dessert, baking, vegetarian*

**6 servings**

---

- *4* apples, sliced
- *1 tbsp* sugar

---

1. Bake it.
`;

const CARROTS_RECIPE = `# Honey glazed carrots

*side, vegetarian, fast*

**4 servings**

---

- *500 g* carrots
- *2 tbsp* honey

---

1. Cook the carrots.
`;

const HEADER = '| Place | Left | Size | Use by |\n| ----- | ---- | ---- | ------ |';
const food = (name: string, rows: string[]): FoodNote => ({
	path: `Larder/Pantry/${name}.md`,
	item: readFoodItem(name, {}, [HEADER, ...rows].join('\n'))
});

const APPLES = food('Apples', ['| Fridge | 2 | 6 | 2026-12-31 |']);
const CARROTS = food('Carrots', ['| Fridge | 1/2 | 900 g | 2026-12-31 |']);
const PANTRY = [APPLES, CARROTS];

function entryOf(text: string, path: string): RecipeEntry {
	const result = readRecipe(text);
	if (!result.ok) throw new Error(result.reason);
	const match = matchRecipe(result.recipe, indexFoods(PANTRY), '2026-10-31', 5);
	return { path, recipe: result.recipe, rating: null, match, prep: null, photo: null };
}

const RECIPES = [
	entryOf(CRUMBLE, 'Recipes/Apple crumble.md'),
	entryOf(CARROTS_RECIPE, 'Recipes/Honey glazed carrots.md')
];

const thanksgiving = (lines: string, date: string | null = '2026-11-26'): Occasion => ({
	path: 'Larder/Occasions/Thanksgiving 2026.md',
	name: 'Thanksgiving 2026',
	date,
	...readOccasion(lines)
});

const MENU = `- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2
- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert
- [ ] Pumpkin pie · dessert · Mum`;

function listOn(today: string, occasion = thanksgiving(MENU), meals: Meal[] = []) {
	const dishes = listedDishes([occasion], RECIPES, today);
	return calculatedList(mealNeeds(meals, 'Larder/Pantry', dishes), today).missing;
}

const rowOf = (rows: { name: string; amount: string; recipes: string[] }[], name: string) =>
	rows.find((row) => row.name === name);

describe('what Thanksgiving 2026 puts on the list', () => {
	it('on 2026-11-18, nothing', () => {
		expect(listOn('2026-11-18')).toEqual([]);
	});

	it('on 2026-11-19, the apples and the carrots, with the reason "Thanksgiving 2026"', () => {
		const rows = listOn('2026-11-19');
		expect(rowOf(rows, 'Apples')?.recipes).toEqual(['Thanksgiving 2026']);
		expect(rowOf(rows, 'Carrots')?.recipes).toEqual(['Thanksgiving 2026']);
	});

	it('on 2026-11-27 still, and on 2026-11-28 not', () => {
		expect(rowOf(listOn('2026-11-27'), 'Apples')).toBeDefined();
		expect(listOn('2026-11-28')).toEqual([]);
	});

	it('the crumble needs 4 apples and the pantry has 2, so 2 are missing', () => {
		expect(rowOf(listOn('2026-11-19'), 'Apples')?.amount).toBe('2');
	});

	it('the carrots at ×2 need 1000 g and the pantry has 450 g, so 550 g are missing', () => {
		expect(rowOf(listOn('2026-11-19'), 'Carrots')?.amount).toBe('550 g');
	});

	it('the carrots at ×1 miss 50 g', () => {
		const occasion = thanksgiving('- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side');
		expect(rowOf(listOn('2026-11-19', occasion), 'Carrots')?.amount).toBe('50 g');
	});

	it('the crumble of Mum puts no apples on the list', () => {
		const occasion = thanksgiving('- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · Mum');
		expect(rowOf(listOn('2026-11-19', occasion), 'Apples')).toBeUndefined();
	});

	it('a crumble that is ready puts no apples on the list', () => {
		const occasion = thanksgiving('- [x] [[Recipes/Apple crumble|Apple crumble]] · dessert');
		expect(rowOf(listOn('2026-11-19', occasion), 'Apples')).toBeUndefined();
	});

	it('a note with no date puts nothing on the list', () => {
		expect(listOn('2026-11-19', thanksgiving(MENU, null))).toEqual([]);
	});

	it('the crumble of the week and the crumble of Thanksgiving make one row of 6 apples', () => {
		const path = 'Recipes/Apple crumble.md';
		const entry = RECIPES[0];
		const meal: Meal = { path, cooked: false, day: null, prepDone: false, sides: [], entry };
		const apples = listOn('2026-11-19', thanksgiving(MENU), [meal]).filter((row) => row.name === 'Apples');
		expect(apples.map((row) => row.amount)).toEqual(['6']);
		expect(apples[0].recipes).toEqual(['Apple crumble', 'Thanksgiving 2026']);
	});

	it('your dishes of Thanksgiving are the carrots and the crumble, not the pie', () => {
		expect(yourDishes(thanksgiving(MENU), RECIPES)).toHaveLength(2);
	});
});

describe('the end of Cook Mode for a dish at ×2', () => {
	it('the carrots at ×2 take 1000 g, and the pantry has no carrots after the meal', () => {
		const matches = scaleMatches(RECIPES[1].match.ingredients, 2);
		const { counted } = countMeal(matches, matches.map(() => null));
		const carrots = counted.find((row) => row.name === 'carrots');
		expect(carrots?.need).toEqual({ kind: 'mass', value: 1000 });
		const stocks = stocksAfterMeal(counted, counted.map(() => true));
		expect(withFood(stocks.get(CARROTS.path) ?? [])).toEqual([]);
	});
});
