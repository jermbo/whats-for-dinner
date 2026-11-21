// The cook session of a day: which dishes you opened, where each one is, and its timers. It is
// saved on the device, so that a restart of Obsidian does not lose it. A dish has a key, not a
// place in the note, so a line that moves in the note does not point at a different dish.

import { isActive, type Occasion } from './occasions';

export type SavedTimer = { step: number; end: number; rung: boolean; seconds: number };

// What Cook Mode keeps for one dish.
export type SavedCook = {
	page: number;
	onCounter: boolean[];
	picked: (string | null)[];
	checked: boolean[];
	timers: SavedTimer[];
};

export type DaySession = {
	v: 1;
	savedAt: number;
	// "schedule", "timeline", "get-out", or "dish:" and the key of a dish.
	view: string;
	// The keys of the open dishes, in the sequence in which you opened them.
	order: string[];
	cooks: Record<string, SavedCook>;
	// The ticks of the list "Get out" of Cook day.
	ticked: Record<string, boolean>;
};

const HOUR = 60 * 60 * 1000;
// A session older than this is a session of an earlier day.
const LONGEST = 36 * HOUR;

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);
const isList = (value: unknown, is: (one: unknown) => boolean): boolean =>
	Array.isArray(value) && value.every(is);

const isTimer = (value: unknown): value is SavedTimer =>
	isRecord(value) &&
	typeof value.step === 'number' &&
	typeof value.end === 'number' &&
	typeof value.rung === 'boolean' &&
	typeof value.seconds === 'number';

const isCook = (value: unknown): value is SavedCook =>
	isRecord(value) &&
	typeof value.page === 'number' &&
	isList(value.onCounter, (one) => typeof one === 'boolean') &&
	isList(value.picked, (one) => one === null || typeof one === 'string') &&
	isList(value.checked, (one) => typeof one === 'boolean') &&
	isList(value.timers, isTimer);

// The session as saved text, or null when the text is not a session of this version. The data of
// the prototype has no migration: a text that does not fit is dropped.
export function readSession(text: unknown): DaySession | null {
	if (typeof text !== 'string') return null;
	try {
		const value: unknown = JSON.parse(text);
		if (!isRecord(value) || value.v !== 1 || typeof value.savedAt !== 'number') return null;
		if (typeof value.view !== 'string' || !isList(value.order, (one) => typeof one === 'string')) return null;
		if (!isRecord(value.cooks) || !Object.values(value.cooks).every(isCook)) return null;
		if (!isRecord(value.ticked) || !Object.values(value.ticked).every((one) => typeof one === 'boolean'))
			return null;
		return value as DaySession;
	} catch {
		return null;
	}
}

export const writeSession = (session: DaySession) => JSON.stringify(session);

// A session is of today when its occasion is active and it was saved in the last 36 hours.
export function isFresh(session: DaySession, occasion: Pick<Occasion, 'date'>, today: string, now: number) {
	return isActive(occasion, today) && now - session.savedAt < LONGEST;
}

// A session with nothing to keep is no session.
export const isEmpty = (session: DaySession) =>
	!session.order.length && !Object.values(session.ticked).some(Boolean);

// What the occasion screen tells about a session: the open dishes, and the timers that run.
export function describeSession(session: DaySession) {
	const timers = Object.values(session.cooks).flatMap((cook) => cook.timers);
	return { open: session.order.length, timers: timers.filter((timer) => !timer.rung).length };
}
