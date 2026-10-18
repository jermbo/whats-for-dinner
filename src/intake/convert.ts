// Reads a note that is not a recipe into the fields of intake, so that a recipe from before the
// plugin goes through the same flow as a new one. The plugin has no rule for the habits of one
// vault. It knows only the common words of recipes, and each text that it cannot put into a field
// stays in the description, so that nothing is lost.

import { nameKey, showName } from '../match/names';
import { readBlocks, type Block } from '../recipemd/blocks';

export type ConvertedNote = {
	// The property block as the note has it, with its two lines of "---", or empty.
	properties: string;
	title: string;
	tags: string[];
	source: string;
	ingredients: string[];
	steps: string[];
	description: string;
};

type Part = 'ingredients' | 'steps' | 'source';

const PARTS: Record<string, Part> = {
	ingredients: 'ingredients',
	directions: 'steps',
	instructions: 'steps',
	method: 'steps',
	steps: 'steps',
	source: 'source',
	sources: 'source'
};

const EDGE = /^---[ \t]*$/;
// A tag of Obsidian keeps its "#", so that the tag tree of the vault still finds the note.
const TAG = /(^|\s)(#[\p{L}\p{N}_/-]*[\p{L}_/-][\p{L}\p{N}_/-]*)/gu;
const WEB_LINK = /\[[^\]]*\]\(https?:\/\/[^)\s]+\)|https?:\/\/\S+/g;

// "Directions:" and "directions" are the same word.
const partOf = (heading: string): Part | null =>
	PARTS[showName(heading).toLowerCase().replace(/[\s:.]+$/, '').trim()] ?? null;

// "*200 g* flour" is "200 g flour", and "[[Flour]]" is "Flour": a line of intake has no Markdown.
const lineOf = (item: string) =>
	showName(item.replace(/^\[[ xX]\]\s+/, ''))
		.replace(/^\*(?!\*)([^*]+)\*|^_(?!_)([^_]+)_/, (_, a?: string, b?: string) => a ?? b ?? '')
		.trim();

export function convertNote(text: string, noteName: string): ConvertedNote {
	const all = text.replace(/\r\n/g, '\n').split('\n');
	const end = EDGE.test(all[0] ?? '') ? all.findIndex((line, at) => at > 0 && EDGE.test(line)) : -1;
	const properties = end === -1 ? '' : all.slice(0, end + 1).join('\n');

	const tags: string[] = [];
	const lines = all.slice(end + 1).map((line) =>
		line.replace(TAG, (_, space: string, tag: string) => {
			if (!tags.includes(tag)) tags.push(tag);
			return space;
		})
	);

	const blocks = readBlocks(lines);
	const raw = (block: Block) => lines.slice(block.start, block.end).join('\n').trim();
	const hasListPart = blocks.some(
		(block) => block.type === 'heading' && ['ingredients', 'steps'].includes(partOf(block.text) ?? '')
	);
	const hasSourcePart = blocks.some((block) => block.type === 'heading' && partOf(block.text) === 'source');

	const result = { ingredients: [] as string[], steps: [] as string[], source: [] as string[] };
	const description: string[] = [];
	let part: { is: Part; level: number } | null = null;
	let listsOutside = 0;
	let firstHeading = true;

	for (const block of blocks) {
		if (block.type === 'heading') {
			const isTitle = firstHeading && nameKey(showName(block.text)) === nameKey(noteName);
			firstHeading = false;
			if (isTitle) continue;

			if (part && block.level <= part.level) part = null;
			const named: Part | null = part ? null : partOf(block.text);
			if (named) {
				part = { is: named, level: block.level };
				continue;
			}
			// A heading inside a part, such as "Pie Dough", stays: intake has no groups.
			description.push(raw(block));
			continue;
		}

		if (part?.is === 'source') {
			result.source.push(raw(block));
		} else if (block.type === 'list' && part) {
			result[part.is].push(...block.items.map(lineOf));
		} else if (block.type === 'list' && !hasListPart) {
			result[listsOutside++ === 0 ? 'ingredients' : 'steps'].push(...block.items.map(lineOf));
		} else if (!hasSourcePart && block.type !== 'list') {
			const text = raw(block);
			result.source.push(...(text.match(WEB_LINK) ?? []));
			const rest = text.replace(WEB_LINK, '').replace(/[ \t]+$/gm, '').trim();
			if (rest) description.push(rest);
		} else {
			description.push(raw(block));
		}
	}

	return {
		properties,
		title: noteName,
		tags,
		source: result.source.join('\n\n'),
		ingredients: result.ingredients.filter(Boolean),
		steps: result.steps.filter(Boolean),
		description: description.filter(Boolean).join('\n\n')
	};
}
