// The occasions of the vault: when one is active, which one the kitchen shows first, and which
// name and day can start a new one.

import { addDays, daysBetween } from '../dates';
import { readOccasion, type Dish, type Guest, type OccasionTask } from './occasion-note';

export type Occasion = {
	path: string;
	// The name of the note: "Thanksgiving 2026".
	name: string;
	// The property `date` as year-month-day, or null.
	date: string | null;
	dishes: Dish[];
	tasks: OccasionTask[];
	guests: Guest[];
};

const DAY = /^\d{4}-\d{2}-\d{2}$/;

// A property can be text, or a date that the YAML of the note made from that text.
function dateOf(value: unknown): string | null {
	if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
	return typeof value === 'string' && DAY.test(value.trim()) ? value.trim() : null;
}

export function readOccasionNote(
	path: string,
	name: string,
	properties: Record<string, unknown>,
	body: string
): Occasion {
	return { path, name, date: dateOf(properties.date), ...readOccasion(body) };
}

// You made the note on purpose, so it is active from the start. The day after is for the dishes
// that you did not mark. A note with no date has no end.
export const isActive = ({ date }: Pick<Occasion, 'date'>, today: string) =>
	date === null || today <= addDays(date, 1);

// "Thanksgiving 2026 · 5 days": the days to the date, as the nav shows them.
export function daysLabel(date: string | null, today: string): string | null {
	if (date === null) return null;
	const days = daysBetween(today, date);
	if (days === 0) return 'today';
	if (days === -1) return 'yesterday';
	return days === 1 ? '1 day' : `${days} days`;
}

// An occasion is past when its date is before today. A note with no date is never past.
export const isPast = ({ date }: Pick<Occasion, 'date'>, today: string) => date !== null && date < today;

// The occasions that a new one can start from: the 5 newest with a date before today.
export function pastOccasions(occasions: Occasion[], today: string): Occasion[] {
	return occasions
		.filter((occasion) => occasion.date !== null && occasion.date < today)
		.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
		.slice(0, 5);
}

// The signs that a name of a note cannot have, or that a link breaks on.
const SIGNS = ['\\', '/', ':', '*', '?', '"', '<', '>', '|', '#', '^', '[', ']'];

// What stops a name, or null. A name with spaces only is no name, and the form says nothing yet.
export function nameProblem(name: string, names: string[]): string | null {
	const text = name.trim();
	const sign = SIGNS.find((one) => text.includes(one));
	if (sign) return `A name cannot have ${sign}`;
	const taken = names.some((one) => one.toLowerCase() === text.toLowerCase());
	return taken ? 'An occasion has this name' : null;
}

// An occasion with a past day is over before you plan it.
export const dayProblem = (day: string, today: string) =>
	day && day < today ? 'This day is past' : null;
