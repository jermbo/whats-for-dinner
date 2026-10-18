// Adds the record of a cooked meal to the text of its recipe note, below the heading "Cooked".

import { RECORD_HEADING } from './steps';

export type CookRecord = {
	date: string;
	rating: number | null;
	note: string;
	// The name of the photo in the folder of the photos, or null.
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

const STARS = /^[★☆]+$/;

// The parts of each record after the date, newest first. A record is "date · stars · note".
function recordsOf(instructions: string | null): string[][] {
	const lines = (instructions ?? '').split(/\r?\n/);
	const start = lines.findIndex((line) => new RegExp(`^#+ ${RECORD_HEADING}\\s*$`).test(line));
	if (start === -1) return [];

	const records = lines.slice(start + 1).filter((line) => line.startsWith('- '));
	return records.reverse().map((record) => record.slice(2).split(' · ').slice(1));
}

// The newest note that you wrote after you cooked this recipe. Cook Mode shows it the next time.
export function lastNote(instructions: string | null): string | null {
	for (const parts of recordsOf(instructions)) {
		const note = parts.filter((part) => !STARS.test(part)).join(' · ');
		if (note) return note;
	}
	return null;
}

// The rating of the recipe: the stars of the newest record that has stars. The record keeps it, not
// a property, because a property would make the note an incorrect RecipeMD recipe.
export function lastRating(instructions: string | null): number | null {
	for (const parts of recordsOf(instructions)) {
		const stars = parts.find((part) => STARS.test(part));
		if (stars) return [...stars].filter((star) => star === '★').length || null;
	}
	return null;
}

// A record with its photo, for the gallery. The photo is the link below the line of the record.
export type PhotoRecord = { date: string; rating: number | null; note: string; photo: string };

const EMBED = /^!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]$/;

// The records that have a photo, newest first.
export function photoRecords(instructions: string | null): PhotoRecord[] {
	const lines = (instructions ?? '').split(/\r?\n/);
	const start = lines.findIndex((line) => new RegExp(`^#+ ${RECORD_HEADING}\\s*$`).test(line));
	if (start === -1) return [];

	const records: PhotoRecord[] = [];
	let last: Omit<PhotoRecord, 'photo'> | null = null;
	for (const line of lines.slice(start + 1)) {
		if (line.startsWith('- ')) {
			const [date, ...parts] = line.slice(2).split(' · ');
			const stars = parts.find((part) => STARS.test(part));
			const rating = stars ? [...stars].filter((star) => star === '★').length || null : null;
			last = { date, rating, note: parts.filter((part) => !STARS.test(part)).join(' · ') };
			continue;
		}
		const photo = EMBED.exec(line.trim());
		if (photo && last) records.push({ ...last, photo: photo[1] });
	}
	return records.reverse();
}
