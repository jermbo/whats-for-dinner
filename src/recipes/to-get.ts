// The food of a recipe that you must get or check, in the sequence of the open recipe: what you
// have none of first, then what is low, then what the plugin cannot count.

import type { IngredientMatch, Status } from '../match/match';

const sequence: Status[] = ['missing', 'short', 'unknown'];

export function toGetFirst(ingredients: IngredientMatch[]): IngredientMatch[] {
	return ingredients
		.filter((one) => one.status !== 'enough')
		.sort((a, b) => sequence.indexOf(a.status) - sequence.indexOf(b.status));
}
