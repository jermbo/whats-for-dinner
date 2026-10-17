// The places of the kitchen: the list of names in the data file, and each place that a row has. A
// place needs a name before food is there, so the list names places that no row has yet.

import type { FoodItem } from './types';

const sameName = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

// The names of the list and the places of the rows, each one time, from A to Z.
export function placesOf(list: string[], foods: { item: FoodItem }[]): string[] {
	const rows = foods.flatMap(({ item }) => item.stocks.map((stock) => stock.place));
	return [...new Set([...list, ...rows])].sort();
}

// A name that the list has already, in other capitals or not, does not go in a second time.
export function addPlace(list: string[], name: string): string[] {
	const text = name.trim();
	return !text || list.some((other) => sameName(other, text)) ? list : [...list, text];
}

export function renamePlace(list: string[], old: string, name: string): string[] {
	const text = name.trim();
	if (!text || list.some((other) => other !== old && sameName(other, text))) return list;
	return list.map((other) => (other === old ? text : other));
}

// The list keeps one name at the minimum: put away and add food need a place.
export function removePlace(list: string[], name: string): string[] {
	return list.length > 1 ? list.filter((other) => other !== name) : list;
}
