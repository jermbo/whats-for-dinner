// The notice after put away tells what went into the pantry, or null when nothing did.
export function putAwayNotice(names: string[]): string | null {
	if (names.length === 1) return `${names[0]} is in the pantry.`;
	return names.length > 1 ? `${names.length} items are in the pantry.` : null;
}
