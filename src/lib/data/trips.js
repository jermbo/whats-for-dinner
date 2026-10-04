import { db } from '$lib/db/db';
import { newId, now } from '$lib/util/ids';

/**
 * @typedef {import('$lib/types').Trip} Trip
 * @typedef {import('$lib/types').Purchase} Purchase
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
