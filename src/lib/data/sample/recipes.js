import { daysAgo, id } from './keys';

/** @typedef {import('$lib/types').Recipe} Recipe */

/**
 * @param {string} key
 * @param {string} name
 * @param {Recipe['mealType']} mealType
 * @param {[string, number][]} rows Ingredient key and quantity. A 'state' ingredient has 0.
 * @param {Partial<Omit<Recipe, 'steps'>> & { steps?: string[] }} [options]
 * @returns {Recipe}
 */
function recipe(key, name, mealType, rows, { steps = [], ...options } = {}) {
	return {
		id: id(key),
		name,
		mealType,
		servings: 2,
		steps: steps.join('\n'),
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

const BREAKFASTS = () => [
	recipe(
		'scrambled-eggs',
		'Scrambled eggs on toast',
		'breakfast',
		[
			['eggs', 4],
			['bread', 2],
			['butter', 20],
			['salt', 0]
		],
		{
			inRotation: true,
			steps: [
				'Toast the bread slices.',
				'Melt the butter in a pan.',
				'Beat the eggs with salt. Stir them in the pan for 2 minutes.',
				'Put the eggs on the toast.'
			]
		}
	),
	recipe(
		'overnight-oats',
		'Overnight oats',
		'breakfast',
		[
			['oats', 100],
			['milk', 250],
			['berries', 50],
			['honey', 0]
		],
		{
			prepSteps: [
				{ text: 'Mix the rolled oats and the milk. Put them in the refrigerator', leadHours: 8 }
			],
			steps: ['Add the frozen berries and honey.']
		}
	),
	recipe(
		'pancakes',
		'Pancakes',
		'breakfast',
		[
			['flour', 250],
			['milk', 300],
			['eggs', 2],
			['butter', 30],
			['sugar', 20]
		],
		{
			servings: 4,
			steps: [
				'Mix the flour and the sugar.',
				'Add the eggs and the milk. Stir until the batter is smooth.',
				'Let the batter rest for 10 minutes.',
				'Melt butter in a pan. Fry each pancake for 2 minutes on each side.'
			]
		}
	),
	recipe(
		'banana-smoothie',
		'Banana smoothie',
		'breakfast',
		[
			['bananas', 2],
			['milk', 250],
			['yogurt', 150],
			['honey', 0]
		],
		{
			steps: [
				'Put the bananas, the milk, the yogurt, and honey in a blender.',
				'Blend for 1 minute.'
			]
		}
	)
];

const LUNCHES = () => [
	recipe(
		'quesadillas',
		'Cheese and bean quesadillas',
		'lunch',
		[
			['tortillas', 4],
			['cheddar', 150],
			['beans', 1],
			['oil', 0]
		],
		{
			steps: [
				'Grate the cheddar cheese. Drain the canned black beans.',
				'Put cheese and beans on 2 tortillas. Put the other tortillas on top.',
				'Fry each quesadilla in olive oil for 3 minutes on each side.'
			]
		}
	),
	recipe(
		'fried-rice',
		'Egg fried rice',
		'lunch',
		[
			['rice', 200],
			['eggs', 2],
			['onion', 1],
			['peas', 100],
			['soy', 0],
			['oil', 0]
		],
		{
			inRotation: true,
			steps: [
				'Boil the rice for 12 minutes. Let it cool.',
				'Cut the onion. Fry it in olive oil for 3 minutes.',
				'Add the rice and the frozen peas. Fry for 5 minutes.',
				'Make a space in the pan. Scramble the eggs in it.',
				'Mix all. Add soy sauce.'
			]
		}
	),
	recipe(
		'tuna-melt',
		'Tuna melt',
		'lunch',
		[
			['bread', 4],
			['tuna', 1],
			['cheddar', 60],
			['mayonnaise', 0]
		],
		{
			steps: [
				'Mix the canned tuna with mayonnaise.',
				'Put the mix on 2 bread slices. Add the cheddar cheese and the other slices.',
				'Fry each sandwich for 3 minutes on each side.'
			]
		}
	)
];

const DINNERS = () => [
	recipe(
		'chicken-bowl',
		'Chicken and rice bowl',
		'dinner',
		[
			['chicken', 500],
			['rice', 300],
			['broccoli', 300],
			['garlic', 2],
			['soy', 0],
			['oil', 0]
		],
		{
			inRotation: true,
			prepSteps: [
				{ text: 'Move the chicken thighs from the freezer to the refrigerator', leadHours: 24 }
			],
			steps: [
				'Boil the rice for 12 minutes.',
				'Cut the chicken thighs into pieces. Fry them in olive oil for 8 minutes.',
				'Add the garlic cloves. Fry for 1 minute.',
				'Steam the broccoli for 5 minutes.',
				'Put all in a bowl. Add soy sauce.'
			]
		}
	),
	recipe(
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
			steps: [
				'Cut the onion and the garlic cloves. Fry them in olive oil for 5 minutes.',
				'Add the canned tomatoes and salt. Simmer for 15 minutes.',
				'Boil the spaghetti for 10 minutes.',
				'Mix the spaghetti with the sauce.'
			]
		}
	),
	recipe(
		'lentil-soup',
		'Lentil soup',
		'dinner',
		[
			['lentils', 200],
			['carrots', 2],
			['onion', 1],
			['tomatoes', 400],
			['cumin', 0],
			['oil', 0],
			['salt', 0]
		],
		{
			servings: 4,
			steps: [
				'Cut the onion and the carrots. Fry them in olive oil for 5 minutes.',
				'Add cumin. Fry for 1 minute.',
				'Add the red lentils, the canned tomatoes, and 1 liter of water.',
				'Simmer for 25 minutes. Add salt.'
			]
		}
	),
	recipe(
		'beef-chili',
		'Beef chili',
		'dinner',
		[
			['beef', 500],
			['beans', 2],
			['tomatoes', 800],
			['onion', 1],
			['garlic', 3],
			['pepper', 2],
			['paprika', 0],
			['cumin', 0],
			['oil', 0]
		],
		{
			servings: 4,
			prepSteps: [
				{ text: 'Move the ground beef from the freezer to the refrigerator', leadHours: 12 }
			],
			steps: [
				'Cut the onion, the garlic cloves, and the bell peppers.',
				'Fry the ground beef in olive oil for 8 minutes.',
				'Add the onion, the garlic, and the bell peppers. Fry for 5 minutes.',
				'Add paprika, cumin, the canned tomatoes, and the canned black beans.',
				'Simmer for 40 minutes.'
			]
		}
	),
	recipe(
		'coconut-curry',
		'Coconut chicken curry',
		'dinner',
		[
			['chicken', 500],
			['coconut', 400],
			['onion', 1],
			['garlic', 2],
			['spinach', 100],
			['rice', 300],
			['curry', 0],
			['oil', 0]
		],
		{
			servings: 4,
			source: 'The Family Cookbook, page 58',
			prepSteps: [
				{ text: 'Move the chicken thighs from the freezer to the refrigerator', leadHours: 24 }
			],
			steps: [
				'Boil the rice for 12 minutes.',
				'Cut the onion and the garlic cloves. Fry them in olive oil for 4 minutes.',
				'Add curry paste and the chicken thighs. Fry for 6 minutes.',
				'Add the coconut milk. Simmer for 20 minutes.',
				'Add the spinach. Stir for 2 minutes.'
			]
		}
	),
	recipe(
		'baked-fish',
		'Baked fish with potatoes',
		'dinner',
		[
			['fish', 2],
			['potatoes', 4],
			['lemon', 1],
			['butter', 30],
			['salt', 0],
			['black-pepper', 0]
		],
		{
			steps: [
				'Heat the oven to 200 °C.',
				'Cut the potatoes. Bake them for 20 minutes.',
				'Put the fish fillets on the potatoes. Add the butter, salt, and black pepper.',
				'Bake for 15 minutes. Add juice from the lemons.'
			]
		}
	),
	// Reference recipes: a source, but no ingredient list.
	recipe('beef-stew', 'Beef stew', 'dinner', [], { source: 'The Family Cookbook, page 112' }),
	recipe('roast-chicken', 'Roast chicken with vegetables', 'dinner', [], {
		servings: 4,
		source: 'https://example.com/roast-chicken'
	})
];

/** @returns {Recipe[]} */
export function sampleRecipes() {
	return [...BREAKFASTS(), ...LUNCHES(), ...DINNERS()];
}
