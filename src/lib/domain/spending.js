import { groupBy } from '$lib/util/collections';
import { formatDay } from '$lib/util/format';
import { tripCost } from './trips';
import { weekStart } from './week';

/**
 * @typedef {import('$lib/types').Trip} Trip
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {{ trip: Trip, purchases: Purchase[] }} TripLines
 * @typedef {{
 *   start: number,
 *   label: string,
 *   cost: import('./trips').TripCost,
 *   trips: TripLines[]
 * }} SpendingWeek
 *   start: the start of the week, in milliseconds. cost: the sum of the trips of the week.
 */

/**
 * The spending on food by week: the trips of each week, with their sum. The newest week is
 * first, and so is the newest trip of a week. A trip is in the week in which it started.
 * See docs/shopping/spending-by-week.md.
 * @param {Trip[]} trips
 * @param {Purchase[]} purchases The purchases of all trips.
 * @param {number} firstDay The first day of the week, as "Date.getDay()" gives it: 0 is Sunday.
 * @param {number} nowMs
 * @returns {SpendingWeek[]}
 */
export function spendingByWeek(trips, purchases, firstDay, nowMs) {
	const linesOf = groupBy(purchases, (purchase) => purchase.tripId);
	const thisWeek = weekStart(nowMs, firstDay);
	const lastWeek = weekStart(thisWeek - 1, firstDay);

	/** @type {Map<number, TripLines[]>} */
	const weeks = new Map();
	for (const trip of trips.toSorted((a, b) => b.startedAt.localeCompare(a.startedAt))) {
		const start = weekStart(Date.parse(trip.startedAt), firstDay);
		const lines = { trip, purchases: linesOf.get(trip.id) ?? [] };
		weeks.set(start, [...(weeks.get(start) ?? []), lines]);
	}

	/** @param {number} start */
	const labelOf = (start) => {
		if (start === thisWeek) return 'This week';
		return start === lastWeek ? 'Last week' : `Week of ${formatDay(start)}`;
	};

	return [...weeks]
		.sort(([a], [b]) => b - a)
		.map(([start, group]) => ({
			start,
			label: labelOf(start),
			cost: tripCost(group.flatMap((lines) => lines.purchases)),
			trips: group
		}));
}
