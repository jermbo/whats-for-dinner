// The notes that the field "Add an item" proposes while you type: the food items of the pantry,
// by their name and their other names, and the notes of the items folder. A proposal is a note, so
// the task of the item gets an exact link.

import type { FoodNote } from '../note';

export type Proposal = { path: string; name: string };

// The field is small, and the best proposals are sufficient.
const MOST = 5;

export function proposalsFor(text: string, foods: FoodNote[], itemPaths: string[]): Proposal[] {
	const words = text.trim().toLowerCase();
	if (!words) return [];

	const has = (name: string) => name.toLowerCase().includes(words);
	const fromPantry = foods
		.filter(({ item }) => [item.name, ...item.aliases].some(has))
		.map(({ path, item }) => ({ path, name: item.name }));
	const fromItems = itemPaths
		.map((path) => ({ path, name: path.replace(/^.*\//, '').replace(/\.md$/, '') }))
		.filter(({ name }) => has(name));

	// A name that starts with the text comes before a name that only has it.
	const starts = (name: string) => Number(name.toLowerCase().startsWith(words));
	return [...fromPantry, ...fromItems]
		.sort((a, b) => starts(b.name) - starts(a.name) || a.name.localeCompare(b.name))
		.slice(0, MOST);
}
