// The plan of the day: your dishes of an occasion, with the time of each one and the hour at which
// you start it. The start is the serve time minus the time of the dish. The note can fix either one.

import { readSteps } from '../cook/steps';
import { showName } from '../match/names';
import type { RecipeEntry } from '../recipes/types';
import { clockToMinutes, minutesToClock, roundDown, roundUp } from './clock';
import type { Dish } from './occasion-note';
import type { Occasion } from './occasions';

export type PlanDish = {
	// The place of the dish in the note.
	index: number;
	// A name for the dish that stays when a line moves: the recipe or the name, and its count among the
	// lines with the same recipe or name.
	key: string;
	dish: Dish;
	name: string;
	// The recipe, or null for a dish with only a name.
	entry: RecipeEntry | null;
	// How long the dish takes, or null when nobody knows.
	minutes: number | null;
	// The time is a guess from the steps of the recipe, not a field of the line.
	guessed: boolean;
	// The hour at which you start, as hour:minute, or null. A dish that is ready has none.
	start: string | null;
};

// The steps tell the time: the first time of each step, added, and rounded up to 5 minutes. A recipe
// with no time in its steps has no guess.
export function guessMinutes(entry: RecipeEntry): number | null {
	const seconds = readSteps(entry.recipe).reduce((sum, step) => sum + (step.seconds ?? 0), 0);
	return seconds > 0 ? roundUp(seconds / 60) : null;
}

function startOf(dish: Dish, minutes: number | null, serve: string | null): string | null {
	if (dish.ready) return null;
	if (dish.start !== null) return dish.start;
	const end = serve === null ? null : clockToMinutes(serve);
	return end === null || minutes === null ? null : minutesToClock(roundDown(end - minutes));
}

// Your dishes: the ones with no person. A dish with no mark comes first, by its start, and a dish
// with no start comes last, in the sequence of the note. A dish with a mark goes below them.
export function planOf(occasion: Occasion, entryOf: (path: string | null) => RecipeEntry | null): PlanDish[] {
	const seen = new Map<string, number>();
	const all = occasion.dishes.flatMap((dish, index): PlanDish[] => {
		const what = dish.path ?? dish.name;
		const count = seen.get(what) ?? 0;
		seen.set(what, count + 1);
		if (dish.person !== null) return [];
		const entry = entryOf(dish.path);
		const guess = dish.minutes === null && entry ? guessMinutes(entry) : null;
		const minutes = dish.minutes ?? guess;
		return [
			{
				index,
				key: `${what}#${count}`,
				dish,
				name: entry ? showName(entry.recipe.title) : dish.name,
				entry,
				minutes,
				guessed: guess !== null,
				start: startOf(dish, minutes, occasion.serve)
			}
		];
	});

	const rank = (one: PlanDish) => (one.dish.ready ? 2 : one.start === null ? 1 : 0);
	const hour = (one: PlanDish) => clockToMinutes(one.start ?? '') ?? 0;
	return all.sort((a, b) => rank(a) - rank(b) || (rank(a) === 0 ? hour(a) - hour(b) : 0) || a.index - b.index);
}

// The dish that you must start next: the earliest start of the dishes that wait. `minutes` is the
// time until its start, and it is negative when the dish is late.
export type NextUp = { index: number; name: string; minutes: number };

export function nextUp(plan: PlanDish[], started: number[], now: number): NextUp | null {
	const waiting = plan
		.filter((one) => !one.dish.ready && !started.includes(one.index))
		.flatMap((one) => {
			const at = clockToMinutes(one.start ?? '');
			return at === null ? [] : [{ index: one.index, name: one.name, at }];
		})
		.sort((a, b) => a.at - b.at)[0];
	return waiting ? { index: waiting.index, name: waiting.name, minutes: waiting.at - now } : null;
}

// How near the start is: "soon" from 15 minutes before it, and "due" from the start on.
export type Urgency = 'later' | 'soon' | 'due';
const SOON = 15;

export function urgencyOf(start: string | null, now: number): Urgency {
	const at = start === null ? null : clockToMinutes(start);
	if (at === null) return 'later';
	if (now >= at) return 'due';
	return at - now <= SOON ? 'soon' : 'later';
}
