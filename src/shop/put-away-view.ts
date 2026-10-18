import type { CartItem, Facts } from './facts';

export const PUT_AWAY_OUTSIDE = 'Not in the pantry';

// One package of the cart on the screen of put away. Its key is the key of its receipt row. It
// starts with the facts of its row, and `facts` has your changes too.
export type PutAwayLine = { key: string; at: number; item: CartItem; start: Facts; facts: Facts };

// The lines of one item are next to each other, in the sequence of their receipt rows.
const byItem = (a: PutAwayLine, b: PutAwayLine) =>
	a.item.name.localeCompare(b.item.name) || a.at - b.at;

export function putAwayKnown(lines: PutAwayLine[]): PutAwayLine[] {
	return lines.filter(({ item }) => item.known).sort(byItem);
}

export function putAwayPlaceGroup(line: PutAwayLine, openKey: string | null, openGroup: string | null) {
	const { item, facts } = line;
	const place = facts.intoPantry ? facts.place.trim() || item.start.place : PUT_AWAY_OUTSIDE;
	if (openKey === line.key && openGroup !== null) return openGroup;
	return place;
}

export type PutAwayGroup = { title: string; lines: PutAwayLine[] };

// You put the food away one place at a time. Items that do not go into the pantry come last.
export function putAwayGroups(
	lines: PutAwayLine[],
	open: { key: string; group: string } | null
): PutAwayGroup[] {
	const groupOf = (line: PutAwayLine) =>
		putAwayPlaceGroup(line, open?.key ?? null, open?.group ?? null);
	const unknown = lines.filter(({ item }) => !item.known);
	const titles = [...new Set(unknown.map(groupOf))].sort((a, b) =>
		a === PUT_AWAY_OUTSIDE ? 1 : b === PUT_AWAY_OUTSIDE ? -1 : a.localeCompare(b)
	);
	return titles.map((title) => ({
		title,
		lines: unknown.filter((line) => groupOf(line) === title).sort(byItem)
	}));
}
