// Reads the section "Brands" of a food item note: one list item for each brand, and its photos on
// the lines with an indent below it. This is the form of a step photo, so you see each brand with
// its photo in Obsidian with no plugin.

// What you think of a brand, for the question in the store: take it, or not.
export type Verdict = 'buy again' | 'avoid';

export type Brand = {
	// No text: the brand has only a photo, and you can give it a name later.
	name: string;
	// Null: you did not decide.
	verdict: Verdict | null;
	// The barcode of its package, so that a second scan finds the brand with no connection.
	barcode: string | null;
	// The names of the image files, as the links have them. The first photo is the photo that shows.
	photos: string[];
};

// The lines of one brand in the note: its list item, and each line that continues it.
export type BrandLines = { first: number; end: number; indent: string; marker: string };

const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const ITEM = /^(\s*)([-+*]|\d{1,9}[.)])\s+(.*)$/;
// The options after the name, such as `|300` for the width, are not a part of the name.
export const PHOTO = /!\[\[([^\]|]+\.(?:jpe?g|png|webp|gif|heic|avif))(?:\|[^\]]*)?\]\]/gi;

const isHeading = (line: string) => HEADING.test(line);
const indentOf = (line: string) => /^\s*/.exec(line)?.[0].length ?? 0;

// The lines of the section: the heading, and the first line after the section. Null: the note has
// no section "Brands". The heading can have any level, with capital or small letters.
export function findSection(lines: string[]): { heading: number; end: number } | null {
	const heading = lines.findIndex((line) => HEADING.exec(line)?.[2].toLowerCase() === 'brands');
	if (heading === -1) return null;
	let end = heading + 1;
	while (end < lines.length && !isHeading(lines[end])) end++;
	return { heading, end };
}

// One block for each brand of the section. A list item with more indent than the first item is a
// part of the brand above it. An empty list item is no brand.
export function brandLines(lines: string[]): (BrandLines & { brand: Brand })[] {
	const section = findSection(lines);
	if (!section) return [];
	const blocks: (BrandLines & { brand: Brand })[] = [];
	let base: number | null = null;
	for (let at = section.heading + 1; at < section.end; at++) {
		const item = ITEM.exec(lines[at]);
		if (!item || (base !== null && item[1].length > base)) continue;
		base ??= item[1].length;
		let end = at + 1;
		while (end < section.end && lines[end].trim() && indentOf(lines[end]) > item[1].length) end++;
		const brand = brandOf(item[3], lines.slice(at + 1, end));
		if (brand) blocks.push({ first: at, end, indent: item[1], marker: item[2], brand });
	}
	return blocks;
}

const photosIn = (text: string) => [...text.matchAll(PHOTO)].map((match) => match[1].trim());

// After the name, the line of the item can have a verdict and then a barcode, each after a middle
// dot. A barcode is only digits, so it does not clash with a verdict or a name.
const BARCODE = /(?:^|\s)·\s*(\d{8,14})\s*$/;
const VERDICT = /(?:^|\s)·\s*(buy again|avoid)\s*$/i;

function brandOf(own: string, below: string[]): Brand | null {
	let text = own.replace(PHOTO, ' ').replace(/\s+/g, ' ').trim();
	const code = BARCODE.exec(text);
	const barcode = code ? code[1] : null;
	if (code) text = text.slice(0, code.index).trim();
	const found = VERDICT.exec(text);
	const verdict = found ? (found[1].toLowerCase() as Verdict) : null;
	const name = found ? text.slice(0, found.index).trim() : text;
	const photos = [own, ...below].flatMap(photosIn);
	return name || photos.length || verdict || barcode ? { name, verdict, barcode, photos } : null;
}

// The text of the line of a brand: its name, then its verdict and its barcode after a middle dot.
export function brandText(name: string, verdict: Verdict | null, barcode: string | null = null): string {
	const own = name.trim();
	const after = [verdict, barcode].flatMap((part) => (part ? [`· ${part}`] : [])).join(' ');
	return [own, after].filter(Boolean).join(' ');
}

export const readBrands = (text: string): Brand[] =>
	brandLines(text.split(/\r?\n/)).map(({ brand }) => brand);
