// Adds the record of a cooked meal to the text of its recipe note, below the heading "Cooked".

import { RECORD_HEADING } from './steps';

export type CookRecord = {
	date: string;
	rating: number | null;
	note: string;
	// The path of the photo in the vault, or null.
	photo: string | null;
};

export function addRecord(text: string, hasInstructions: boolean, record: CookRecord): string {
	const stars = record.rating ? '★'.repeat(record.rating) + '☆'.repeat(5 - record.rating) : '';
	const note = record.note.trim().replace(/\s*\n\s*/g, ' ');
	const lines = [`- ${[record.date, stars, note].filter(Boolean).join(' · ')}`];
	if (record.photo) lines.push(`  ![[${record.photo}]]`);

	let result = text.trimEnd();
	// With no instructions, a heading is a group of ingredients. The rule makes it instructions.
	if (!hasInstructions) result += '\n\n---';
	if (!new RegExp(`^#+ ${RECORD_HEADING}\\s*$`, 'm').test(result)) {
		result += `\n\n## ${RECORD_HEADING}\n`;
	}
	return `${result}\n${lines.join('\n')}\n`;
}
