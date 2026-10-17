export type NoteKind = 'plan' | 'trip' | 'food' | 'item' | 'receipt' | 'recipe' | null;

export type KitchenWhere = {
	recipes: string;
	pantry: string;
	plan: string;
	shopping: string;
	items: string;
};

// What a note is for the kitchen, from its path. Null: the kitchen does not read the note. A note
// of the shopping folder that is not the open note can be a receipt.
export function noteKind(path: string, where: KitchenWhere, openNote: string): NoteKind {
	const { plan, pantry, shopping, items, recipes } = where;
	if (path === plan) return 'plan';
	if (path === openNote) return 'trip';
	if (path.startsWith(`${pantry}/`)) return 'food';
	if (path.startsWith(`${items}/`)) return 'item';
	if (path.startsWith(`${shopping}/`)) return 'receipt';
	return !recipes || path.startsWith(`${recipes}/`) ? 'recipe' : null;
}
