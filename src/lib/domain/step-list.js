import { newId } from '$lib/util/ids';

/** @typedef {import('$lib/types').RecipeStep} RecipeStep */

/**
 * A number or a mark at the start of a line: "1.", "2)", "Step 3:", "-", or "•". A space must
 * come after it, so that "1.5 liters" and "12:30" keep their numbers.
 */
const LINE_START = /^\s*(?:step\s*\d+\s*[.):]?|\d+\s*[.)]|[-*•–])\s+/i;

/**
 * The steps in a block of text: one step from each line. A method from a web page or from a
 * note has numbers at the start of its lines, and the list has its own numbers, so they go.
 * @param {string} text
 * @returns {string[]}
 */
export function splitLines(text) {
	return text
		.split(/\r?\n/)
		.map((line) => line.replace(LINE_START, '').trim())
		.filter(Boolean);
}

/**
 * A new step. It gets its ID here, and the ID never changes.
 * @param {string} [text]
 * @returns {RecipeStep}
 */
export function newStep(text = '') {
	return { id: newId(), text, photoIds: [], selectedPhotoId: null };
}

/**
 * Makes sure that the steps of a form end with an empty step: the row where the owner types
 * the next step. Without it, a recipe that has steps shows no place for a new step.
 * The save removes a step that stays empty.
 * @param {RecipeStep[]} steps
 */
export function endWithEmptyStep(steps) {
	if (steps.length === 0 || steps[steps.length - 1].text.trim()) steps.push(newStep());
}

/**
 * Divides the text of a step at the cursor, for Enter: the text before the cursor stays, and
 * the text after it becomes the next step. The text that is selected goes.
 * @param {string} text
 * @param {number} start The start of the selection.
 * @param {number} end The end of the selection.
 */
export function splitAtCursor(text, start, end) {
	return { before: text.slice(0, start).trimEnd(), after: text.slice(end).trimStart() };
}

/**
 * Puts the lines of a paste into the text of a step, at the cursor. The first line goes at
 * the cursor. The text after the cursor goes after the last line.
 * @param {string} text
 * @param {number} start The start of the selection.
 * @param {number} end The end of the selection.
 * @param {string[]} lines One line or more.
 * @returns {string[]} The text of the step, and the text of each new step after it.
 */
export function pasteAtCursor(text, start, end, lines) {
	const result = [...lines];
	result[0] = text.slice(0, start) + result[0];
	result[result.length - 1] += text.slice(end);
	return result;
}
