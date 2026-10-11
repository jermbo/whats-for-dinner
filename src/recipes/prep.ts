// The preparation of a recipe: what you must do before you can cook, such as "take the beef out of
// the freezer". The RecipeMD specification has no part for it, so the plugin has its own form: a
// callout of the type "prep", in the description or in the instructions of the note.
//
//   > [!prep] The night before
//   > Take the ground beef out of the freezer.

import type { Recipe } from '../recipemd/types';

const START = /^ {0,3}>\s*\[!prep\][+-]?(.*)$/i;
const QUOTE = /^ {0,3}>(.*)$/;

// The lines of the first "prep" callout: `start` is its first line, and `end` is the first line
// after it.
function findPrep(lines: string[]): { start: number; end: number } | null {
	const start = lines.findIndex((line) => START.test(line));
	if (start === -1) return null;

	let end = start + 1;
	while (end < lines.length && QUOTE.test(lines[end])) end++;
	return { start, end };
}

// The text of the callout, one line for each line of the note. Null: the recipe has no preparation.
export function readPrep(recipe: Recipe): string | null {
	for (const part of [recipe.description, recipe.instructions]) {
		const lines = (part ?? '').split(/\r?\n/);
		const found = findPrep(lines);
		if (!found) continue;

		const [first, ...others] = lines.slice(found.start, found.end);
		const texts = [START.exec(first)![1], ...others.map((line) => QUOTE.exec(line)![1])];
		const text = texts.map((line) => line.trim()).filter(Boolean).join('\n');
		if (text) return text;
	}
	return null;
}

// A text without its callout. The plugin shows the preparation in its own box, not in the description.
export function withoutPrep(text: string): string {
	const lines = text.split(/\r?\n/);
	const found = findPrep(lines);
	if (!found) return text;

	lines.splice(found.start, found.end - found.start);
	return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
