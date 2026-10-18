// Writes the brands of the form into the section "Brands" of a food item note. Only the list items
// of the brands change. The other text of the note, and the text of the section that is not a list
// item, stays.

import { brandLines, findSection, PHOTO } from './brands';

// `at` is the number of a brand in the section, as `readBrands` gives it. `photo` is the name of a
// new file, which replaces the first photo of the brand.
export type BrandChange =
	| { is: 'add'; name: string; photo: string }
	| { is: 'change'; at: number; name: string; photo: string | null }
	| { is: 'remove'; at: number };

const ITEM = /^(\s*(?:[-+*]|\d{1,9}[.)])\s+)(.*)$/;
const ONLY_PHOTO = /^\s*!\[\[[^\]]+\]\]\s*$/;

export function changeBrands(text: string, changes: BrandChange[]): string {
	const lines = text.replace(/\r\n/g, '\n').split('\n');
	const blocks = brandLines(lines);
	// From the last brand up, so that the brands above keep their lines.
	const edits = changes
		.filter((change) => change.is !== 'add')
		.sort((a, b) => b.at - a.at);
	for (const change of edits) {
		const block = blocks[change.at];
		if (!block) continue;
		const own = lines.slice(block.first, block.end);
		const next = change.is === 'remove' ? [] : changed(own, block.indent, change);
		lines.splice(block.first, own.length, ...next);
	}
	const adds = changes.filter((change) => change.is === 'add');
	return adds.length ? withNew(lines, adds) : lines.join('\n');
}

// A name goes on the line of the item, and each photo on a line below it. A brand with no name has
// its first photo on the line of the item.
function changed(own: string[], indent: string, { name, photo }: { name: string; photo: string | null }) {
	const [, marker, text] = ITEM.exec(own[0]) ?? ['', `${indent}- `, ''];
	const below = ' '.repeat(marker.length);
	const lines = [...[...text.matchAll(PHOTO)].map((link) => `${below}${link[0]}`), ...own.slice(1)];

	if (photo) {
		const at = lines.findIndex((line) => line.match(PHOTO));
		const link = `![[${photo}]]`;
		if (at === -1) lines.unshift(`${below}${link}`);
		else lines[at] = lines[at].replace(new RegExp(PHOTO.source, 'i'), link);
	}

	if (name.trim()) return [`${marker}${name.trim()}`, ...lines];
	const first = lines.findIndex((line) => ONLY_PHOTO.test(line));
	if (first === -1) return [];
	const [link] = lines.splice(first, 1);
	return [`${marker}${link.trim()}`, ...lines];
}

// Each new brand goes at the end of the section. A note with no section gets it at its end.
function withNew(lines: string[], adds: { name: string; photo: string }[]): string {
	const items = adds.flatMap(({ name, photo }) =>
		name.trim() ? [`- ${name.trim()}`, `  ![[${photo}]]`] : [`- ![[${photo}]]`]
	);
	const section = findSection(lines);
	if (!section) return `${lines.join('\n').trimEnd()}\n\n## Brands\n\n${items.join('\n')}\n`;

	let last = section.end - 1;
	while (last > section.heading && !lines[last].trim()) last--;
	const insert = last === section.heading ? ['', ...items] : items;
	lines.splice(last + 1, 0, ...insert);
	// A heading directly below the list needs an empty line before it.
	const after = last + 1 + insert.length;
	if (after < lines.length && lines[after].trim()) lines.splice(after, 0, '');
	return lines.join('\n');
}
