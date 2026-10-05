import { daysAgo, id } from './keys';

/** @typedef {import('$lib/types').Ingredient} Ingredient */

const PERISHABLE = { perishable: true };
/** Have, low, or out: an ingredient that nobody measures. */
const STATE = { tracking: /** @type {const} */ ('state') };

/**
 * Key, name, category, unit, and options.
 * @type {[string, string, string, Ingredient['unit'], Partial<Ingredient>?][]}
 */
const ROWS = [
	['onion', 'Onion', 'Produce', 'count'],
	['garlic', 'Garlic cloves', 'Produce', 'count'],
	['potatoes', 'Potatoes', 'Produce', 'count'],
	['broccoli', 'Broccoli', 'Produce', 'g', PERISHABLE],
	['spinach', 'Spinach', 'Produce', 'g', PERISHABLE],
	['carrots', 'Carrots', 'Produce', 'count', PERISHABLE],
	['lemon', 'Lemons', 'Produce', 'count', PERISHABLE],
	['bananas', 'Bananas', 'Produce', 'count', PERISHABLE],
	['pepper', 'Bell peppers', 'Produce', 'count', PERISHABLE],

	['chicken', 'Chicken thighs', 'Meat and fish', 'g', PERISHABLE],
	['beef', 'Ground beef', 'Meat and fish', 'g', PERISHABLE],
	['fish', 'Fish fillets', 'Meat and fish', 'count', PERISHABLE],

	['eggs', 'Eggs', 'Dairy and eggs', 'count', { ...PERISHABLE, lowAt: 4 }],
	['milk', 'Milk', 'Dairy and eggs', 'ml', PERISHABLE],
	['butter', 'Butter', 'Dairy and eggs', 'g', PERISHABLE],
	['cheddar', 'Cheddar cheese', 'Dairy and eggs', 'g', PERISHABLE],
	['yogurt', 'Yogurt', 'Dairy and eggs', 'g', PERISHABLE],
	['cream', 'Cream', 'Dairy and eggs', 'ml', PERISHABLE],

	['bread', 'Bread slices', 'Bakery', 'count', PERISHABLE],
	['tortillas', 'Tortillas', 'Bakery', 'count'],

	['rice', 'Rice', 'Dry goods', 'g', { lowAt: 200 }],
	['spaghetti', 'Spaghetti', 'Dry goods', 'g'],
	['oats', 'Rolled oats', 'Dry goods', 'g'],
	['flour', 'Flour', 'Dry goods', 'g'],
	['sugar', 'Sugar', 'Dry goods', 'g'],
	['lentils', 'Red lentils', 'Dry goods', 'g'],
	['stock', 'Stock cubes', 'Dry goods', 'count'],

	['tomatoes', 'Canned tomatoes', 'Canned goods', 'g'],
	['beans', 'Canned black beans', 'Canned goods', 'count'],
	['coconut', 'Coconut milk', 'Canned goods', 'ml'],
	['tuna', 'Canned tuna', 'Canned goods', 'count'],

	['peas', 'Frozen peas', 'Frozen', 'g'],
	['berries', 'Frozen berries', 'Frozen', 'g'],
	['ice-cream', 'Ice cream', 'Frozen', 'ml'],

	['oil', 'Olive oil', 'Spices and oils', 'ml', STATE],
	['salt', 'Salt', 'Spices and oils', 'g', STATE],
	['black-pepper', 'Black pepper', 'Spices and oils', 'g', STATE],
	['soy', 'Soy sauce', 'Spices and oils', 'ml', STATE],
	['paprika', 'Paprika', 'Spices and oils', 'g', STATE],
	['cumin', 'Cumin', 'Spices and oils', 'g', STATE],
	['curry', 'Curry paste', 'Spices and oils', 'g', STATE],

	['tea', 'Tea bags', 'Drinks', 'count'],
	['coffee', 'Ground coffee', 'Drinks', 'g'],

	['peanut-butter', 'Peanut butter', 'Other', 'g'],
	['honey', 'Honey', 'Other', 'g', STATE],
	['mayonnaise', 'Mayonnaise', 'Other', 'g', STATE],
	['jam', 'Jam', 'Other', 'g', STATE]
];

/** @returns {Ingredient[]} */
export function sampleIngredients() {
	return ROWS.map(([key, name, category, unit, options]) => ({
		id: id(key),
		name,
		category,
		unit,
		tracking: 'quantity',
		perishable: false,
		updatedAt: daysAgo(30),
		...options
	}));
}
