/**
 * @typedef {import('$lib/types').Product} Product
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {Omit<Product, 'updatedAt'>} ProductDraft A product before it is stored. A new one has no ID.
 */

/**
 * @param {string} ingredientId
 * @param {string | null} [barcode]
 * @returns {ProductDraft}
 */
export function blankProduct(ingredientId, barcode = null) {
	return { id: '', ingredientId, name: '', quantity: 0, photoId: null, barcode };
}

/**
 * The products of each ingredient. The product of the newest purchase is first, so that the
 * usual product is the first photo on a row. A purchase in the cart does not count: the
 * photos must not change place while the owner selects one.
 * @param {Product[]} products
 * @param {Purchase[]} purchases
 * @returns {Map<string, Product[]>} By ingredient ID.
 */
export function productsByIngredient(products, purchases) {
	/** @type {Map<string, string>} The time of the newest purchase of each product. */
	const newest = new Map();
	for (const { productId, cartAt, putAwayAt } of purchases) {
		if (productId && putAwayAt && cartAt > (newest.get(productId) ?? '')) {
			newest.set(productId, cartAt);
		}
	}
	/** A product with no purchase is as new as its record. */
	const at = (/** @type {Product} */ product) => newest.get(product.id) ?? product.updatedAt;

	/** @type {Map<string, Product[]>} */
	const groups = new Map();
	for (const product of products.toSorted((a, b) => at(b).localeCompare(at(a)))) {
		groups.set(product.ingredientId, [...(groups.get(product.ingredientId) ?? []), product]);
	}
	return groups;
}
