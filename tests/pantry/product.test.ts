import { describe, expect, it } from 'vitest';
import type { FoodNote } from '../../src/note';
import { readFoodItem } from '../../src/pantry/food-item';
import { foodOfBarcode, productOf, proposedFoods, sizeOfProduct, sizeOfQuantity } from '../../src/pantry/product';

const food = (name: string, brands = ''): FoodNote => ({
	path: `Larder/Pantry/${name}.md`,
	item: readFoodItem(name, {}, `| Place | Left | Size | Use by |\n| - | - | - | - |\n\n## Brands\n\n${brands}\n`)
});

const BEANS = productOf('039400016045', {
	status: 1,
	product: {
		product_name: "Bush's Best Black Beans",
		brands: "Bush's Best, Bush Brothers",
		quantity: '15 oz (425 g)',
		image_front_url: 'https://images.openfoodfacts.org/beans.jpg'
	}
});

describe('the size of one package from the label', () => {
	it('"15 oz (425 g)" is "425 g": the pantry is metric', () => {
		expect(sizeOfQuantity('15 oz (425 g)')).toBe('425 g');
	});

	it('"1 L" is "1 l"', () => {
		expect(sizeOfQuantity('1 L')).toBe('1 l');
	});

	it('"33 cl" is "330 ml"', () => {
		expect(sizeOfQuantity('33 cl')).toBe('330 ml');
	});

	it('"16 OZ" is "454 g": a label in ounces becomes grams', () => {
		expect(sizeOfQuantity('16 OZ')).toBe('454 g');
	});

	it('"2 lb" is "907 g"', () => {
		expect(sizeOfQuantity('2 lb')).toBe('907 g');
	});

	it('"12 fl oz" is "355 ml"', () => {
		expect(sizeOfQuantity('12 fl oz')).toBe('355 ml');
	});

	it('"3 lbs" is "1.36 kg": from 1000, kilograms', () => {
		expect(sizeOfQuantity('3 lbs')).toBe('1.36 kg');
	});

	it('"0.5 kg" is "500 g"', () => {
		expect(sizeOfQuantity('0.5 kg')).toBe('500 g');
	});

	it('"6 x 330 ml" is not one package, so it gives no size', () => {
		expect(sizeOfQuantity('6 x 330 ml')).toBeNull();
	});
});

describe('the size of one package of a product', () => {
	it('the number of the database comes first: it is already in grams', () => {
		expect(sizeOfProduct('15 oz', 425, 'g')).toBe('425 g');
	});

	it('a number as text counts too', () => {
		expect(sizeOfProduct('', '750', 'ml')).toBe('750 ml');
	});

	it('with no number, the label gives the size', () => {
		expect(sizeOfProduct('16 oz', undefined, '')).toBe('454 g');
	});

	it('a multipack gives no size, because its number is the total of the pack', () => {
		expect(sizeOfProduct('6 x 330 ml', 1980, 'ml')).toBeNull();
	});
});

describe('the product of an answer of Open Food Facts', () => {
	it('gives the name, the first brand, the size, and the photo', () => {
		expect(BEANS).toMatchObject({
			name: "Bush's Best Black Beans",
			brand: "Bush's Best",
			size: '425 g',
			photo: 'https://images.openfoodfacts.org/beans.jpg',
			newName: 'Black Beans'
		});
	});

	it('an answer for a barcode that the database does not know is no product', () => {
		expect(productOf('0000', { status: 0 })).toBeNull();
	});
});

describe('the food item that a product can be', () => {
	it('"Bush\'s Best Black Beans" proposes "Black beans" before "Beans"', () => {
		const foods = [food('Beans'), food('Black beans'), food('Rice')];
		expect(proposedFoods(BEANS!, foods).map(({ item }) => item.name)).toEqual(['Black beans', 'Beans']);
	});

	it('a barcode on a brand finds its food item', () => {
		const foods = [food('Rice'), food('Black beans', "- Bush's · 039400016045")];
		expect(foodOfBarcode(foods, '039400016045')?.item.name).toBe('Black beans');
	});
});
