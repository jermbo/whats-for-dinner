// Writes the link of a step photo into the recipe note, below the text of its step, and moves the
// mark `|best` between the photos of a step. The photo is near its step, and you see it with no
// plugin. All other text of the note stays.

import { readRecipe } from '../recipemd/parse';
import { stepBlocks } from './steps';

// The lines of one step in the note: its first line, its last line with text, and the indent that
// a line needs to continue it.
type StepLines = { first: number; last: number; indent: string };

const MARKER = /^(\s*(?:[-+*]|\d{1,9}[.)]))\s/;
// The options after the name, such as `|300` for the width, stay as you typed them.
const PHOTO_LINE = /^(\s*)!\[\[([^\]|]+)((?:\|[^\]]*)?)\]\]\s*$/;

function stepLines(lines: string[]): StepLines[] {
	const text = lines.join('\n');
	const result = readRecipe(text);
	if (!result.ok || !result.recipe.instructions) return [];

	// The instructions are the end of the note, so their first line is where their last copy in the
	// text starts. The same text can also be higher in the note, such as in the description.
	const at = text.lastIndexOf(result.recipe.instructions);
	if (at === -1) return [];
	const start = text.slice(0, at).split('\n').length - 1;
	const own = lines.slice(start);
	const { kind, blocks } = stepBlocks(own);

	const lastText = (from: number, to: number) => {
		let last = to - 1;
		while (last > from && !own[last].trim()) last--;
		return last;
	};
	return blocks.flatMap((block): StepLines[] => {
		if (kind === 'paragraph') return [{ first: start + block.start, last: start + block.end - 1, indent: '' }];
		if (block.type !== 'list') return [];
		return block.starts.map((first, at) => {
			const end = block.starts[at + 1] ?? block.end;
			const column = MARKER.exec(own[first])?.[1].length ?? 0;
			return { first: start + first, last: start + lastText(first, end), indent: ' '.repeat(column + 1) };
		});
	});
}

// In a list item, the photo is a line with an indent, so that it continues the item. In a
// paragraph, it is the line directly below, with no blank line, so that it is not a new step.
export function addStepPhoto(text: string, step: number, name: string): string {
	const lines = text.replace(/\r\n/g, '\n').split('\n');
	const place = stepLines(lines)[step - 1];
	if (!place) return text;
	lines.splice(place.last + 1, 0, `${place.indent}![[${name}]]`);
	return lines.join('\n');
}

// A step has one best photo or none. The mark goes on the photo with this name, and off each other
// photo of the step. With no name, the step has no best photo.
export function markBest(text: string, step: number, name: string | null): string {
	const lines = text.replace(/\r\n/g, '\n').split('\n');
	const place = stepLines(lines)[step - 1];
	if (!place) return text;
	for (let at = place.first; at <= place.last; at++) {
		const photo = PHOTO_LINE.exec(lines[at]);
		if (!photo) continue;
		const [, indent, link, options] = photo;
		const others = options.split('|').filter((one) => one && one.trim().toLowerCase() !== 'best');
		const all = link === name ? ['best', ...others] : others;
		lines[at] = `${indent}![[${[link, ...all].join('|')}]]`;
	}
	return lines.join('\n');
}
