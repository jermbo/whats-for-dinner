// The text of a recipe note from the fields of intake. It is a correct RecipeMD note, so the
// kitchen reads it at once, and you can read it with no plugin.

import { parseAmount, splitList } from '../recipemd/amount';
import { readLine } from './line';

export type IntakeIngredient = {
	text: string;
	// The path of the food item note that the line links to, or null for no link.
	link: string | null;
	// The food item note is not there yet. "Save" makes it: a stub, with no row.
	isNew: boolean;
};

export type IntakeDraft = {
	title: string;
	// The first tag is the type of the recipe, so the sequence is the sequence in which you added them.
	tags: string[];
	yields: string;
	// Where the recipe comes from, such as "One Pan Wonders, page 46".
	source: string;
	// The names of the source photos in the folder of the photos.
	sourcePhotos: string[];
	// More text below the source. A converted note keeps here each text that has no field.
	description: string;
	ingredients: IntakeIngredient[];
	steps: string[];
};

// Why "Save" cannot write a correct note yet, or null. The format needs a title, and a number in
// each yield.
export function whyNotSave(draft: Pick<IntakeDraft, 'title' | 'yields'>): string | null {
	if (!draft.title.trim()) return 'The recipe needs a title.';
	const yields = splitList(draft.yields);
	if (yields.some((one) => !parseAmount(one))) return 'Each yield needs a number, such as "4 servings".';
	return null;
}

export function recipeText(draft: IntakeDraft): string {
	const ingredients = draft.ingredients.filter((one) => one.text.trim()).map(ingredientText);
	const steps = draft.steps.map((step) => step.trim()).filter(Boolean);
	const yields = draft.yields.trim();
	const tags = draft.tags.map((tag) => tag.trim()).filter(Boolean);
	const source = draft.source.trim();

	const blocks = [
		`# ${draft.title.trim()}`,
		// The format has no field for a source or a photo. Its description is free text, and it is
		// the first part of the note that you see.
		source ? `Source: ${source}` : '',
		draft.sourcePhotos.map((name) => `![[${name}]]`).join('\n'),
		draft.description.trim(),
		tags.length ? `_${tags.join(', ')}_` : '',
		yields ? `**${yields}**` : '',
		'---',
		ingredients.join('\n'),
		steps.length ? '---' : '',
		steps.map((step, at) => `${at + 1}. ${step}`).join('\n')
	];
	return `${blocks.filter(Boolean).join('\n\n')}\n`;
}

// "200 g flour" with a link is `- _200 g_ [[Larder/Pantry/Flour|flour]]`. The link keeps the text
// that you typed, so the note reads as your recipe. ", beaten" comes after the link.
function ingredientText({ text, link }: IntakeIngredient): string {
	const { amount, name, extra } = readLine(text);
	const shown = link ? `[[${link.replace(/\.md$/, '')}|${name}]]` : name;
	return `- ${amount ? `_${amount.text}_ ` : ''}${shown}${extra}`;
}
