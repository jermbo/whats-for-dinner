// Reads the section "Brands" of a food item note: one list item for each brand, and its photos on
// the lines with an indent below it. This is the form of a step photo, so you see each brand with
// its photo in Obsidian with no plugin.

export type Brand = {
	// No text: the brand has only a photo, and you can give it a name later.
	name: string;
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

function brandOf(own: string, below: string[]): Brand | null {
	const name = own.replace(PHOTO, ' ').replace(/\s+/g, ' ').trim();
	const photos = [own, ...below].flatMap(photosIn);
	return name || photos.length ? { name, photos } : null;
}

export const readBrands = (text: string): Brand[] =>
	brandLines(text.split(/\r?\n/)).map(({ brand }) => brand);
