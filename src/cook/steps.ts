// Divides the instructions of a recipe into steps. The specification does not define a step, so
// the plugin has its own rule: each item of a list is a step. With no list, each paragraph is a step.

import { allIngredients } from '../match/match';
import { nameKey } from '../match/names';
import { parseAmount } from '../recipemd/amount';
import { readBlocks } from '../recipemd/blocks';
import type { Ingredient, Recipe } from '../recipemd/types';

export type Step = {
	text: string;
	// The ingredients that the text of the step names.
	ingredients: Ingredient[];
	// The first time in the text, in seconds, for the timer.
	seconds: number | null;
};

// The plugin writes its record of cooked meals below this heading. It is not a step.
export const RECORD_HEADING = 'Cooked';

// A time is a number and a unit: "8 minutes", "1 1/2 hours", "½ hour". The number has the same
// forms as an amount of an ingredient.
const NUMBER = String.raw`\d+\s+\d+\s*/\s*\d+|\d+\s*/\s*\d+|\d*[.,]\d+|\d*\s*[¼-¾⅐-⅞]|\d+`;
const UNIT = 'hours?|hrs?|minutes?|mins?|seconds?|secs?';
const TIME = new RegExp(`(${NUMBER})[\\s-]*(${UNIT})\\b`, 'gi');
// The text between two parts of one time: "1 hour and 30 minutes", "1 hour, 30 minutes".
const BETWEEN = /^[\s,]*(and)?\s*$/i;

const secondsPer = (unit: string) => {
	const first = unit[0].toLowerCase();
	return first === 'h' ? 3600 : first === 'm' ? 60 : 1;
};

// The first time in the text is the time of the timer. A time can have parts, from large to small.
function secondsIn(text: string): number | null {
	const parts = [...text.matchAll(TIME)].map((match) => {
		const unit = secondsPer(match[2]);
		const count = parseAmount(match[1])?.factor ?? 0;
		return { start: match.index, end: match.index + match[0].length, unit, seconds: count * unit };
	});
	if (!parts.length) return null;

	let seconds = parts[0].seconds;
	for (let at = 1; at < parts.length; at++) {
		const between = text.slice(parts[at - 1].end, parts[at].start);
		const isNextPart = parts[at].unit < parts[at - 1].unit && BETWEEN.test(between);
		if (!isNextPart) break;
		seconds += parts[at].seconds;
	}
	return Math.round(seconds);
}

export function readSteps(recipe: Recipe): Step[] {
	if (!recipe.instructions) return [];

	const all = readBlocks(recipe.instructions.split(/\r?\n/));
	const record = all.findIndex(
		(block) => block.type === 'heading' && block.text === RECORD_HEADING
	);
	const own = record === -1 ? all : all.slice(0, record);
	// Text below a heading, such as tips, is not a step.
	const heading = own.findIndex((block, at) => block.type === 'heading' && at > 0);
	const blocks = heading === -1 ? own : own.slice(0, heading);

	const items = blocks.flatMap((block) => (block.type === 'list' ? block.items : []));
	const paragraphs = blocks.flatMap((block) =>
		block.type === 'paragraph' ? [block.text.replace(/\n/g, ' ')] : []
	);
	const texts = items.length ? items : paragraphs;

	const ingredients = allIngredients(recipe).map((ingredient) => {
		const key = nameKey(ingredient.name);
		return { ingredient, key, lastWord: key.split(' ').pop() ?? '' };
	});

	return texts.map((text) => {
		const words = ` ${nameKey(text)} `;
		const named = ingredients.filter(
			({ key, lastWord }) =>
				words.includes(` ${key} `) || (lastWord.length >= 4 && words.includes(` ${lastWord} `))
		);
		return { text, ingredients: named.map(({ ingredient }) => ingredient), seconds: secondsIn(text) };
	});
}
