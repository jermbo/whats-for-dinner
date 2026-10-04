// The order of the pile of meal cards in the hand. The first card of a list is the top.
import { shuffled } from '$lib/util/collections';

/** @typedef {import('./menu').MenuEntry} MenuEntry */

/**
 * The menu item IDs of a list of meals.
 * @param {MenuEntry[]} list
 */
export function pileIds(list) {
	return list.map((entry) => entry.item.id);
}

/**
 * The meals in the order of the pile. A meal that is not in the order comes on top: a meal
 * that becomes ready comes into the hand where you can see it.
 * @param {MenuEntry[]} entries
 * @param {string[]} order The IDs from the top of the pile down.
 */
export function inPileOrder(entries, order) {
	return entries.toSorted((a, b) => order.indexOf(a.item.id) - order.indexOf(b.item.id));
}

/**
 * The top card goes under the pile. With one card, the pile stays the same.
 * @param {MenuEntry[]} cards
 */
export function topToBottom(cards) {
	const [first, ...rest] = cards;
	return first ? [...rest, first] : [];
}

/**
 * The bottom card comes back on top.
 * @param {MenuEntry[]} cards
 */
export function bottomToTop(cards) {
	const last = cards.at(-1);
	return last ? [last, ...cards.slice(0, -1)] : [];
}

/**
 * A new order with a different meal on top. The meal on top is one that you can cook now, if
 * there is one.
 * @param {MenuEntry[]} cards Two cards or more.
 */
export function shuffledPile(cards) {
	const [first, ...rest] = cards;
	const ready = rest.filter((entry) => entry.state === 'ready');
	const pool = ready.length > 0 ? ready : rest;
	const pick = pool[Math.floor(Math.random() * pool.length)];
	return [pick, ...shuffled([first, ...rest.filter((entry) => entry !== pick)])];
}
