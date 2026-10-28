// A product is what a food database knows of a barcode: a name, a brand, a package size, and a
// photo. The pantry does not keep products. It keeps food items with brands, so this file turns a
// product into the facts of "Add to pantry".

import { nameKey } from '../match/names';
import type { FoodNote } from '../note';
import type { FoodItem } from './types';
import { entryOf } from './unit-list';

export type Product = {
	barcode: string;
	// As the label has it: "Bush's Best Black Beans".
	name: string;
	// The first brand of the label, or no text.
	brand: string;
	// A size that the unit list permits, such as "425 g", or null.
	size: string | null;
	// The address of the front photo, or null.
	photo: string | null;
	// A name for a new food item: the common name of the product when the database has it.
	newName: string;
};

// The fields that the lookup asks for. The answer of Open Food Facts has them in `product`.
export const PRODUCT_FIELDS = ['product_name', 'generic_name', 'brands', 'quantity', 'image_front_url'];

const textOf = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

// The product in an answer of Open Food Facts, or null when the database does not know the barcode.
export function productOf(barcode: string, answer: unknown): Product | null {
	if (!answer || typeof answer !== 'object') return null;
	const { status, product } = answer as { status?: unknown; product?: Record<string, unknown> };
	if (status !== 1 || !product) return null;
	const name = textOf(product.product_name) || textOf(product.generic_name);
	if (!name) return null;
	const brand = textOf(product.brands).split(',')[0].trim();
	const common = textOf(product.generic_name);
	return {
		barcode,
		name,
		brand,
		size: sizeOfQuantity(textOf(product.quantity)),
		photo: textOf(product.image_front_url) || null,
		newName: capital(common || withoutBrand(name, brand))
	};
}

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// "Bush's Best Black Beans" with the brand "Bush's" is "Best Black Beans". You change the rest.
function withoutBrand(name: string, brand: string) {
	if (!brand || !name.toLowerCase().startsWith(brand.toLowerCase())) return name;
	return name.slice(brand.length).trim() || name;
}

const METRIC = /(\d+(?:[.,]\d+)?)\s*(kg|g|cl|ml|l)\b/i;
const IMPERIAL = /(\d+(?:[.,]\d+)?)\s*(fl\.?\s*oz|oz|lbs?)\b/i;

// The size of one package, from the quantity of the label. The pantry is metric, so a label with
// two units gives its metric part: "15 oz (425 g)" is "425 g". A multipack, such as "6 x 330 ml",
// is not one package, so it gives no size.
export function sizeOfQuantity(quantity: string): string | null {
	if (!quantity || /\d\s*[x×]\s*\d/i.test(quantity)) return null;
	const metric = METRIC.exec(quantity);
	const found = metric ?? IMPERIAL.exec(quantity);
	if (!found) return null;
	let value = Number(found[1].replace(',', '.'));
	let unit = found[2].toLowerCase().replace(/\s+/g, ' ').replace('.', '');
	if (unit === 'cl') [value, unit] = [value * 10, 'ml'];
	if (unit === 'lbs') unit = 'lb';
	const size = `${Number(value.toFixed(2))} ${unit}`;
	return entryOf(size) === size ? size : null;
}

// The food items that a product can be: each food item whose name, or a different name, is in the
// name of the product, as whole words. The longest name comes first, so "Black beans" comes before
// "Beans".
export function proposedFoods(product: Product, foods: FoodNote[]): FoodNote[] {
	const label = ` ${nameKey(`${product.name} ${product.newName}`)} `;
	const lengthIn = ({ item }: FoodNote) => {
		const found = namesOf(item)
			.map(nameKey)
			.filter((key) => key && label.includes(` ${key} `));
		return Math.max(0, ...found.map((key) => key.length));
	};
	return foods
		.map((food) => ({ food, length: lengthIn(food) }))
		.filter(({ length }) => length > 0)
		.sort((a, b) => b.length - a.length || a.food.item.name.localeCompare(b.food.item.name))
		.slice(0, 3)
		.map(({ food }) => food);
}

const namesOf = (item: FoodItem) => [item.name, ...item.aliases];

// The food item with a brand that has this barcode, or null.
export function foodOfBarcode(foods: FoodNote[], barcode: string): FoodNote | null {
	return foods.find(({ item }) => item.brands.some((brand) => brand.barcode === barcode)) ?? null;
}
