// The text of a recipe note from the fields of intake. It is a correct RecipeMD note, so the
// kitchen reads it at once, and you can read it with no plugin.

import { parseAmount, splitList } from '../recipemd/amount';
import { readLine } from './line';

export type IntakeIngredient =
	// "Dry:" in intake is the heading `## Dry` in the note: the ingredients below it are a group.
	| { is: 'group'; title: string }
	| {
			is: 'food';
			text: string;
			// The path of the food item note that the line links to, or null for no link.
			link: string | null;
			// The food item note is not there yet. "Save" makes it: a stub, with no row.
			isNew: boolean;
			// The text of the note for a line that you did not change in "Edit". "Save" writes it as it
			// is, so a link that you selected earlier stays.
			raw: string | null;
	  };

export type IntakeStep = {
	text: string;
	// The photo links of the step, such as `![[Pancakes - step 3 2026-10-18.jpg|best]]`. "Edit"
	// keeps them below the text, also when the text changes.
	photos: string[];
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
	steps: IntakeStep[];
	// The text of the instructions that is not a step, such as the records of "Cooked". "Edit"
	// keeps it after the steps.
	after: string;
};

// The text that intake starts with: empty, a note to convert, or a recipe to edit.
export type IntakeStart = {
	// The property block as the note has it, with its two lines of "---", or empty.
	properties: string;
	title: string;
	tags: string[];
	yields: string;
	source: string;
	sourcePhotos: string[];
	description: string;
	ingredients: { text: string; raw: string | null }[];
	steps: IntakeStep[];
	after: string;
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
	const steps = draft.steps.filter((step) => step.text.trim());
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
		...ingredientBlocks(draft.ingredients),
		steps.length || draft.after.trim() ? '---' : '',
		steps.map((step, at) => stepText(step, at + 1)).join('\n'),
		draft.after.trim()
	];
	return `${blocks.filter(Boolean).join('\n\n')}\n`;
}

// A list for each group, with its heading above it.
function ingredientBlocks(ingredients: IntakeIngredient[]): string[] {
	const blocks: string[] = [];
	let list: string[] = [];
	const endList = () => {
		if (list.length) blocks.push(list.join('\n'));
		list = [];
	};
	for (const one of ingredients) {
		if (one.is === 'group') {
			endList();
			blocks.push(`## ${one.title}`);
		} else if (one.text.trim()) {
			list.push(ingredientText(one));
		}
	}
	endList();
	return blocks;
}

// "200 g flour" with a link is `- _200 g_ [[Larder/Pantry/Flour|flour]]`. The link keeps the text
// that you typed, so the note reads as your recipe. ", beaten" comes after the link.
function ingredientText({ text, link, raw }: Extract<IntakeIngredient, { is: 'food' }>): string {
	if (raw !== null) return `- ${raw}`;
	const { amount, name, extra } = readLine(text);
	const shown = link ? `[[${link.replace(/\.md$/, '')}|${name}]]` : name;
	return `- ${amount ? `_${amount.text}_ ` : ''}${shown}${extra}`;
}

// A photo continues its list item, so its indent is the width of the number: "3. " is 3 spaces.
function stepText({ text, photos }: IntakeStep, number: number): string {
	const marker = `${number}. `;
	const indent = ' '.repeat(marker.length);
	return [`${marker}${text.trim()}`, ...photos.map((photo) => `${indent}${photo}`)].join('\n');
}
