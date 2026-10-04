// The rules of the Today screen: the order of the hand, the offers of the pantry, and the
// words of the title.
import { greeting, plural } from '$lib/util/format';
import { canMake } from './availability';
import { isCooking } from './cook-session';
import { oldestUse, useUpIdeas } from './use-up';

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
 *   time: number
 * }} TodayFacts
 *   hand: the meals of the menu, in the order of the hand. cooking: the meals that the owner
 *   is in the middle of. ideas: the offers of the pantry. soon: the food to use first.
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
 * The hand: the meals that the owner cooks now, then the ready meals, then the meals that
 * wait, then the preparation to do. In one group, the meal with the oldest food is first.
 * @param {MenuEntry[]} entries
 * @param {Map<string, CookSession>} cooking
 * @param {SoonItem[]} soon
 * @returns {MenuEntry[]}
 */
export function handOrder(entries, cooking, soon) {
	return entries.toSorted(
		(a, b) =>
			Number(cooking.has(b.item.id)) - Number(cooking.has(a.item.id)) ||
			STATE_ORDER[a.state] - STATE_ORDER[b.state] ||
			(oldestUse(b.recipe, soon)?.days ?? -1) - (oldestUse(a.recipe, soon)?.days ?? -1) ||
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
export function todayHeading({ hand, cooking, ideas }) {
	if (cooking.size > 0) return 'On the stove';
	if (hand.length === 0) return ideas.length > 0 ? 'Nothing is ready' : greeting();
	const waitsOnly = hand.every((entry) => entry.state === 'waiting');
	return waitsOnly ? 'Nothing is ready' : greeting();
}

/**
 * One sentence under the title. It names the reason for the order of the hand.
 * @param {TodayFacts} facts
 */
export function todaySubline({ hand, cooking, ideas, soon, time }) {
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

	const ready = hand.filter((entry) => entry.state === 'ready').length;
	const todo = hand.filter((entry) => entry.state === 'todo').length;
	if (ready > 0) {
		const first = oldestUse(hand[0].recipe, soon);
		const count = `${plural(ready, 'meal')} ${ready === 1 ? 'is' : 'are'} ready.`;
		return first ? `${count} The ${first.ingredient.name.toLowerCase()} goes first.` : count;
	}
	if (todo > 0)
		return todo === 1 ? 'One thing to start first.' : `${plural(todo, 'thing')} to start first.`;
	return 'Wait for the next meal.';
}
