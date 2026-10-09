// The rules of the Today screen: the order of the hand, the offers of the pantry, and the
// words of the title.
import { greeting, plural, pluralIs } from '$lib/util/format';
import { canMake } from './availability';
import { isCooking } from './cook-session';
import { nightOf } from './nights';
import { firstUse, useUpIdeas } from './use-up';

/**
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('./menu').MenuEntry} MenuEntry
 * @typedef {import('./use-up').SoonItem} SoonItem
 * @typedef {import('./use-up').UseUpIdea} UseUpIdea
 *
 * @typedef {{
 *   hand: MenuEntry[],
 *   cooking: Map<string, CookSession>,
 *   ideas: UseUpIdea[],
 *   soon: SoonItem[],
 *   toBuy: number,
 *   menuSet: boolean,
 *   time: number
 * }} TodayFacts
 *   hand: the meals of the menu, in the order of the hand. cooking: the meals that the owner
 *   is in the middle of. ideas: the offers of the pantry. soon: the food to use first.
 *   toBuy: the items of the shopping list that are not in the cart. menuSet: the owner
 *   completed the plan of the week.
 */

const STATE_ORDER = { ready: 0, waiting: 1, todo: 2 };

/**
 * The meals that the owner is in the middle of. Their cards show the steps.
 * @param {CookSession[]} open The cook sessions that are open.
 * @param {number} time
 * @returns {Map<string, CookSession>} By menu item ID.
 */
export function cookingNow(open, time) {
	return new Map(
		open
			.filter((session) => isCooking(session, time))
			.map((session) => [session.menuItem.id, session])
	);
}

/**
 * The place of a meal in the hand by its night: a night of tonight or before is 0, a later
 * night is 1, and a meal with no night is 2.
 * @param {MenuEntry} entry
 * @param {string} today
 */
function nightRank(entry, today) {
	if (!entry.item.night) return 2;
	return entry.item.night <= today ? 0 : 1;
}

/**
 * The hand: the meals that the owner cooks now, then the meal of tonight, then the meals of
 * the later nights in their sequence, then the meals with no night. In one group, a ready meal
 * is before a meal that waits, and the meal with the food that spoils first is first.
 * @param {MenuEntry[]} entries
 * @param {Map<string, CookSession>} cooking
 * @param {SoonItem[]} soon
 * @param {number} time
 * @returns {MenuEntry[]}
 */
export function handOrder(entries, cooking, soon, time) {
	const today = nightOf(time);
	return entries.toSorted(
		(a, b) =>
			Number(cooking.has(b.item.id)) - Number(cooking.has(a.item.id)) ||
			nightRank(a, today) - nightRank(b, today) ||
			(a.item.night ?? '').localeCompare(b.item.night ?? '') ||
			STATE_ORDER[a.state] - STATE_ORDER[b.state] ||
			(firstUse(a.recipe, soon)?.left ?? Infinity) - (firstUse(b.recipe, soon)?.left ?? Infinity) ||
			(a.readyAt ?? 0) - (b.readyAt ?? 0)
	);
}

/**
 * The offers of the pantry: the recipes that the pantry can make now, with no preparation,
 * and that are not on the menu. The best for the food to use first is at the top.
 * @param {Recipe[]} recipes
 * @param {Set<string>} onMenu The IDs of the recipes that are on the menu.
 * @param {SoonItem[]} soon
 * @param {Map<string, Ingredient>} ingredientsById
 * @param {Map<string, PantryItem>} pantryByIngredient
 * @returns {UseUpIdea[]}
 */
export function pantryOffers(recipes, onMenu, soon, ingredientsById, pantryByIngredient) {
	const able = recipes.filter(
		(recipe) =>
			!onMenu.has(recipe.id) &&
			recipe.prepSteps.length === 0 &&
			canMake(recipe, ingredientsById, pantryByIngredient)
	);
	return useUpIdeas(able, soon, ingredientsById, pantryByIngredient);
}

/** @param {Date} date */
const clockTime = (date) =>
	date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

/**
 * The title of the screen: one word, or a short phrase, that tells the state of the day.
 * @param {TodayFacts} facts
 */
export function todayHeading({ hand, cooking, ideas, toBuy, menuSet }) {
	if (cooking.size > 0) return 'On the stove';
	if (menuSet && toBuy > 0 && hand.length > 0) return 'Menu set';
	if (hand.length === 0) return ideas.length > 0 ? 'Nothing is ready' : greeting();
	const waitsOnly = hand.every((entry) => entry.state === 'waiting');
	return waitsOnly ? 'Nothing is ready' : greeting();
}

/**
 * One sentence under the title. It names the reason for the order of the hand.
 * @param {TodayFacts} facts
 */
export function todaySubline({ hand, cooking, ideas, soon, toBuy, menuSet, time }) {
	if (cooking.size > 0) {
		const ends = [...cooking.values()]
			.flatMap((session) => session.timers.map((timer) => Date.parse(timer.endsAt)))
			.filter((end) => end > time);
		if (ends.length > 0) return `The timer ends at ${clockTime(new Date(Math.min(...ends)))}.`;
		const name = hand[0]?.recipe.name ?? 'The meal';
		return `${name} is in progress.`;
	}
	if (hand.length === 0) {
		return ideas.length > 0
			? `The pantry can still make ${plural(ideas.length, 'meal')}.`
			: 'Your hand is empty.';
	}
	if (menuSet && toBuy > 0)
		return `${plural(hand.length, 'meal')}. ${plural(toBuy, 'thing')} to buy.`;

	const ready = hand.filter((entry) => entry.state === 'ready').length;
	const todo = hand.filter((entry) => entry.state === 'todo').length;
	if (ready > 0) {
		const first = firstUse(hand[0].recipe, soon);
		const count = `${pluralIs(ready, 'meal')} ready.`;
		return first ? `${count} The ${first.ingredient.name.toLowerCase()} goes first.` : count;
	}
	if (todo > 0)
		return todo === 1 ? 'One thing to start first.' : `${plural(todo, 'thing')} to start first.`;
	return 'Wait for the next meal.';
}
