// The fixed choices of the app, with the text that the screens show.

/** @type {{ value: import('$lib/types').Unit, label: string }[]} */
export const UNITS = [
	{ value: 'g', label: 'Grams (g)' },
	{ value: 'ml', label: 'Milliliters (ml)' },
	{ value: 'count', label: 'Count' }
];

/** @type {{ value: import('$lib/types').Tracking, label: string }[]} */
export const TRACKING = [
	{ value: 'quantity', label: 'Quantity' },
	{ value: 'state', label: 'Have, low, or out' }
];

/** @type {{ value: import('$lib/types').StockState, label: string }[]} */
export const STOCK_STATES = [
	{ value: 'have', label: 'Have' },
	{ value: 'low', label: 'Low' },
	{ value: 'out', label: 'Out' }
];

/** @type {{ value: import('$lib/types').StorageLocation, label: string }[]} */
export const LOCATIONS = [
	{ value: 'fridge', label: 'Fridge' },
	{ value: 'freezer', label: 'Freezer' },
	{ value: 'pantry', label: 'Cupboard' }
];

/** The units as a short choice, for a card with little room. */
export const UNIT_CHOICES = /** @type {{ value: import('$lib/types').Unit, label: string }[]} */ ([
	{ value: 'g', label: 'Grams' },
	{ value: 'ml', label: 'Milliliters' },
	{ value: 'count', label: 'Pieces' }
]);

/** @type {{ value: import('$lib/types').MealType, label: string }[]} */
export const MEAL_TYPES = [
	{ value: 'breakfast', label: 'Breakfast' },
	{ value: 'lunch', label: 'Lunch' },
	{ value: 'dinner', label: 'Dinner' }
];

/**
 * The days of the week, in the sequence of a calendar that starts on Monday.
 * value: the day as "Date.getDay()" gives it, where 0 is Sunday.
 */
export const WEEKDAYS = [
	{ value: 1, label: 'Monday' },
	{ value: 2, label: 'Tuesday' },
	{ value: 3, label: 'Wednesday' },
	{ value: 4, label: 'Thursday' },
	{ value: 5, label: 'Friday' },
	{ value: 6, label: 'Saturday' },
	{ value: 0, label: 'Sunday' }
];

export const MEAL_FILTERS = [{ value: 'all', label: 'All meals' }, ...MEAL_TYPES];

export const CATEGORIES = [
	'Produce',
	'Meat and fish',
	'Dairy and eggs',
	'Bakery',
	'Dry goods',
	'Canned goods',
	'Frozen',
	'Spices and oils',
	'Drinks',
	'Other'
];

/**
 * @param {{ value: string, label: string }[]} options
 * @param {string} value
 */
export function labelOf(options, value) {
	return options.find((option) => option.value === value)?.label ?? value;
}
