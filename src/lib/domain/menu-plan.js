// The plan of the week: the nights that the owner cooks, and the night of each meal.
// A night is a proposal and not a lock: the owner can cook each meal on any day.
import { nightAfter, nightOf, nightShort, weekdayOf } from './nights';
import { cookMinutes } from './recipes';
import { firstUse } from './use-up';

/**
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').MenuPlan} MenuPlan
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('./menu').MenuEntry} MenuEntry
 * @typedef {import('./use-up').SoonItem} SoonItem
 *
 * @typedef {'nights' | 'deal' | 'week' | 'buy'} PlanStep
 * @typedef {{ night: string, entry: MenuEntry | null }} WeekRow
 *   One night of the plan, with its meal. Null: the night is open.
 * @typedef {{ text: string, urgent: boolean }} WeekNote
 */

/** The steps of the flow, in their sequence, with the name of each one. */
export const PLAN_STEPS = /** @type {{ value: PlanStep, label: string }[]} */ ([
	{ value: 'nights', label: 'Nights' },
	{ value: 'deal', label: 'Deal' },
	{ value: 'week', label: 'Week' },
	{ value: 'buy', label: 'To buy' }
]);

/** The plan looks this many nights ahead. */
const WEEK = 7;
/** A preparation with this lead time, or more, starts on a night before the meal. */
const NIGHT_BEFORE_HOURS = 6;
const DAY_HOURS = 24;
/** A row of the week names the food that has this many days left, or fewer. */
const NOTE_DAYS = 3;

/**
 * The nights that a plan can have: tonight and the six nights after it.
 * @param {number} time
 */
export function weekNights(time) {
	const first = nightOf(time);
	return Array.from({ length: WEEK }, (_, index) => nightAfter(first, index));
}

/**
 * The nights that the app proposes for a new plan: the same days of the week as the last
 * plan. With no last plan, the first nights from tonight, one for each meal of a week.
 * @param {MenuPlan | null | undefined} last
 * @param {number} meals The meals that the owner cooks in one week.
 * @param {number} time
 */
export function defaultNights(last, meals, time) {
	const week = weekNights(time);
	const days = new Set((last?.nights ?? []).map(weekdayOf));
	return days.size > 0 ? week.filter((night) => days.has(weekdayOf(night))) : week.slice(0, meals);
}

/**
 * One sentence about the nights that are off: "Fri and Sat off."
 * @param {string[]} week The nights that the plan can have.
 * @param {string[]} nights The nights of the plan.
 */
export function offSentence(week, nights) {
	const off = week.filter((night) => !nights.includes(night)).map(nightShort);
	if (off.length === 0) return 'Each night has a meal.';
	if (off.length === week.length) return 'Select one night or more.';
	const names = off.length === 1 ? off[0] : `${off.slice(0, -1).join(', ')} and ${off.at(-1)}`;
	return `${names} off.`;
}

/**
 * True when a plan has no night that is tonight or later: the week needs a new plan.
 * @param {MenuPlan | null | undefined} plan
 * @param {number} time
 */
export function planIsOver(plan, time) {
	const today = nightOf(time);
	return !plan || plan.nights.every((night) => night < today);
}

/**
 * The step that the Menu screen opens with: the nights for a new week, the dealer for a plan
 * that is not complete, and the week for a menu that is set.
 * @param {MenuPlan | null | undefined} plan
 * @param {number} time
 * @returns {PlanStep}
 */
export function planStep(plan, time) {
	if (planIsOver(plan, time)) return 'nights';
	return plan?.setAt ? 'week' : 'deal';
}

/**
 * The nights of a plan that are tonight or later. A meal can get one of these.
 * @param {string[]} nights
 * @param {number} time
 */
export function openNights(nights, time) {
	const today = nightOf(time);
	return nights.filter((night) => night >= today);
}

/**
 * The first night of the plan, from tonight, that no meal has. Null: each night has a meal.
 * @param {MenuPlan | null | undefined} plan
 * @param {MenuItem[]} menu
 * @param {number} time
 * @returns {string | null}
 */
export function freeNight(plan, menu, time) {
	const taken = new Set(menu.map((item) => item.night));
	return openNights(plan?.nights ?? [], time).find((night) => !taken.has(night)) ?? null;
}

/**
 * The lead time of the preparation of a recipe, in hours. Zero: no preparation.
 * @param {Recipe} recipe
 */
export function leadHours(recipe) {
	return Math.max(0, ...recipe.prepSteps.map((step) => step.leadHours));
}

/**
 * True for a meal whose preparation starts on a night before the meal, and is not done.
 * @param {MenuEntry} entry
 */
export function needsNightBefore(entry) {
	return (
		entry.item.kind === 'recipe' &&
		!entry.item.prepDoneAt &&
		leadHours(entry.recipe) >= NIGHT_BEFORE_HOURS
	);
}

/**
 * The night when the owner must start the preparation of a meal. Null: the meal has no night,
 * or it has no preparation that starts on a night before.
 * @param {MenuEntry} entry
 * @returns {string | null}
 */
export function prepNight(entry) {
	if (!entry.item.night || !needsNightBefore(entry)) return null;
	const days = Math.max(1, Math.round(leadHours(entry.recipe) / DAY_HOURS));
	return nightAfter(entry.item.night, -days);
}

/**
 * The preparation of a recipe in few words: the first sentence of its first step.
 * @param {Recipe} recipe
 */
export function prepTask(recipe) {
	const text = recipe.prepSteps[0]?.text.trim() ?? '';
	return text.split(/(?<=[.!?])\s/)[0].replace(/[.!?]$/, '') || 'Prepare';
}

/**
 * The meals of the week in their sequence: the meal with the food that spoils first is
 * first. A meal whose preparation starts the night before is not the first meal, when a
 * different meal can be: there is no night before tonight.
 * @param {MenuEntry[]} entries
 * @param {SoonItem[]} soon The food to use first.
 * @returns {MenuEntry[]} Leftovers are not in the result: they have no night.
 */
export function weekSequence(entries, soon) {
	/** @param {MenuEntry} entry */
	const left = (entry) => firstUse(entry.recipe, soon)?.left ?? Infinity;
	const meals = entries
		.filter((entry) => entry.item.kind === 'recipe')
		.toSorted((a, b) => left(a) - left(b) || a.item.addedAt.localeCompare(b.item.addedAt));

	const ready = meals.findIndex((entry) => !needsNightBefore(entry));
	if (ready > 0) meals.unshift(...meals.splice(ready, 1));
	return meals;
}

/**
 * Gives each meal a night, in the sequence of the meals. A meal that has no night left gets
 * none.
 * @param {MenuEntry[]} meals In the sequence of the week.
 * @param {string[]} nights
 * @returns {Map<string, string | null>} The night of each menu item, by its ID.
 */
export function nightsFor(meals, nights) {
	return new Map(meals.map((entry, index) => [entry.item.id, nights[index] ?? null]));
}

/**
 * The nights after a change of the plan: a meal keeps its night when the plan still has it.
 * A meal with no night of the plan gets the first night that is free, and none when each
 * night has a meal.
 * @param {MenuEntry[]} meals In the sequence of the week.
 * @param {string[]} nights The nights of the plan from tonight.
 * @returns {Map<string, string | null>} The night of each menu item that changes, by its ID.
 */
export function fillNights(meals, nights) {
	const free = nights.filter((night) => !meals.some((entry) => entry.item.night === night));

	/** @type {Map<string, string | null>} */
	const changes = new Map();
	for (const entry of meals) {
		if (entry.item.night && nights.includes(entry.item.night)) continue;
		const night = free.shift() ?? null;
		if (night !== entry.item.night) changes.set(entry.item.id, night);
	}
	return changes;
}

/**
 * The number of nights that have no meal.
 * @param {string[]} nights
 * @param {MenuEntry[]} meals
 */
export function openCount(nights, meals) {
	return nights.filter((night) => !meals.some((entry) => entry.item.night === night)).length;
}

/**
 * The meals with the nights of a change that the database does not have yet. A drag shows its
 * result at once with this.
 * @param {MenuEntry[]} entries
 * @param {Map<string, string | null> | null} nights The night of each menu item that moves.
 * @returns {MenuEntry[]}
 */
export function withNights(entries, nights) {
	if (!nights) return entries;
	return entries.map((entry) =>
		nights.has(entry.item.id)
			? { ...entry, item: { ...entry.item, night: nights.get(entry.item.id) ?? null } }
			: entry
	);
}

/**
 * True when each menu item has the night of a change.
 * @param {MenuItem[]} menu
 * @param {Map<string, string | null>} nights The night of each menu item that moves.
 */
export function hasNights(menu, nights) {
	return menu.every((item) => !nights.has(item.id) || nights.get(item.id) === item.night);
}

/**
 * The week as rows: one row for each night of the plan, with the meal of that night. The
 * meals with no night of the plan are "loose": leftovers, and a meal more than the nights.
 * @param {string[]} nights
 * @param {MenuEntry[]} entries
 * @returns {{ rows: WeekRow[], loose: MenuEntry[] }}
 */
export function weekRows(nights, entries) {
	/** @type {Set<string>} */
	const placed = new Set();
	const rows = nights.map((night) => {
		const entry =
			entries.find((item) => item.item.night === night && !placed.has(item.item.id)) ?? null;
		if (entry) placed.add(entry.item.id);
		return { night, entry };
	});
	return { rows, loose: entries.filter((entry) => !placed.has(entry.item.id)) };
}

/**
 * The nights after a drag: the row at "from" goes to the place "to". The nights stay in
 * their sequence, and the meals move.
 * @param {WeekRow[]} rows
 * @param {number} from
 * @param {number} to
 * @returns {Map<string, string | null>} The night of each menu item, by its ID.
 */
export function moveMeal(rows, from, to) {
	const meals = rows.map((row) => row.entry);
	meals.splice(to, 0, ...meals.splice(from, 1));

	/** @type {Map<string, string | null>} */
	const nights = new Map();
	meals.forEach((entry, index) => {
		if (entry) nights.set(entry.item.id, rows[index].night);
	});
	return nights;
}

/**
 * The small line of a meal in the week: the preparation with its night, then the food that
 * spoils, then the minutes.
 * @param {MenuEntry} entry
 * @param {SoonItem[]} soon The food to use first.
 * @param {number | null} minutes The minutes that the meal takes.
 * @returns {WeekNote}
 */
function weekNote(entry, soon, minutes) {
	const prep = prepNight(entry);
	if (prep) return { text: `${nightShort(prep)} night: ${prepTask(entry.recipe)}`, urgent: true };

	const ids = new Set(entry.recipe.ingredients.map((row) => row.ingredientId));
	const names = soon
		.filter((item) => ids.has(item.ingredient.id) && item.left <= NOTE_DAYS)
		.map((item) => item.ingredient.name.toLowerCase());
	if (names.length > 0) return { text: `Uses ${names.join(', ')}`, urgent: true };

	return { text: minutes ? `${minutes} min` : '', urgent: false };
}

/**
 * The small line of each meal of the menu.
 * @param {MenuEntry[]} entries
 * @param {SoonItem[]} soon The food to use first.
 * @param {Map<string, import('$lib/types').CookSession>} lastByRecipe The last cook session of
 *   each recipe.
 * @returns {Map<string, WeekNote>} By menu item ID.
 */
export function weekNotes(entries, soon, lastByRecipe) {
	return new Map(
		entries.map((entry) => [
			entry.item.id,
			weekNote(entry, soon, cookMinutes(entry.recipe, lastByRecipe.get(entry.recipe.id)))
		])
	);
}

/**
 * One sentence about the sequence of the week: the food that goes first.
 * @param {WeekRow[]} rows
 * @param {SoonItem[]} soon The food to use first.
 */
export function weekSentence(rows, soon) {
	const first = rows.find((row) => row.entry)?.entry;
	const food = first && firstUse(first.recipe, soon);
	return food ? `${food.ingredient.name} goes first.` : '';
}

/**
 * The nights after "Order in": each meal of tonight or later moves one night.
 * @param {MenuItem[]} menu
 * @param {number} time
 * @returns {Map<string, string | null>} The night of each menu item that moves, by its ID.
 */
export function pushNights(menu, time) {
	const today = nightOf(time);
	/** @type {Map<string, string | null>} */
	const nights = new Map();
	for (const item of menu) {
		if (item.night && item.night >= today) nights.set(item.id, nightAfter(item.night, 1));
	}
	return nights;
}

/**
 * The nights after a meal changes its place with the meal of the next night.
 * @param {MenuItem[]} menu
 * @param {MenuItem} item A meal that has a night.
 * @returns {Map<string, string | null>} The night of each menu item that moves, by its ID.
 */
export function swapWithNext(menu, item) {
	/** @type {Map<string, string | null>} */
	const nights = new Map();
	if (!item.night) return nights;

	const next = nightAfter(item.night, 1);
	nights.set(item.id, next);
	const other = menu.find((entry) => entry.night === next);
	if (other) nights.set(other.id, item.night);
	return nights;
}
