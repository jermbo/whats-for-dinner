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
