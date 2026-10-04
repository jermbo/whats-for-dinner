import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';
import { round } from '$lib/util/format';

/**
 * @typedef {import('$lib/types').Trip} Trip
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {{ total: number, lines: number, noPrice: number }} TripCost
 *   total: the sum of the lines that have a price. noPrice: the number of lines with no price.
 */

/**
 * The trip that is open. There is one open trip at a time.
 * @returns {Promise<Trip | undefined>}
 */
function openTrip() {
	return db.trips.filter((trip) => !trip.completedAt).first();
}

/**
 * The open trip. The first tap in the store starts it. Call it in a transaction.
 * @returns {Promise<Trip>}
 */
export async function openOrStartTrip() {
	const open = await openTrip();
	if (open) return open;

	const time = now();
	/** @type {Trip} */
	const trip = { id: newId(), startedAt: time, completedAt: null, updatedAt: time };
	await db.trips.add(trip);
	return trip;
}

/**
 * The cart is not a table. It is a question to the purchases: which are not put away?
 * They are all in the open trip.
 * @returns {Promise<Purchase[]>} Oldest first.
 */
export async function cartPurchases() {
	const trip = await openTrip();
	if (!trip) return [];
	const purchases = await db.purchases.where('tripId').equals(trip.id).toArray();
	return purchases
		.filter((purchase) => !purchase.putAwayAt)
		.sort((a, b) => a.cartAt.localeCompare(b.cartAt));
}

/**
 * Ends a trip when its cart is empty. A trip with no purchases is removed: it was a tap and
 * its undo. Call it in a transaction, after a change to the purchases of the trip.
 * @param {string} tripId
 */
export async function settleTrip(tripId) {
	const purchases = await db.purchases.where('tripId').equals(tripId).toArray();
	if (purchases.length === 0) return db.trips.delete(tripId);
	if (purchases.some((purchase) => !purchase.putAwayAt)) return;

	const time = now();
	await db.trips.update(tripId, { completedAt: time, updatedAt: time });
}

/**
 * The cost of a trip: the sum of all lines that have a price. The price is for one package.
 * @param {Purchase[]} purchases The purchases of one trip.
 * @returns {TripCost}
 */
export function tripCost(purchases) {
	let total = 0;
	let noPrice = 0;
	for (const purchase of purchases) {
		if (purchase.price === null) noPrice += 1;
		else total += purchase.price * purchase.packages;
	}
	return { total: round(total), lines: purchases.length, noPrice };
}

/**
 * The last price of each product: the price of its newest purchase that has one.
 * @param {Purchase[]} purchases
 * @returns {Map<string, number>} By product ID.
 */
export function lastPrices(purchases) {
	/** @type {Map<string, number>} */
	const prices = new Map();
	for (const purchase of purchases.toSorted((a, b) => a.cartAt.localeCompare(b.cartAt))) {
		if (purchase.productId && purchase.price !== null) {
			prices.set(purchase.productId, purchase.price);
		}
	}
	return prices;
}
