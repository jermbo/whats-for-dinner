import { describe, expect, it } from 'vitest';
import { courseCards, menuDishes, personCards } from '../../src/occasion/menu';
import { comingOf, guestsOf, openJobsOf } from '../../src/occasion/guests';
import { nextUp, occasionRows } from '../../src/occasion/occasion-browse';
import { readOccasion } from '../../src/occasion/occasion-note';
import {
	activeOccasions,
	dayProblem,
	daysLabel,
	isActive,
	nameProblem,
	pastOccasions,
	readOccasionNote,
	type Occasion
} from '../../src/occasion/occasions';

const occasion = (name: string, date: string | null): Occasion => ({
	path: `Larder/Occasions/${name}.md`,
	name,
	date,
	dishes: [],
	tasks: [],
	guests: []
});

const THANKSGIVING = occasion('Thanksgiving 2026', '2026-11-26');
const BIRTHDAY = occasion("Sam's birthday", '2026-11-14');
const GAME_NIGHT = occasion('Game night', null);

describe('an active occasion and its days', () => {
	it.each([
		['2026-11-21', '5 days'],
		['2026-11-25', '1 day'],
		['2026-11-26', 'today'],
		['2026-11-27', 'yesterday']
	])('on %s, Thanksgiving 2026 is active with "%s"', (today, days) => {
		expect(isActive(THANKSGIVING, today)).toBe(true);
		expect(daysLabel(THANKSGIVING.date, today)).toBe(days);
	});

	it('on 2026-11-28, Thanksgiving 2026 is not active', () => {
		expect(isActive(THANKSGIVING, '2026-11-28')).toBe(false);
	});

	it('Game night with no date is active, and has no days', () => {
		expect(isActive(GAME_NIGHT, '2030-01-01')).toBe(true);
		expect(daysLabel(GAME_NIGHT.date, '2030-01-01')).toBeNull();
	});

	it("on 2026-11-10, Sam's birthday comes first, then Thanksgiving, then Game night", () => {
		const names = activeOccasions([GAME_NIGHT, THANKSGIVING, BIRTHDAY], '2026-11-10').map((one) => one.name);
		expect(names).toEqual(["Sam's birthday", 'Thanksgiving 2026', 'Game night']);
	});

	it('the property `date` of a note is its day, as text or as a date of the YAML', () => {
		expect(readOccasionNote('a.md', 'a', { date: '2026-11-26' }, '').date).toBe('2026-11-26');
		expect(readOccasionNote('a.md', 'a', { date: new Date('2026-11-26') }, '').date).toBe('2026-11-26');
		expect(readOccasionNote('a.md', 'a', {}, '').date).toBeNull();
	});
});

describe('the past occasions that a new one can start from', () => {
	it('on 2026-10-31, Thanksgiving 2025 is past, and the occasions to come are not', () => {
		const past = pastOccasions(
			[THANKSGIVING, BIRTHDAY, GAME_NIGHT, occasion('Thanksgiving 2025', '2025-11-27')],
			'2026-10-31'
		);
		expect(past.map((one) => one.name)).toEqual(['Thanksgiving 2025']);
	});

	it('6 past occasions give the 5 newest, the newest first', () => {
		const six = [2020, 2021, 2022, 2023, 2024, 2025].map((year) =>
			occasion(`Thanksgiving ${year}`, `${year}-11-26`)
		);
		const past = pastOccasions(six, '2026-10-31');
		expect(past.map((one) => one.date)).toEqual([
			'2025-11-26',
			'2024-11-26',
			'2023-11-26',
			'2022-11-26',
			'2021-11-26'
		]);
	});
});

describe('the name and the day of a new occasion', () => {
	const names = ['Thanksgiving 2026'];

	it('"Thanksgiving 2026" has a note already', () => {
		expect(nameProblem('Thanksgiving 2026', names)).toBe('An occasion has this name');
	});

	it('"Mum/Dad" cannot be a name', () => {
		expect(nameProblem('Mum/Dad', names)).toBe('A name cannot have /');
	});

	it('"Christmas 2026" can start', () => {
		expect(nameProblem('Christmas 2026', names)).toBeNull();
	});

	it('on 2026-10-31, the day 2026-10-30 is past, and 2026-10-31 is not', () => {
		expect(dayProblem('2026-10-30', '2026-10-31')).toBe('This day is past');
		expect(dayProblem('2026-10-31', '2026-10-31')).toBeNull();
	});
});

describe('the menu of Thanksgiving 2026', () => {
	const { dishes } = readOccasion(`- [ ] [[Recipes/Beef tacos|Beef tacos]] · main
- [ ] [[Recipes/Honey glazed carrots|Honey glazed carrots]] · side · ×2
- [ ] [[Recipes/Apple crumble|Apple crumble]] · dessert
- [ ] Pumpkin pie · dessert · Mum
- [x] Rolls · bread · Sam
- [ ] Bread · bread · ×1.5
- [ ] Cheese board
- [ ] [[Recipes/Pancakes|Pancakes]]
- [ ] Gravy · starter · [[Mum]]
- [ ] Plates · things · ?`);
	const types: Record<string, string> = { 'Recipes/Pancakes.md': 'breakfast' };
	const menu = menuDishes(dishes, (dish) => (dish.path ? (types[dish.path] ?? null) : null));
	const cards = personCards(menu, ['Sam', 'Mum', 'The Smiths']);
	const names = (person: string | null) =>
		cards.find((card) => card.person === person)?.dishes.map((one) => one.dish.name);

	it('the cards are You, each guest with a job in the sequence of the guest list, and Open', () => {
		expect(cards.map((card) => card.person)).toEqual([null, 'Sam', 'Mum', '?']);
	});

	it('your dishes go by course: main, side, dessert, your own words, and "other" last', () => {
		expect(names(null)).toEqual([
			'Beef tacos',
			'Honey glazed carrots',
			'Apple crumble',
			'Bread',
			'Pancakes',
			'Cheese board'
		]);
	});

	it('the pancakes get the course "breakfast" from their recipe', () => {
		expect(menu.find((one) => one.dish.name === 'Pancakes')?.course).toBe('breakfast');
	});

	it('the gravy of `[[Mum]]` is in the card of Mum, before the pie', () => {
		expect(names('Mum')).toEqual(['Gravy', 'Pumpkin pie']);
	});

	it('the plates are an open job', () => {
		expect(names('?')).toEqual(['Plates']);
	});

	it('the menu has each known course, also with no dish, then your own words, then "other"', () => {
		const courses = courseCards(menu);
		expect(courses.map((card) => card.course)).toEqual([
			'starter',
			'main',
			'side',
			'dessert',
			'drink',
			'things',
			'bread',
			'breakfast',
			'other'
		]);
		expect(courses.find((card) => card.course === 'drink')?.dishes).toEqual([]);
		expect(courses.find((card) => card.course === 'dessert')?.dishes.map((one) => one.dish.name)).toEqual([
			'Apple crumble',
			'Pumpkin pie'
		]);
	});

	it('"You" and "Open" are cards also with no dish', () => {
		expect(personCards([], []).map((card) => card.person)).toEqual([null, '?']);
	});
});

describe('the guests of Thanksgiving 2026', () => {
	const read = readOccasion(`- [ ] Pumpkin pie · dessert · Mum
- [x] Rolls · bread · Sam
- [ ] Gravy · starter · Jo
- [ ] Plates · things · ?

## Guests

- [[Mum]] ×2
- Sam
- The Smiths ×4`);

	it('the guest list, then each person of a dish with no line, at the size 1', () => {
		expect(guestsOf(read)).toEqual([
			{ name: 'Mum', size: 2 },
			{ name: 'Sam', size: 1 },
			{ name: 'The Smiths', size: 4 },
			{ name: 'Jo', size: 1 }
		]);
	});

	it('9 coming: you, and each party', () => {
		expect(comingOf(read)).toBe(9);
	});

	it('1 open job', () => {
		expect(openJobsOf(read)).toBe(1);
	});

	it('a note with no guest and no dish has 1 coming: you', () => {
		expect(comingOf({ dishes: [], guests: [] })).toBe(1);
	});
});

describe('the rows of the Occasions part', () => {
	const PAST = occasion('Thanksgiving 2025', '2025-11-27');
	const all = [THANKSGIVING, BIRTHDAY, GAME_NIGHT, PAST];
	const today = '2026-11-10';

	it('"Next up" is the nearest occasion that is not past', () => {
		expect(nextUp(all, today)?.name).toBe("Sam's birthday");
	});

	it('a note with no date is "Next up" only with no date after today', () => {
		expect(nextUp([GAME_NIGHT, PAST], today)?.name).toBe('Game night');
		expect(nextUp([PAST], today)).toBeNull();
	});

	it('"Upcoming" and "Nearest first" have no row of "Next up"', () => {
		const rows = occasionRows(all, today, 'upcoming', 'near', BIRTHDAY.path);
		expect(rows.map((one) => one.name)).toEqual(['Thanksgiving 2026', 'Game night']);
	});

	it('"Past" has only the past occasions', () => {
		expect(occasionRows(all, today, 'past', 'near', null).map((one) => one.name)).toEqual([
			'Thanksgiving 2025'
		]);
	});

	it('"All" and "Nearest first" put the upcoming ones first, then the past ones', () => {
		expect(occasionRows(all, today, 'all', 'near', null).map((one) => one.name)).toEqual([
			"Sam's birthday",
			'Thanksgiving 2026',
			'Game night',
			'Thanksgiving 2025'
		]);
	});

	it('"A to Z" and "Newest first"', () => {
		expect(occasionRows(all, today, 'all', 'name', null).map((one) => one.name)).toEqual([
			'Game night',
			"Sam's birthday",
			'Thanksgiving 2025',
			'Thanksgiving 2026'
		]);
		expect(occasionRows(all, today, 'all', 'new', null).map((one) => one.name)[0]).toBe('Game night');
	});

	it('on 2026-11-28, Thanksgiving 2026 is past, the newest first', () => {
		expect(occasionRows(all, '2026-11-28', 'past', 'near', null).map((one) => one.name)).toEqual([
			'Thanksgiving 2026',
			"Sam's birthday",
			'Thanksgiving 2025'
		]);
	});
});
