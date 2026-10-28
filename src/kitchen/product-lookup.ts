import { requestUrl } from 'obsidian';
import { PRODUCT_FIELDS, productOf, type Product } from '../pantry/product';

// The one request of the plugin to the internet. Only the barcode number goes out, and nothing of
// the vault. Open Food Facts is free and open, and it needs no key, so the plugin has no secret.
// It asks each app for a User-Agent with its name and a way to reach its maker.
const PRODUCTS = 'https://world.openfoodfacts.org/api/v2/product';
const AGENT = 'WhatsForDinner (https://github.com/jermbo/whats-for-dinner)';

// The product of a barcode, or null: with no connection, the answer is null too, and you type.
export async function lookUpProduct(barcode: string): Promise<Product | null> {
	try {
		const answer = await requestUrl({
			url: `${PRODUCTS}/${encodeURIComponent(barcode)}.json?fields=${PRODUCT_FIELDS.join(',')}`,
			headers: { 'User-Agent': AGENT },
			throw: false
		});
		return answer.status === 200 ? productOf(barcode, answer.json) : null;
	} catch {
		return null;
	}
}

// The front photo of a product, or null. A brand with no photo is still a brand.
export async function productPhoto(address: string): Promise<Blob | null> {
	try {
		const answer = await requestUrl({ url: address, headers: { 'User-Agent': AGENT }, throw: false });
		if (answer.status !== 200) return null;
		return new Blob([answer.arrayBuffer], { type: answer.headers['content-type'] ?? 'image/jpeg' });
	} catch {
		return null;
	}
}
