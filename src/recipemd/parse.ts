// Reads a note as a recipe, with the algorithm of the RecipeMD specification, version 2.4.0.
// There is one difference: the note can have properties above the title.

import { parseAmount, splitList } from './amount';
import { readBlocks, type Block } from './blocks';
import { withoutProperties } from './properties';
import type { Amount, Ingredient, IngredientGroup, Recipe, RecipeResult } from './types';

// A note that does not follow the specification. The message is the reason for the reader.
class RecipeError extends Error {}

// A paragraph that is fully in italics is the tags. A paragraph that is fully in bold is the yields.
const ITALICS = /^(?:\*(?!\*)([^*]+)\*|_(?!_)([^_]+)_)$/;
const BOLD = /^(?:\*\*((?:(?!\*\*)[\s\S])+)\*\*|__((?:(?!__)[\s\S])+)__)$/;
// An ingredient can start with its amount in italics.
const AMOUNT = /^(?:\*(?!\*)([^*]+)\*|_(?!_)([^_]+)_)\s*([\s\S]*)$/;
const LINK = /^\[([^\]]*)\]\((?:<([^>]*)>|([^\s)]*))(?:\s+(?:"[^"]*"|'[^']*'))?\)$/;

export function readRecipe(markdown: string): RecipeResult {
	try {
		return { ok: true, recipe: parse(markdown) };
	} catch (error) {
		if (error instanceof RecipeError) return { ok: false, reason: error.message };
		throw error;
	}
}

function parse(markdown: string): Recipe {
	const lines = withoutProperties(markdown.split(/\r?\n/));
	const blocks = readBlocks(lines);
	const source = (from: number, to: number) => lines.slice(from, to).join('\n').trim() || null;
	let at = 0;

	const title = blocks[at++];
	if (title?.type !== 'heading' || title.level !== 1) {
		throw new RecipeError('The first block is not a title: a heading of level 1.');
	}

	const descriptionStart = at;
	while (at < blocks.length && blocks[at].type !== 'rule' && !isTagsOrYields(blocks[at])) at++;
	const description =
		at > descriptionStart ? source(blocks[descriptionStart].start, blocks[at - 1].end) : null;

	let tags: string[] | null = null;
	let yields: Amount[] | null = null;
	for (; at < blocks.length && isTagsOrYields(blocks[at]); at++) {
		const tagText = textIn(blocks[at], ITALICS);
		if (tagText !== null) {
			if (tags) throw new RecipeError('The note has two paragraphs of tags.');
			tags = splitList(tagText);
		} else {
			if (yields) throw new RecipeError('The note has two paragraphs of yields.');
			yields = splitList(textIn(blocks[at], BOLD)!).map(readYield);
		}
	}

	if (blocks[at]?.type !== 'rule') {
		throw new RecipeError('The note has no rule (---) before the ingredients.');
	}
	at++;

	const readLists = (): Ingredient[] => {
		const ingredients: Ingredient[] = [];
		for (let block = blocks[at]; block?.type === 'list'; block = blocks[++at]) {
			for (const item of block.items) ingredients.push(readIngredient(item));
		}
		return ingredients;
	};

	// A heading starts a group. A heading of a lower level starts a group in that group.
	const readGroups = (parentLevel: number): IngredientGroup[] => {
		const groups: IngredientGroup[] = [];
		for (
			let block = blocks[at];
			block?.type === 'heading' && block.level > parentLevel;
			block = blocks[at]
		) {
			at++;
			groups.push({ title: block.text, ingredients: readLists(), groups: readGroups(block.level) });
		}
		return groups;
	};

	const ingredients = readLists();
	const groups = readGroups(0);

	// The rule before the instructions is optional.
	if (blocks[at]?.type === 'rule') at++;
	const instructions = at < blocks.length ? source(blocks[at].start, lines.length) : null;

	return {
		title: title.text,
		description,
		tags: tags ?? [],
		yields: yields ?? [],
		ingredients,
		groups,
		instructions
	};
}

// The text of a paragraph that is fully in one emphasis, or null.
function textIn(block: Block, emphasis: RegExp): string | null {
	if (block.type !== 'paragraph') return null;
	const match = emphasis.exec(block.text);
	return match ? (match[1] ?? match[2]) : null;
}

const isTagsOrYields = (block: Block) =>
	textIn(block, ITALICS) !== null || textIn(block, BOLD) !== null;

function readYield(text: string): Amount {
	const amount = parseAmount(text);
	if (!amount) throw new RecipeError(`The yield "${text}" has no number.`);
	return amount;
}

function readIngredient(item: string): Ingredient {
	const match = AMOUNT.exec(item);
	const amountText = match ? (match[1] ?? match[2]) : null;
	const amount = amountText === null ? null : parseAmount(amountText);
	if (amountText !== null && !amount) {
		throw new RecipeError(`The amount "${amountText}" has no number.`);
	}

	const text = (match ? match[3] : item).trim();
	if (!text) throw new RecipeError('An ingredient has no name.');

	// A name that is only a link goes to the recipe of that ingredient.
	const link = LINK.exec(text);
	if (link) return { name: link[1], amount, link: link[2] ?? link[3] };
	return { name: text, amount, link: null };
}
