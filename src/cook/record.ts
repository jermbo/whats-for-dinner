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

// The newest note that you wrote after you cooked this recipe. Cook Mode shows it the next time.
export function lastNote(instructions: string | null): string | null {
	const lines = (instructions ?? '').split(/\r?\n/);
	const start = lines.findIndex((line) => new RegExp(`^#+ ${RECORD_HEADING}\\s*$`).test(line));
	if (start === -1) return null;

	const records = lines.slice(start + 1).filter((line) => line.startsWith('- '));
	for (const record of records.reverse()) {
		// A record is "date · stars · note". The date is always there.
		const [, ...parts] = record.slice(2).split(' · ');
		const note = parts.filter((part) => !/^[★☆]+$/.test(part)).join(' · ');
		if (note) return note;
	}
	return null;
}
