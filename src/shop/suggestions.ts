// A staple is a suggestion when it needs a look. The amount alone does not tell that food is
// good: bread can be gone with no meal that took it, and ginger can be too old to use. So one rule
// uses three facts together: the amount, the use-by date, and the purchase date.

import { daysBetween, showDate } from '../dates';
import type { FoodNote } from '../note';
import { levelOf } from '../pantry/level';
import { ASK_AFTER, showKind } from '../pantry/staple';
import { firstUseBy, totalOf } from '../pantry/total';
import type { FoodItem } from '../pantry/types';

export type Reason =
	| { is: 'out' | 'low' | 'past' | 'noPurchase' | 'often' }
	| { is: 'useBy'; date: string }
	| { is: 'bought'; days: number };

export type Suggestion = { food: FoodNote; reason: Reason };

// The day and the two settings that decide when food needs a look.
type When = { today: string; soonDays: number; lowPercent: number };

// `hidden` has the paths of the staples that do not show: a staple with a task in the open note is
// on the list already, and a staple that you skipped stays away until the trip ends.
export function suggestionsOf(foods: FoodNote[], when: When, hidden: Set<string>): Suggestion[] {
	return foods
		.filter((food) => !hidden.has(food.path))
		.flatMap((food) => {
			const reason = reasonOf(food.item, when);
			return reason ? [{ food, reason }] : [];
		})
		.sort((a, b) => a.food.item.name.localeCompare(b.food.item.name));
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

// What you look at before you decide: the amount that the pantry has, the purchase date, and the
// first use-by date. A fact that the food item does not have is not in the list.
export function factsOf({ item }: FoodNote): string[] {
	const useBy = firstUseBy(item.stocks);
	return [
		totalOf(item.stocks),
		item.bought ? `Bought ${showDate(item.bought)}` : '',
		useBy ? `Use by ${showDate(useBy)}` : ''
	].filter(Boolean);
}

// A staple can have more than one reason. The first that is true is the one that shows.
function reasonOf(item: FoodItem, { today, soonDays, lowPercent }: When): Reason | null {
	if (!item.staple) return null;
	if (!item.stocks.length) return { is: 'out' };
	if (levelOf(item, lowPercent)?.isLow) return { is: 'low' };

	const useBy = firstUseBy(item.stocks);
	if (useBy && daysBetween(today, useBy) < 0) return { is: 'past' };
	if (useBy && daysBetween(today, useBy) <= soonDays) return { is: 'useBy', date: useBy };

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
