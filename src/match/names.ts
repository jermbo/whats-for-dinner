import { singular } from '../units';

// A wikilink in a recipe is the name of its note: "[[Pantry/Rice|rice]]" is "Rice".
const WIKILINK = /\[\[([^\]|#]+)[^\]]*\]\]/g;

// The form of a name that the plugin compares: small letters, no marks, each word in the singular.
// "Chicken thighs" and "chicken thigh" have the same key.
export function nameKey(name: string): string {
	return name
		.replace(WIKILINK, (_, target: string) => target.split('/').pop() ?? '')
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim()
		.split(' ')
		.map(singular)
		.join(' ');
}

// The name as a person reads it: a wikilink shows its text, not its brackets.
export function showName(name: string): string {
	return name.replace(/\[\[([^\]|#]+)(?:\|([^\]]+))?[^\]]*\]\]/g, (_, target: string, text?: string) =>
		(text ?? target.split('/').pop() ?? '').trim()
	);
}
