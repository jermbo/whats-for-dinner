// Reads a recipe note into the fields of intake, so that you change a recipe in the same flow that
// made it. Each part that intake has no field for comes with it, so that "Save" writes it again:
// the property block, the raw text of each ingredient, the photos of the steps, and each text of
// the instructions that is not a step, such as the records of "Cooked".

import { readSteps, stepBlocks } from '../cook/steps';
import { allIngredients } from '../match/match';
import { showName } from '../match/names';
import { readBlocks, type Block } from '../recipemd/blocks';
import { readRecipe } from '../recipemd/parse';
import { splitProperties } from '../recipemd/properties';
import type { IntakeStart } from './recipe-text';

const SOURCE = /^Source: /;
const PHOTO_LINE = /^!\[\[([^\]]+)\]\]$/;

// Null when the note is not a recipe: then "Convert" is the way into intake.
export function editNote(text: string): IntakeStart | null {
	const { properties, body } = splitProperties(text.replace(/\r\n/g, '\n').split('\n'));
	const result = readRecipe(body.join('\n'));
	if (!result.ok) return null;
	const { recipe } = result;

	return {
		properties: properties.join('\n'),
		title: recipe.title,
		tags: recipe.tags,
		yields: recipe.yields.map((amount) => amount.text).join(', '),
		...descriptionParts(recipe.description ?? ''),
		ingredients: ingredientLines(body, allIngredients(recipe)),
		steps: readSteps(recipe).map((step) => ({
			text: step.text,
			photos: step.photos.map((photo) => photo.link)
		})),
		after: afterSteps(recipe.instructions ?? '')
	};
}

const rawOf = (lines: string[], block: Block) => lines.slice(block.start, block.end).join('\n');

// "Save" writes the source line and the photo links first in the description, so they come back
// into their fields. All other text stays in the description.
function descriptionParts(description: string) {
	const lines = description.split('\n');
	const blocks = readBlocks(lines).map((block) => rawOf(lines, block).trim());
	const source = SOURCE.test(blocks[0] ?? '') ? blocks.shift()!.replace(SOURCE, '') : '';
	const photoLines = (blocks[0] ?? '').split('\n');
	const isPhotos = Boolean(blocks[0]) && photoLines.every((line) => PHOTO_LINE.test(line.trim()));
	const sourcePhotos = isPhotos ? photoLines.map((line) => PHOTO_LINE.exec(line.trim())![1]) : [];
	if (isPhotos) blocks.shift();
	return { source, sourcePhotos, description: blocks.filter(Boolean).join('\n\n') };
}

// The ingredients are the lists and headings after the first rule, in the sequence of the note,
// and the parser reads them in that same sequence. So each item of a list is the next ingredient.
function ingredientLines(body: string[], parsed: ReturnType<typeof allIngredients>) {
	const blocks = readBlocks(body);
	const lines: IntakeStart['ingredients'] = [];
	let next = 0;
	for (const block of blocks.slice(blocks.findIndex((one) => one.type === 'rule') + 1)) {
		if (block.type === 'heading') {
			lines.push({ text: `${block.text}:`, raw: null });
		} else if (block.type === 'list') {
			for (const item of block.items) {
				const { amount, name } = parsed[next++];
				const text = [amount?.text, showName(name)].filter(Boolean).join(' ');
				lines.push({ text, raw: item });
			}
		} else {
			break;
		}
	}
	return lines;
}

// Each block of the instructions that is not a step, in its sequence: the records, a note, a
// heading of your own.
function afterSteps(instructions: string): string {
	const lines = instructions.split('\n');
	const steps = new Set(stepBlocks(lines).blocks.map((block) => block.start));
	return readBlocks(lines)
		.filter((block) => !steps.has(block.start))
		.map((block) => rawOf(lines, block).trimEnd())
		.join('\n\n');
}
