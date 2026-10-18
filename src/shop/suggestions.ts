// A food item is a suggestion when it needs a look. Each food item that is out, low, past its date,
// or near its date is one, so that you see it with no label to set first. The amount alone does
// not tell that a staple is good: bread can be gone with no meal that took it. So a staple also
// has the reason of its purchase date.

import { daysBetween, showDate } from '../dates';
import type { FoodNote } from '../note';
import { levelOf } from '../pantry/level';
import { ASK_AFTER, showKind } from '../pantry/staple';
import { firstUseBy, totalOf } from '../pantry/total';
import type { FoodItem } from '../pantry/types';
import { showMeasure } from '../units';
import { isPastDate } from './past-date';

export type Reason =
	| { is: 'out' | 'low' | 'past' | 'noPurchase' | 'often' }
	| { is: 'useBy'; date: string }
	| { is: 'bought'; days: number };

export type Suggestion = { food: FoodNote; reason: Reason };

// The day and the two settings that decide when food needs a look.
type When = { today: string; soonDays: number; lowPercent: number };

// What the trip tells about the food items, as paths of their notes.
type Trip = {
	// The food items that do not show: a food item that a meal or a task of the open note puts on
	// the list is on it already, and a suggestion that you skipped stays away until the trip ends.
	hidden: Set<string>;
};

export function suggestionsOf(foods: FoodNote[], when: When, { hidden }: Trip): Suggestion[] {
	return foods
		.filter((food) => !hidden.has(food.path) && !food.item.neverAsk)
		.flatMap((food) => {
			const reason = reasonOf(food.item, when);
			return reason ? [{ food, reason }] : [];
		})
		.sort((a, b) => a.food.item.name.localeCompare(b.food.item.name));
}

// The groups of the stage Extras, in their sequence: what you have none of first, and a reminder
// of time last.
export const GROUPS = [
	{ group: 'out', title: 'Out' },
	{ group: 'low', title: 'Low' },
	{ group: 'date', title: 'Use-by date' },
	{ group: 'time', title: 'Time to check' }
] as const;
export type Group = (typeof GROUPS)[number]['group'];

export function groupOf(reason: Reason): Group {
	if (reason.is === 'out' || reason.is === 'low') return reason.is;
	return reason.is === 'past' || reason.is === 'useBy' ? 'date' : 'time';
}

export function showReason(reason: Reason): string {
	if (reason.is === 'out') return 'Out';
	if (reason.is === 'low') return 'Low';
	if (reason.is === 'past') return 'Past its date';
	if (reason.is === 'useBy') return `Use by ${showDate(reason.date)}`;
	if (reason.is === 'noPurchase') return 'No purchase date';
	if (reason.is === 'bought') return `Bought ${showAge(reason.days)} ago`;
	return showKind('often');
}

// What you look at before you decide: the level, such as "150 ml of 1 l", the purchase date, and
// the first use-by date. A food item that the plugin cannot count shows what the pantry has. A fact
// that the food item does not have is not in the list.
export function factsOf({ item }: FoodNote): string[] {
	const useBy = firstUseBy(item.stocks);
	const level = levelOf(item);
	const show = (value: number) => showMeasure({ kind: level?.kind ?? '', value });
	return [
		level && level.has > 0 ? `${show(level.has)} of ${show(level.full)}` : totalOf(item.stocks),
		item.bought ? `Bought ${showDate(item.bought)}` : '',
		useBy ? `Use by ${showDate(useBy)}` : ''
	].filter(Boolean);
}

// A food item can have more than one reason. The first that is true is the one that shows.
function reasonOf(item: FoodItem, { today, soonDays, lowPercent }: When): Reason | null {
	// Also a food item that you never bought, such as a stub of intake: a recipe needs it.
	if (!item.stocks.length) return { is: 'out' };
	if (levelOf(item, lowPercent)?.isLow) return { is: 'low' };
	if (isPastDate(item, today)) return { is: 'past' };
	const useBy = firstUseBy(item.stocks);
	if (useBy && daysBetween(today, useBy) <= soonDays) return { is: 'useBy', date: useBy };
	if (!item.staple) return null;

	// The plugin cannot tell that the time of the kind is not over.
	if (!item.bought) return { is: 'noPurchase' };
	if (item.staple === 'often') return { is: 'often' };

	const days = daysBetween(item.bought, today);
	return days >= ASK_AFTER[item.staple] ? { is: 'bought', days } : null;
}

// Days below 14 days, full weeks below 60 days, and full months of 30 days after that.
function showAge(days: number): string {
	if (days < 14) return count(days, 'day');
	return days < 60 ? count(Math.floor(days / 7), 'week') : count(Math.floor(days / 30), 'month');
}

const count = (value: number, unit: string) => `${value} ${unit}${value === 1 ? '' : 's'}`;
