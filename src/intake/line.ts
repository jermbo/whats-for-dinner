// One ingredient line of intake, as you type it: "200 g flour" is the amount "200 g" and the name
// "flour". You type no italics, so the plugin finds where the amount stops.

import type { FoodIndex } from '../match/match';
import { nameKey, splitNote } from '../match/names';
import type { FoodNote } from '../note';
import { parseAmount } from '../recipemd/amount';
import type { Amount } from '../recipemd/types';
import { isUnit } from '../units';

export type IngredientLine = {
	amount: Amount | null;
	name: string;
	// Text of the line that is not the food: ", beaten", " (diced)", or a range. The note keeps it
	// after the name, so that no word of the line is lost.
	extra: string;
};

// The forms of a number of an amount, as the RecipeMD specification has them.
const NUMBER_FORM = String.raw`\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d*[.,]\d+|\d*\s*[¼-¾⅐-⅞]|\d+`;
const NUMBER = new RegExp(`^(${NUMBER_FORM})\\s*(.*)$`, 's');
// "1 1/2 - 2 cups" and "2 to 3 cloves". RecipeMD has no range, so the amount is the low number,
// which the pantry can always give, and the range stays as text.
const RANGE_END = new RegExp(`^(?:-|–|to\\s)\\s*(${NUMBER_FORM})\\s*(.*)$`, 's');

export function readLine(text: string): IngredientLine {
	const line = text.trim();
	const number = NUMBER.exec(line);
	if (!number) return withNote(null, line, '');

	const [, low] = number;
	let [, , rest] = number;
	const range = RANGE_END.exec(rest);
	const high = range?.[1];
	if (range) rest = range[2];

	const [word = '', ...others] = rest.split(/\s+/);
	const hasUnit = isUnit(word) && others.length > 0;
	const name = (hasUnit ? others.join(' ') : rest).trim();
	// A line that is only a number, such as "2", is a name. An ingredient needs a name.
	if (!name) return withNote(null, line, '');

	const unit = hasUnit ? ` ${word}` : '';
	const amount = parseAmount(`${low.trim()}${unit}`);
	const shownRange = high ? ` (${low.trim()} - ${high.trim()}${unit})` : '';
	return withNote(amount, name, shownRange);
}

function withNote(amount: Amount | null, text: string, range: string): IngredientLine {
	const { name, note } = splitNote(text);
	return { amount, name, extra: `${range}${note}` };
}

// A recipe card often says "For the dough:" above its ingredients. So a line that ends with a
// colon is the title of a group, and not an ingredient. It gives null for a different line.
export function groupOf(text: string): string | null {
	const line = text.trim();
	return line.length > 1 && line.endsWith(':') ? line.slice(0, -1).trim() : null;
}

// The food items of a line, with the rules of the match: its name, or one of their other names.
export const foodsOf = (line: IngredientLine, index: FoodIndex): FoodNote[] =>
	line.name ? (index.get(nameKey(line.name)) ?? []) : [];
