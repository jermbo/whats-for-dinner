// The weekly audit: you walk the places one at a time, and you confirm or correct each food item.
// The places are where you walk, so the audit follows them: the places of the settings in their
// sequence, and then each other place that has food.

import type { FoodNote } from '../note';
import { withFood } from './empty-row';

export function auditPlaces(settingsPlaces: string[], foods: FoodNote[]): string[] {
	const withPackages = foods.flatMap((food) => withFood(food.item.stocks).map((stock) => stock.place));
	const others = [...new Set(withPackages)].filter((place) => !settingsPlaces.includes(place));
	return [...settingsPlaces, ...others.sort()];
}

// The audit starts at the place after the last place that it finished. After the last place, or
// with no place finished, it starts at the first.
export function startOf(places: string[], done: string): number {
	const at = places.indexOf(done);
	return at === -1 || at === places.length - 1 ? 0 : at + 1;
}

// The food items of one place: the food to check first, because a meal could not count it.
export function foodsIn(foods: FoodNote[], place: string): FoodNote[] {
	return foods
		.filter((food) => withFood(food.item.stocks).some((stock) => stock.place === place))
		.sort(
			(a, b) =>
				Number(b.item.check) - Number(a.item.check) || a.item.name.localeCompare(b.item.name)
		);
}
