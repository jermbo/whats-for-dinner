/**
 * The cart is not a table. It is the purchases that are not put away. The item of the last
 * tap is first.
 * @param {import('$lib/types').Purchase[]} purchases
 */
export function cartOf(purchases) {
	return purchases
		.filter((purchase) => !purchase.putAwayAt)
		.sort((a, b) => b.cartAt.localeCompare(a.cartAt));
}

/** The button for the packages goes back to one after this number. */
const MAX_PACKAGES = 6;

/**
 * The number of packages that the button for the packages sets next: 2, 3, and so on, then 1.
 * @param {number} packages
 */
export function nextPackages(packages) {
	return packages >= MAX_PACKAGES ? 1 : packages + 1;
}
