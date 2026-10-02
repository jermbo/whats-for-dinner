import { db } from '$lib/db/db';
import { now } from '$lib/db/ids';

/**
 * @typedef {import('$lib/types').Product} Product
 * @typedef {{ name: string, quantity: number | null }} ProductInfo
 */

const API = 'https://world.openfoodfacts.org/api/v2/product';

/**
 * A product that the owner scanned before. Works with no connection.
 * @param {string} barcode
 */
export function findProduct(barcode) {
	return db.products.get(barcode);
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
 * Remembers the link from a barcode to an ingredient.
 * @param {Omit<Product, 'updatedAt'>} product
 */
export function saveProduct(product) {
	return db.products.put({ ...product, updatedAt: now() });
}
