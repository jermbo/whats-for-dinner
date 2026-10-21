import { describe, expect, it } from 'vitest';
import {
	addMeal,
	addSide,
	changeMeal,
	flagMeal,
	readPlan,
	removeMeal,
	removeSide
} from '../../src/plan/plan-note';

const MEALS = `- [ ] [[Recipes/Banana oat muffins|Banana oat muffins]]
- [ ] [[Recipes/Mashed potatoes|Mashed potatoes]]
- [ ] [[Recipes/Pancakes|Pancakes]]
- [ ] [[Recipes/Spinach omelette|Spinach omelette]]
`;

const PLAN_WITH_TEXT = `# Week of 19 October

Mum comes on Friday.

${MEALS}`;

const PANCAKES = 'Recipes/Pancakes.md';

describe('the meals of the plan note', () => {
	it('the plan has 4 meals, and none is cooked', () => {
		const meals = readPlan(MEALS);
		expect(meals.map((meal) => meal.path)).toEqual([
			'Recipes/Banana oat muffins.md',
			'Recipes/Mashed potatoes.md',
			'Recipes/Pancakes.md',
			'Recipes/Spinach omelette.md'
		]);
		expect(meals.some((meal) => meal.cooked)).toBe(false);
	});

	it('the beef tacos that the plugin adds are the fifth meal', () => {
		const text = addMeal(PLAN_WITH_TEXT, 'Recipes/Beef tacos.md', 'Beef tacos');
		expect(readPlan(text).map((meal) => meal.path)[4]).toBe('Recipes/Beef tacos.md');
	});

	it('the line "Mum comes on Friday." stays the same text when the plugin adds a meal', () => {
		const text = addMeal(PLAN_WITH_TEXT, 'Recipes/Beef tacos.md', 'Beef tacos');
		expect(text).toContain('# Week of 19 October\n\nMum comes on Friday.\n\n- [ ]');
	});

	it('the pancakes that the plugin changes to 2026-10-22 have that date, and keep the link `[[Recipes/Pancakes|Pancakes]]`', () => {
		const text = changeMeal(MEALS, PANCAKES, { day: '2026-10-22' });
		expect(readPlan(text).find((meal) => meal.path === PANCAKES)?.day).toBe('2026-10-22');
		expect(text).toContain('- [ ] [[Recipes/Pancakes|Pancakes]] · 2026-10-22\n');
	});

	it('the plan with the pancakes removed has 3 meals', () => {
		expect(readPlan(removeMeal(MEALS, PANCAKES))).toHaveLength(3);
	});

});

describe('a bad plan note', () => {
	it('the task "- [ ] Soup" with no link is not a meal, and the plan has 4 meals', () => {
		expect(readPlan(`${MEALS}- [ ] Soup\n`)).toHaveLength(4);
	});

	it('a line that is not a task is not a meal, also with a link', () => {
		expect(readPlan(`${MEALS}Try [[Recipes/Beef tacos|Beef tacos]] next week.\n`)).toHaveLength(4);
	});

	it('a task with a link with no name is not a meal', () => {
		expect(readPlan(`${MEALS}- [ ] [[]]\n- [ ] [[|Soup]]\n`)).toHaveLength(4);
	});

	it('the pancakes with the date "Friday" are a meal with no date', () => {
		const text = MEALS.replace('[[Recipes/Pancakes|Pancakes]]', '[[Recipes/Pancakes|Pancakes]] · Friday');
		const pancakes = readPlan(text).find((meal) => meal.path === PANCAKES);
		expect(pancakes).toMatchObject({ day: null, cooked: false });
	});
});

const TACOS = 'Recipes/Beef tacos.md';
const CARROTS = 'Recipes/Honey glazed carrots.md';

const WITH_SIDES = `${MEALS}- [ ] [[Recipes/Beef tacos|Beef tacos]] · 2026-10-24
	- [[Recipes/Honey glazed carrots|Honey glazed carrots]]
	- Salad

Mum comes on Friday.
`;

describe('the sides of a meal', () => {
	it('the beef tacos have 2 sides: the recipe Honey glazed carrots, and "Salad" with no recipe', () => {
		const tacos = readPlan(WITH_SIDES).find((meal) => meal.path === TACOS);
		expect(tacos?.sides).toEqual([
			{ path: CARROTS, name: 'Honey glazed carrots' },
			{ path: null, name: 'Salad' }
		]);
	});

	it('the pancakes have no side', () => {
		expect(readPlan(WITH_SIDES).find((meal) => meal.path === PANCAKES)?.sides).toEqual([]);
	});

	it('an indented task below a meal is not a side', () => {
		const text = MEALS.replace('[[Recipes/Pancakes|Pancakes]]\n', '[[Recipes/Pancakes|Pancakes]]\n\t- [ ] Buy candles\n');
		expect(readPlan(text).find((meal) => meal.path === PANCAKES)?.sides).toEqual([]);
	});

	it('the side "Rice" that the plugin adds to the beef tacos comes after "Salad"', () => {
		const text = addSide(WITH_SIDES, TACOS, { path: null, name: 'Rice' });
		expect(text).toContain('\t- Salad\n\t- Rice\n');
	});

	it('the side Honey glazed carrots that the plugin adds to the pancakes is a link below the pancakes', () => {
		const text = addSide(MEALS, PANCAKES, { path: CARROTS, name: 'Honey glazed carrots' });
		expect(text).toContain(
			'- [ ] [[Recipes/Pancakes|Pancakes]]\n\t- [[Recipes/Honey glazed carrots|Honey glazed carrots]]\n- [ ]'
		);
	});

	it('the beef tacos with the first side removed have only "Salad", and the task does not change', () => {
		const text = removeSide(WITH_SIDES, TACOS, 0);
		expect(readPlan(text).find((meal) => meal.path === TACOS)?.sides).toEqual([
			{ path: null, name: 'Salad' }
		]);
		expect(text).toContain('- [ ] [[Recipes/Beef tacos|Beef tacos]] · 2026-10-24\n\t- Salad\n');
	});

	it('the beef tacos removed take their 2 sides out, and the line "Mum comes on Friday." stays', () => {
		const text = removeMeal(WITH_SIDES, TACOS);
		expect(text).not.toContain('Honey glazed carrots');
		expect(text).not.toContain('Salad');
		expect(text).toContain('Mum comes on Friday.');
	});

	it('the meal that the plugin adds after the beef tacos comes after their sides', () => {
		const text = addMeal(WITH_SIDES, 'Recipes/Thai green curry.md', 'Thai green curry');
		expect(text).toContain('\t- Salad\n- [ ] [[Recipes/Thai green curry|Thai green curry]]\n');
	});

	it('the beef tacos changed to "prep done" keep their 2 sides', () => {
		const text = changeMeal(WITH_SIDES, TACOS, { prepDone: true });
		expect(readPlan(text).find((meal) => meal.path === TACOS)?.sides).toHaveLength(2);
	});
});

describe('a meal that left the plan', () => {
	it('the pancakes with a mark are a meal that you cooked', () => {
		const text = MEALS.replace('- [ ] [[Recipes/Pancakes', '- [x] [[Recipes/Pancakes');
		expect(readPlan(text).find((meal) => meal.path === PANCAKES)?.cooked).toBe(true);
	});
});

describe('the flag for tonight', () => {
	it('the pancakes flagged on 2026-10-21 have that date', () => {
		const text = flagMeal(MEALS, PANCAKES, '2026-10-21');
		expect(text).toContain('- [ ] [[Recipes/Pancakes|Pancakes]] · 2026-10-21\n');
	});

	it('the omelette flagged on the same day takes the flag of the pancakes', () => {
		const OMELETTE = 'Recipes/Spinach omelette.md';
		const text = flagMeal(flagMeal(MEALS, PANCAKES, '2026-10-21'), OMELETTE, '2026-10-21');
		const meals = readPlan(text);
		expect(meals.find((meal) => meal.path === PANCAKES)?.day).toBeNull();
		expect(meals.find((meal) => meal.path === OMELETTE)?.day).toBe('2026-10-21');
	});

	it('the date 2026-10-20 of the muffins stays when the pancakes get the flag of 2026-10-21', () => {
		const MUFFINS = 'Recipes/Banana oat muffins.md';
		const text = flagMeal(changeMeal(MEALS, MUFFINS, { day: '2026-10-20' }), PANCAKES, '2026-10-21');
		expect(readPlan(text).find((meal) => meal.path === MUFFINS)?.day).toBe('2026-10-20');
	});

	it('the beef tacos flagged keep their 2 sides', () => {
		const text = flagMeal(WITH_SIDES, TACOS, '2026-10-21');
		expect(readPlan(text).find((meal) => meal.path === TACOS)?.sides).toHaveLength(2);
	});
});
