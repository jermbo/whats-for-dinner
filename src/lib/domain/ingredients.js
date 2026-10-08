/** @returns {import('$lib/types').Ingredient} */
export function blankIngredient() {
	return {
		id: '',
		name: '',
		category: 'Other',
		unit: 'g',
		tracking: 'quantity',
		perishable: false,
		updatedAt: ''
	};
}

/**
 * True when two names are the same name. Capital letters make no difference.
 * @param {string} a
 * @param {string} b
 */
export function sameName(a, b) {
	return a.toLowerCase() === b.toLowerCase();
}

/**
 * The item of a list that has a name: an ingredient, or a row of a list.
 * @template {{ name: string }} T
 * @param {T[]} list
 * @param {string} name
 * @returns {T | undefined}
 */
export function findByName(list, name) {
	return list.find((item) => sameName(item.name, name));
}
