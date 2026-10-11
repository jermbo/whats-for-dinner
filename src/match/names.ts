// A wikilink in a recipe is the name of its note: "[[Pantry/Rice|rice]]" is "Rice".
const WIKILINK = /\[\[([^\]|#]+)[^\]]*\]\]/g;

// A word and its plural must give the same key: "cookie" and "cookies", "berry" and "berries",
// "leaf" and "leaves". The key is not on the screen, so it does not have to be a correct word:
// "olive" and "olives" are "olif".
function wordKey(word: string): string {
	const one = /(ch|sh|x|ss|o)es$/.test(word) ? word.slice(0, -2) : word.replace(/([^s])s$/, '$1');
	return one.replace(/(ie|y)$/, 'i').replace(/ve$/, 'f');
}

// The form of a name that the plugin compares: small letters, no marks, and no plural.
// "Chicken thighs" and "chicken thigh" have the same key.
export function nameKey(name: string): string {
	return name
		.replace(WIKILINK, (_, target: string) => target.split('/').pop() ?? '')
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim()
		.split(' ')
		.map(wordKey)
		.join(' ');
}

// The name as a person reads it: a wikilink shows its text, not its brackets.
export function showName(name: string): string {
	return name.replace(/\[\[([^\]|#]+)(?:\|([^\]]+))?[^\]]*\]\]/g, (_, target: string, text?: string) =>
		(text ?? target.split('/').pop() ?? '').trim()
	);
}
