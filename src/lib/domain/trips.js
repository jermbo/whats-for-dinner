import { round } from '$lib/util/format';
import { inTapOrder } from './cart';

/**
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {{ total: number, lines: number, noPrice: number }} TripCost
 *   total: the sum of the lines that have a price. noPrice: the number of lines with no price.
 */

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
	for (const purchase of inTapOrder(purchases)) {
		if (purchase.productId && purchase.price !== null) {
			prices.set(purchase.productId, purchase.price);
		}
	}
	return prices;
}
