import type { GetOutGroup } from './get-out';

export function cookPageCount(stepCount: number) {
	return stepCount + 1;
}

export function cookSlideFrom(fromPage: number, toPage: number) {
	return toPage > fromPage ? 24 : -24;
}

export function cookGotOutCount(onCounter: boolean[]) {
	return onCounter.filter(Boolean).length;
}

export function cookGotOutOf(group: GetOutGroup, onCounter: boolean[]) {
	return `${group.rows.filter(({ at }) => onCounter[at]).length}/${group.rows.length}`;
}

export function cookTimerClock(seconds: number) {
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function cookSecondsLeft(end: number, now: number) {
	return Math.max(0, Math.ceil((end - now) / 1000));
}
