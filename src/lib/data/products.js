import { db } from '$lib/db/db';
import { newId, now } from '$lib/db/ids';

/**
 * @typedef {import('$lib/types').Product} Product
 * @typedef {import('$lib/types').Purchase} Purchase
 * @typedef {Omit<Product, 'updatedAt'>} ProductDraft A product before it is stored. A new one has no ID.
 * @typedef {{ name: string, quantity: number | null }} ProductInfo
 */

const API = 'https://world.openfoodfacts.org/api/v2/product';

/**
 * @param {string} ingredientId
 * @param {string | null} [barcode]
 * @returns {ProductDraft}
 */
export function blankProduct(ingredientId, barcode = null) {
	return { id: '', ingredientId, name: '', quantity: 0, photoId: null, barcode };
}

/**
 * A product that the owner scanned before. Works with no connection.
 * @param {string} barcode
 */
export function findProduct(barcode) {
	return db.products.where('barcode').equals(barcode).first();
}

/**
 * Asks Open Food Facts for the name and the package size. Needs a connection.
 * @param {string} barcode
 * @returns {Promise<ProductInfo | null>} Null when the product is not found or there is no connection.
 */
export async function lookupProduct(barcode) {
	try {
		const fields = 'product_name,brands,product_quantity';
		const response = await fetch(`${API}/${encodeURIComponent(barcode)}.json?fields=${fields}`);
		if (!response.ok) return null;

		const { status, product } = await response.json();
		if (status !== 1 || !product) return null;

		return {
			name: [product.brands, product.product_name].filter(Boolean).join(' '),
			quantity: Number(product.product_quantity) || null
		};
	} catch {
		return null;
	}
}

/**
 * Stores a product. A new product gets its ID here.
 * @param {ProductDraft} product
 * @returns {Promise<Product>}
 */
export async function saveProduct(product) {
	const record = {
		...product,
		id: product.id || newId(),
		name: product.name.trim(),
		barcode: product.barcode || null,
		updatedAt: now()
	};
	await db.products.put(record);
	return record;
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
