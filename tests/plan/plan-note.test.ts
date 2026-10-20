import { describe, expect, it } from 'vitest';
import { addMeal, changeMeal, readPlan, removeMeal, removeMeals } from '../../src/plan/plan-note';

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

	it('a new week has no meal, and the line "Mum comes on Friday." stays the same text', () => {
		const text = removeMeals(PLAN_WITH_TEXT);
		expect(readPlan(text)).toEqual([]);
		expect(text).toContain('Mum comes on Friday.');
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
