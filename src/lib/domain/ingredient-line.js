/** @typedef {import('$lib/types').Ingredient} Ingredient */

const NUMBER = String.raw`\d+(?:[.,]\d+)?`;
/** "300 rice": the number is first. */
const NUMBER_FIRST = new RegExp(String.raw`^(${NUMBER})\s+(.+)$`);
/** "rice 300" or "rice 300 g": the number is last. The unit is that of the ingredient. */
const NUMBER_LAST = new RegExp(String.raw`^(.+?)\s+(${NUMBER})\s*(?:g|ml)?$`, 'i');

/**
 * One line of the recipe form as a name and a quantity: "rice 300", "300 rice", or "salt".
 * The line has no unit, because each ingredient has one unit in the full app.
 * @param {string} line
 * @returns {{ name: string, quantity: number }}
 */
export function parseLine(line) {
	const text = line.trim();
	const number = (/** @type {string} */ value) => Number(value.replace(',', '.'));

	const last = text.match(NUMBER_LAST);
	if (last) return { name: last[1].trim(), quantity: number(last[2]) };

	const first = text.match(NUMBER_FIRST);
	if (first) return { name: first[2].trim(), quantity: number(first[1]) };

	return { name: text, quantity: 0 };
}

/**
 * The ingredient that a name means: the same name, or the only name that starts with it.
 * Capital letters make no difference.
 * @param {string} name
 * @param {Ingredient[]} ingredients
 * @returns {{ ingredient?: Ingredient, many: boolean }} many: more than one name starts with it.
 */
export function findIngredient(name, ingredients) {
	const lower = name.toLowerCase();
	const same = ingredients.find((ingredient) => ingredient.name.toLowerCase() === lower);
	if (same) return { ingredient: same, many: false };

	const starts = ingredients.filter((ingredient) =>
		ingredient.name.toLowerCase().startsWith(lower)
	);
	return starts.length === 1 ? { ingredient: starts[0], many: false } : { many: starts.length > 1 };
}
