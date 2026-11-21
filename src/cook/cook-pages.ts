import type { GetOutGroup } from './get-out';

export function cookPageCount(stepCount: number) {
	return stepCount + 1;
}

// Where Cook Mode is: the page (0 is "Get out", then one page for each step, and the last page
// finishes), and how many steps the recipe has.
export type CookProgress = { page: number; steps: number };

export function cookWhere({ page, steps }: CookProgress) {
	if (page === 0) return 'Get out';
	return page > steps ? 'Finishing' : `Step ${page} of ${steps}`;
}

// From 0 to 1: how far you are through the pages.
export const cookFraction = ({ page, steps }: CookProgress) => page / cookPageCount(steps);

export function cookSlideFrom(fromPage: number, toPage: number) {
	return toPage > fromPage ? 24 : -24;
}

export function cookGotOutCount(onCounter: boolean[]) {
	return onCounter.filter(Boolean).length;
}

export function cookGotOutOf(group: GetOutGroup, onCounter: boolean[]) {
	return `${group.rows.filter(({ at }) => onCounter[at]).length}/${group.rows.length}`;
}

// "8:00" under one hour, and "2:59:46" from one hour on, as a clock on a wall has it.
export function cookTimerClock(seconds: number) {
	const pad = (value: number) => String(value).padStart(2, '0');
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return hours ? `${hours}:${pad(minutes)}:${pad(seconds % 60)}` : `${minutes}:${pad(seconds % 60)}`;
}

export function cookSecondsLeft(end: number, now: number) {
	return Math.max(0, Math.ceil((end - now) / 1000));
}
