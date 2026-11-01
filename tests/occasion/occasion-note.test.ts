import { describe, expect, it } from 'vitest';
import {
	addDish,
	addGuest,
	addTask,
	changeDish,
	newOccasionText,
	readOccasion,
	removeDish,
	removeGuest,
	setDishReady,
	setGuestSize,
	setTaskDone
} from '../../src/occasion/occasion-note';

const THANKSGIVING = `---
date: 2026-11-26
---
Dinner at 15:00.

- [ ] [[Recipes/Beef tacos|Beef tacos]] · main
- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2
- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert
- [ ] Pumpkin pie · dessert · Mum
- [x] Rolls · bread · Sam

## To do

- [ ] Clean the oven · 2026-11-25
- [ ] Borrow chairs · 2026-11-24
- [ ] Buy candles
`;

const PAST = `---
date: 2025-11-27
---
Dinner at 14:00.

- [x] [[Recipes/Beef tacos|Beef tacos]] · main · prep done
- [x] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2
- [x] Pumpkin pie · dessert · Mum

## To do

- [x] Borrow chairs · 2025-11-25
- [x] Buy candles
`;

const linesOf = (text: string) => text.split('\n');
const lineWith = (text: string, words: string) => linesOf(text).find((line) => line.includes(words));
const dishLines = (text: string) =>
	linesOf(text.slice(0, text.indexOf('## To do') === -1 ? undefined : text.indexOf('## To do'))).filter(
		(line) => line.startsWith('- [')
	);

describe('the dishes and the tasks of an occasion note', () => {
	const { dishes, tasks } = readOccasion(THANKSGIVING);

	it('Thanksgiving 2026 has 5 dishes and 3 tasks', () => {
		expect(dishes.map((dish) => dish.name)).toEqual([
			'Beef tacos',
			'Honey glazed carrots',
			'Apple crumble',
			'Pumpkin pie',
			'Rolls'
		]);
		expect(tasks.map((task) => task.text)).toEqual(['Clean the oven', 'Borrow chairs', 'Buy candles']);
	});

	it('the honey glazed carrots are a recipe, a side, at the scale 2, and your dish', () => {
		expect(dishes[1]).toMatchObject({
			path: 'Recipes/Honey glazed carrots.md',
			course: 'side',
			scale: 2,
			person: null,
			ready: false
		});
	});

	it('the pumpkin pie has no recipe, and Mum brings it', () => {
		expect(dishes[3]).toMatchObject({ path: null, course: 'dessert', person: 'Mum', scale: 1 });
	});

	it('the rolls of Sam are ready', () => {
		expect(dishes[4].ready).toBe(true);
	});

	it('in "Rolls · Sam", "Sam" is the course', () => {
		const [rolls] = readOccasion('- [ ] Rolls · Sam').dishes;
		expect(rolls).toMatchObject({ course: 'Sam', person: null });
	});

	it('"prep done" is not a course and not a person', () => {
		const [tacos] = readOccasion('- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · prep done').dishes;
		expect(tacos).toMatchObject({ course: 'main', person: null, prepDone: true });
	});

	it('the bread at ×1.5 has the scale 1.5', () => {
		expect(readOccasion('- [ ] Bread · bread · ×1.5').dishes[0].scale).toBe(1.5);
	});

	it('"Borrow chairs" has the day 2026-11-24, and "Buy candles" has no day', () => {
		expect(tasks[1]).toEqual({ text: 'Borrow chairs', day: '2026-11-24', done: false });
		expect(tasks[2].day).toBeNull();
	});

	it('a note with no heading "To do" has no task', () => {
		expect(readOccasion('- [ ] Pancakes').tasks).toEqual([]);
	});
});

describe('a dish that the planner adds or removes', () => {
	it('"Black bean soup" comes directly after the line of "Rolls"', () => {
		const text = addDish(THANKSGIVING, { path: 'Recipes/Black bean soup.md', name: 'Black bean soup' });
		const lines = linesOf(text);
		expect(lines[lines.indexOf('- [x] Rolls · bread · Sam') + 1]).toBe(
			'- [ ] [[Recipes/Black bean soup|Black bean soup]]'
		);
	});

	it('"Cheese board" with no recipe is the line `- [ ] Cheese board`', () => {
		const text = addDish(THANKSGIVING, { path: null, name: 'Cheese board' });
		expect(lineWith(text, 'Cheese board')).toBe('- [ ] Cheese board');
	});

	it('the first dish of a note with "To do" goes above the heading', () => {
		const text = addDish('---\ndate: 2026-12-05\n---\n\n## To do\n', { path: null, name: 'Pancakes' });
		const lines = linesOf(text);
		expect(lines.indexOf('- [ ] Pancakes')).toBeLessThan(lines.indexOf('## To do'));
	});

	it('the first dish of a note with only the date is its last line', () => {
		const text = addDish('---\ndate: 2026-12-05\n---\n', { path: null, name: 'Pancakes' });
		expect(text.trimEnd().split('\n').at(-1)).toBe('- [ ] Pancakes');
	});

	it('the line "Dinner at 15:00." and the tasks stay when the planner adds a dish', () => {
		const text = addDish(THANKSGIVING, { path: null, name: 'Cheese board' });
		expect(text).toContain('Dinner at 15:00.');
		expect(text.slice(text.indexOf('## To do'))).toBe(THANKSGIVING.slice(THANKSGIVING.indexOf('## To do')));
	});

	it('✕ on "Pumpkin pie" takes out its line, and each other line stays', () => {
		const text = removeDish(THANKSGIVING, 3);
		expect(text).not.toContain('Pumpkin pie');
		expect(text).toBe(THANKSGIVING.replace('- [ ] Pumpkin pie · dessert · Mum\n', ''));
	});
});

describe('a change of the person, the course, or the scale of a dish', () => {
	it('"Mum" for the apple crumble', () => {
		const text = changeDish(THANKSGIVING, 2, { person: 'Mum' });
		expect(lineWith(text, 'Apple crumble')).toBe(
			'- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert · Mum'
		);
	});

	it('"You" for the pumpkin pie takes the person out', () => {
		const text = changeDish(THANKSGIVING, 3, { person: null });
		expect(lineWith(text, 'Pumpkin pie')).toBe('- [ ] Pumpkin pie · dessert');
	});

	it('×3 and then ×1 for the carrots', () => {
		const three = changeDish(THANKSGIVING, 1, { scale: 3 });
		expect(lineWith(three, 'carrots')).toBe(
			'- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×3'
		);
		expect(lineWith(changeDish(three, 1, { scale: 1 }), 'carrots')).toBe(
			'- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side'
		);
	});

	it('Sam for a cheese board with no course writes the course "other"', () => {
		const text = changeDish('- [ ] Cheese board', 0, { course: 'other', person: 'Sam' });
		expect(text).toBe('- [ ] Cheese board · other · Sam');
	});

	it('×2 for the rolls keeps the mark', () => {
		expect(lineWith(changeDish(THANKSGIVING, 4, { scale: 2 }), 'Rolls')).toBe('- [x] Rolls · bread · ×2 · Sam');
	});

	it('×2 for a pie of `[[Mum]]` keeps the link', () => {
		const text = changeDish('- [ ] Pumpkin pie · dessert · [[Mum]]', 0, { scale: 2 });
		expect(text).toBe('- [ ] Pumpkin pie · dessert · ×2 · [[Mum]]');
	});

	it('×2 for the tacos keeps "prep done" at the end', () => {
		const text = changeDish('- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · prep done', 0, { scale: 2 });
		expect(text).toBe('- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · ×2 · prep done');
	});

	it('"Prep is done" on the tacos, and a second tap', () => {
		const done = changeDish(THANKSGIVING, 0, { prepDone: true });
		expect(lineWith(done, 'Beef tacos')).toBe('- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · prep done');
		expect(lineWith(changeDish(done, 0, { prepDone: false }), 'Beef tacos')).toBe(
			'- [ ] [[Recipes/Beef tacos|Beef tacos]] · main'
		);
	});
});

describe('the marks of the dishes and the tasks', () => {
	it('a tap on the check of the pumpkin pie gives it its mark', () => {
		expect(lineWith(setDishReady(THANKSGIVING, 3, true), 'Pumpkin pie')).toBe(
			'- [x] Pumpkin pie · dessert · Mum'
		);
	});

	it('a tap on the check of the rolls takes the mark off', () => {
		expect(lineWith(setDishReady(THANKSGIVING, 4, false), 'Rolls')).toBe('- [ ] Rolls · bread · Sam');
	});

	it('a tap on "Borrow chairs" gives it its mark, and a second tap takes it off', () => {
		const done = setTaskDone(THANKSGIVING, 1, true);
		expect(lineWith(done, 'Borrow chairs')).toBe('- [x] Borrow chairs · 2026-11-24');
		expect(lineWith(setTaskDone(done, 1, false), 'Borrow chairs')).toBe('- [ ] Borrow chairs · 2026-11-24');
	});
});

describe('a new occasion note', () => {
	it('"Christmas 2026" has only the property `date: 2026-12-24`', () => {
		expect(newOccasionText('2026-12-24')).toBe('---\ndate: 2026-12-24\n---\n');
	});

	it('a copy of Thanksgiving 2025 has its dishes with no mark and no "prep done"', () => {
		const text = newOccasionText('2026-11-21', PAST);
		expect(dishLines(text)).toEqual([
			'- [ ] [[Recipes/Beef tacos|Beef tacos]] · main',
			'- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2',
			'- [ ] Pumpkin pie · dessert · Mum'
		]);
	});

	it('a copy of Thanksgiving 2025 has only "Buy candles" below "To do", and the new date', () => {
		const text = newOccasionText('2026-11-21', PAST);
		expect(readOccasion(text).tasks).toEqual([{ text: 'Buy candles', day: null, done: false }]);
		expect(text.startsWith('---\ndate: 2026-11-21\n---\n')).toBe(true);
		expect(text).not.toContain('Dinner at 14:00.');
	});

	it('a copy of a note with no task that has no day has no heading "To do"', () => {
		const text = newOccasionText('2026-11-21', '- [ ] Pancakes\n\n## To do\n\n- [ ] Clean · 2025-01-01\n');
		expect(text).not.toContain('## To do');
	});
});

const WITH_GUESTS = `---
date: 2026-11-26
---
- [ ] [[Recipes/Beef tacos|Beef tacos]] · main
- [ ] Pumpkin pie · dessert · Mum
- [x] Rolls · bread · Sam
- [ ] Plates · things · ?

## Guests

- Mum ×2
- Sam
- The Smiths ×4

## To do

- [ ] Buy candles
`;

describe('the guest list of an occasion note', () => {
	it('has 3 guests, each with the size of the party', () => {
		expect(readOccasion(WITH_GUESTS).guests).toEqual([
			{ name: 'Mum', size: 2 },
			{ name: 'Sam', size: 1 },
			{ name: 'The Smiths', size: 4 }
		]);
	});

	it('a guest line is not a dish, and the plates are a dish of "?"', () => {
		const { dishes, tasks } = readOccasion(WITH_GUESTS);
		expect(dishes.map((dish) => dish.name)).toEqual(['Beef tacos', 'Pumpkin pie', 'Rolls', 'Plates']);
		expect(dishes[3]).toMatchObject({ course: 'things', person: '?' });
		expect(tasks.map((task) => task.text)).toEqual(['Buy candles']);
	});

	it('"Aunt Jo" comes after the last guest', () => {
		const text = addGuest(WITH_GUESTS, 'Aunt Jo');
		expect(lineWith(text, 'The Smiths')).toBe('- The Smiths ×4');
		expect(linesOf(text)[linesOf(text).indexOf('- The Smiths ×4') + 1]).toBe('- Aunt Jo');
	});

	it('a name that is a guest already adds nothing', () => {
		expect(addGuest(WITH_GUESTS, 'Sam')).toBe(WITH_GUESTS);
	});

	it('the first guest of a note with "To do" goes in a new list above the heading', () => {
		const text = addGuest(`---\ndate: 2026-11-26\n---\n- [ ] Pie\n\n## To do\n\n- [ ] Buy candles\n`, 'Jo');
		expect(text).toBe(`---\ndate: 2026-11-26\n---\n- [ ] Pie\n\n## Guests\n\n- Jo\n\n## To do\n\n- [ ] Buy candles\n`);
	});

	it('+ on The Smiths, and − on Mum down to 1', () => {
		expect(lineWith(setGuestSize(WITH_GUESTS, 'The Smiths', 5), 'Smiths')).toBe('- The Smiths ×5');
		expect(lineWith(setGuestSize(WITH_GUESTS, 'Mum', 1), '- Mum')).toBe('- Mum');
		expect(lineWith(setGuestSize(WITH_GUESTS, 'Mum', 0), '- Mum')).toBe('- Mum');
	});

	it('a size for a guest that is a link keeps the link', () => {
		expect(setGuestSize('## Guests\n\n- [[Mum]] ×2\n', 'Mum', 3)).toBe('## Guests\n\n- [[Mum]] ×3\n');
	});

	it('a size for a person of a dish with no line writes the line', () => {
		const text = setGuestSize('- [ ] Pie · dessert · Jo\n', 'Jo', 2);
		expect(text).toBe('- [ ] Pie · dessert · Jo\n\n## Guests\n\n- Jo ×2\n');
	});

	it('✕ on Mum takes out her line, and her pie is open', () => {
		const text = removeGuest(WITH_GUESTS, 'Mum');
		expect(text).not.toContain('- Mum ×2');
		expect(lineWith(text, 'Pumpkin pie')).toBe('- [ ] Pumpkin pie · dessert · ?');
		expect(lineWith(text, 'Rolls')).toBe('- [x] Rolls · bread · Sam');
	});
});

describe('a job that the planner adds in a card', () => {
	it('"Rolls" by name in the card of Mum', () => {
		const text = addDish(WITH_GUESTS, { path: null, name: 'Rolls', course: 'other', person: 'Mum' });
		expect(linesOf(text)).toContain('- [ ] Rolls · other · Mum');
	});

	it('"Lemonade" in the card "Drink" is open, after the plates', () => {
		const text = addDish(WITH_GUESTS, { path: null, name: 'Lemonade', course: 'drink', person: '?' });
		const lines = linesOf(text);
		expect(lines[lines.indexOf('- [ ] Plates · things · ?') + 1]).toBe('- [ ] Lemonade · drink · ?');
	});

	it('the first dish of a note with a guest list goes above "Guests"', () => {
		const text = addDish('## Guests\n\n- Sam\n', { path: null, name: 'Pie' });
		expect(text).toBe('- [ ] Pie\n\n## Guests\n\n- Sam\n');
	});
});

describe('a task that the planner adds', () => {
	it('"Get ice" comes after "Buy candles"', () => {
		expect(addTask(WITH_GUESTS, 'Get ice').trimEnd().split('\n').at(-1)).toBe('- [ ] Get ice');
	});

	it('a note with no "To do" gets the heading at the end', () => {
		expect(addTask('- [ ] Pie\n', 'Buy ice')).toBe('- [ ] Pie\n\n## To do\n\n- [ ] Buy ice\n');
	});

	it('a heading "To do" with no task, above the guests, gets the task below it', () => {
		const text = addTask('## To do\n\n## Guests\n\n- Sam\n', 'Buy ice');
		expect(readOccasion(text).tasks.map((task) => task.text)).toEqual(['Buy ice']);
		expect(readOccasion(text).guests).toEqual([{ name: 'Sam', size: 1 }]);
	});
});

describe('a copy of an occasion with guests', () => {
	it('gets the guest list with each party size', () => {
		const text = newOccasionText('2027-11-25', WITH_GUESTS);
		expect(readOccasion(text).guests).toEqual(readOccasion(WITH_GUESTS).guests);
		expect(text.indexOf('## Guests')).toBeLessThan(text.indexOf('## To do'));
	});
});
