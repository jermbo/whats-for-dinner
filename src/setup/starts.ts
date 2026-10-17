// What the places step and the first-food step start with. Most kitchens start from a pantry, a
// fridge, and a freezer, and you change the list to fit yours.

export const FIRST_PLACES = ['Kitchen pantry', 'Fridge', 'Freezer'];

export const MORE_PLACES = ['Downstairs pantry', 'Secondary pantry', 'Garage freezer'];

// "Place for new food" starts as the kitchen pantry. With no kitchen pantry, you select one.
export const firstNewPlace = (places: string[]) =>
	places.includes('Kitchen pantry') ? 'Kitchen pantry' : '';

// Food that most kitchens have. A tap and an amount add it.
export const STAPLES = [
	'Rice',
	'Eggs',
	'Milk',
	'Flour',
	'Salt',
	'Sugar',
	'Butter',
	'Pasta',
	'Olive oil',
	'Onions',
	'Garlic',
	'Potatoes'
];
