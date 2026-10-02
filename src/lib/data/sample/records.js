/**
 * The sample records. Each ID starts with "sample-", so that the app can remove them again.
 *
 * @typedef {import('$lib/types').Ingredient} Ingredient
 * @typedef {import('$lib/types').Recipe} Recipe
 * @typedef {import('$lib/types').PantryItem} PantryItem
 * @typedef {import('$lib/types').MenuItem} MenuItem
 * @typedef {import('$lib/types').CookSession} CookSession
 */

export const SAMPLE_PREFIX = 'sample-';

const DAY = 24 * 60 * 60 * 1000;

/** @param {string} name */
const id = (name) => `${SAMPLE_PREFIX}${name}`;

/** @param {number} days */
const daysAgo = (days) => new Date(Date.now() - days * DAY).toISOString();

/**
 * @param {string} key
 * @param {string} name
 * @param {string} category
 * @param {Ingredient['unit']} unit
 * @param {Partial<Ingredient>} [options]
 * @returns {Ingredient}
 */
function ingredient(key, name, category, unit, options = {}) {
	return {
		id: id(key),
		name,
		category,
		unit,
		tracking: 'quantity',
		perishable: false,
		updatedAt: daysAgo(0),
		...options
	};
}

/**
 * @param {string} key
 * @param {string} name
 * @param {Recipe['mealType']} mealType
 * @param {[string, number][]} rows Ingredient key and quantity.
 * @param {Partial<Recipe>} [options]
 * @returns {Recipe}
 */
function recipe(key, name, mealType, rows, options = {}) {
	return {
		id: id(key),
		name,
		mealType,
		servings: 2,
		steps: '',
		source: '',
		inRotation: false,
		ingredients: rows.map(([ingredientKey, quantity]) => ({
			ingredientId: id(ingredientKey),
			quantity
		})),
		prepSteps: [],
		createdAt: daysAgo(30),
		updatedAt: daysAgo(30),
		...options
	};
}

/**
 * @param {string} key Ingredient key.
 * @param {number} quantity
 * @param {PantryItem['location']} location
 * @param {PantryItem['state']} [state]
 * @returns {PantryItem}
 */
function stock(key, quantity, location, state = 'have') {
	return {
		id: id(`pantry-${key}`),
		ingredientId: id(key),
		quantity,
		fullQuantity: quantity,
		state,
		location,
		updatedAt: daysAgo(0)
	};
}

/**
 * @param {string} recipeKey
 * @returns {MenuItem}
 */
function menuItem(recipeKey) {
	return {
		id: id(`menu-${recipeKey}`),
		kind: 'recipe',
		recipeId: id(recipeKey),
		addedAt: daysAgo(0),
		prepDoneAt: null,
		updatedAt: daysAgo(0)
	};
}

/**
 * @param {Recipe} cooked
 * @param {number} days
 * @param {number} rating
 * @param {string} note
 * @returns {CookSession}
 */
function session(cooked, days, rating, note) {
	const key = cooked.id.slice(SAMPLE_PREFIX.length);
	return {
		id: id(`session-${key}`),
		recipeId: cooked.id,
		recipeName: cooked.name,
		kind: 'recipe',
		menuItem: { ...menuItem(key), id: id(`menu-old-${key}`), addedAt: daysAgo(days + 2) },
		cookedAt: daysAgo(days),
		rating,
		note,
		deductions: [],
		leftoverMenuId: null,
		updatedAt: daysAgo(days)
	};
}

export function sampleRecords() {
	const ingredients = [
		ingredient('chicken', 'Chicken thighs', 'Meat and fish', 'g', { perishable: true }),
		ingredient('broccoli', 'Broccoli', 'Produce', 'g', { perishable: true }),
		ingredient('onion', 'Onion', 'Produce', 'count'),
		ingredient('garlic', 'Garlic cloves', 'Produce', 'count'),
		ingredient('eggs', 'Eggs', 'Dairy and eggs', 'count', { perishable: true }),
		ingredient('milk', 'Milk', 'Dairy and eggs', 'ml', { perishable: true }),
		ingredient('cheddar', 'Cheddar cheese', 'Dairy and eggs', 'g', { perishable: true }),
		ingredient('bread', 'Bread slices', 'Bakery', 'count', { perishable: true }),
		ingredient('tortillas', 'Tortillas', 'Bakery', 'count'),
		ingredient('rice', 'Rice', 'Dry goods', 'g'),
		ingredient('spaghetti', 'Spaghetti', 'Dry goods', 'g'),
		ingredient('oats', 'Rolled oats', 'Dry goods', 'g'),
		ingredient('tomatoes', 'Canned tomatoes', 'Canned goods', 'g'),
		ingredient('beans', 'Canned black beans', 'Canned goods', 'g'),
		ingredient('oil', 'Olive oil', 'Spices and oils', 'ml', { tracking: 'state' }),
		ingredient('salt', 'Salt', 'Spices and oils', 'g', { tracking: 'state' }),
		ingredient('soy', 'Soy sauce', 'Spices and oils', 'ml', { tracking: 'state' })
	];

	const chickenBowl = recipe(
		'chicken-bowl',
		'Chicken and rice bowl',
		'dinner',
		[
			['chicken', 500],
			['rice', 300],
			['broccoli', 300],
			['garlic', 2],
			['soy', 0]
		],
		{
			inRotation: true,
			prepSteps: [
				{ text: 'Move the chicken thighs from the freezer to the refrigerator', leadHours: 24 }
			],
			steps: 'Cook the rice.\nFry the chicken with the garlic.\nSteam the broccoli.\nAdd soy sauce.'
		}
	);

	const spaghetti = recipe(
		'spaghetti',
		'Spaghetti with tomato sauce',
		'dinner',
		[
			['spaghetti', 250],
			['tomatoes', 400],
			['onion', 1],
			['garlic', 2],
			['oil', 0],
			['salt', 0]
		],
		{
			inRotation: true,
			source: 'https://example.com/spaghetti-with-tomato-sauce',
			steps: 'Fry the onion and the garlic in oil.\nAdd the tomatoes.\nBoil the spaghetti.'
		}
	);

	const scrambledEggs = recipe('scrambled-eggs', 'Scrambled eggs on toast', 'breakfast', [
		['eggs', 4],
		['bread', 2],
		['salt', 0]
	]);

	const recipes = [
		chickenBowl,
		spaghetti,
		scrambledEggs,
		recipe(
			'overnight-oats',
			'Overnight oats',
			'breakfast',
			[
				['oats', 100],
				['milk', 250]
			],
			{
				prepSteps: [
					{ text: 'Mix the oats and the milk. Put them in the refrigerator', leadHours: 8 }
				]
			}
		),
		recipe('quesadillas', 'Cheese and bean quesadillas', 'lunch', [
			['tortillas', 4],
			['cheddar', 150],
			['beans', 200]
		]),
		recipe('fried-rice', 'Egg fried rice', 'lunch', [
			['rice', 200],
			['eggs', 2],
			['onion', 1],
			['soy', 0]
		]),
		// A reference recipe: a source, but no ingredient list.
		recipe('beef-stew', 'Beef stew', 'dinner', [], { source: 'The Family Cookbook, page 112' })
	];

	const pantry = [
		stock('chicken', 500, 'freezer'),
		stock('eggs', 6, 'fridge'),
		stock('rice', 1000, 'pantry'),
		stock('spaghetti', 500, 'pantry'),
		stock('oats', 500, 'pantry'),
		stock('tomatoes', 400, 'pantry'),
		stock('beans', 400, 'pantry'),
		stock('onion', 3, 'pantry'),
		stock('garlic', 4, 'pantry'),
		stock('oil', 0, 'pantry', 'have'),
		stock('salt', 0, 'pantry', 'have'),
		stock('soy', 0, 'pantry', 'low')
	];

	return {
		ingredients,
		recipes,
		pantry,
		menu: [menuItem('chicken-bowl'), menuItem('spaghetti'), menuItem('overnight-oats')],
		sessions: [
			session(chickenBowl, 13, 5, 'Very good. Use more garlic the next time.'),
			session(spaghetti, 6, 4, 'Fast and easy.'),
			session(scrambledEggs, 3, 3, '')
		],
		products: [
			{
				barcode: '8076800195057',
				name: 'Barilla Spaghetti n.5',
				ingredientId: id('spaghetti'),
				quantity: 500,
				updatedAt: daysAgo(0)
			}
		],
		shopping: [
			{
				id: id('shopping-paper-towels'),
				name: 'Paper towels',
				ingredientId: null,
				quantity: 1,
				updatedAt: daysAgo(0)
			}
		]
	};
}
