import { db } from '$lib/db/db';
import { newId, now } from '$lib/util/ids';

/**
 * @typedef {import('$lib/types').Product} Product
 * @typedef {import('$lib/domain/products').ProductDraft} ProductDraft
 * @typedef {{ name: string, quantity: number | null }} ProductInfo
 */

const API = 'https://world.openfoodfacts.org/api/v2/product';

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
