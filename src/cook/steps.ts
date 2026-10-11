// Divides the instructions of a recipe into steps. The specification does not define a step, so
// the plugin has its own rule: each item of a list is a step. With no list, each paragraph is a step.

import { allIngredients } from '../match/match';
import { nameKey } from '../match/names';
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

const TIME = /(\d+(?:[.,]\d+)?)\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)\b/i;

function secondsIn(text: string): number | null {
	const match = TIME.exec(text);
	if (!match) return null;
	const unit = match[2].toLowerCase();
	const size = unit.startsWith('h') ? 3600 : unit.startsWith('m') ? 60 : 1;
	return Math.round(Number(match[1].replace(',', '.')) * size);
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
