// The timeline of the day: one bar for each dish, on one axis of hours. The axis is the same when a
// dish is done: a done dish keeps its bar, so the whole day stays in view. A dish with no time has
// no bar.

import { clockToMinutes } from './clock';
import type { PlanDish } from './cook-plan';

// `done`: the bar is a dish that has its mark. It ends at the hour in `done 14:50` of its line, and
// it is as long as the time of the dish. A mark with no hour keeps the planned bar.
export type Bar = { dish: PlanDish; from: number; to: number; done: boolean };
export type Span = { from: number; to: number };

const HOUR = 60;
const DAY = 24 * HOUR;

function barOf(dish: PlanDish): Bar | null {
	const length = dish.minutes;
	if (dish.dish.ready) {
		const end = clockToMinutes(dish.doneAt ?? '');
		if (end !== null) return { dish, from: Math.max(0, end - (length ?? 0)), to: end, done: true };
		const from = clockToMinutes(dish.start ?? '');
		return from === null || length === null ? null : { dish, from, to: Math.min(DAY, from + length), done: true };
	}
	const from = clockToMinutes(dish.start ?? '');
	return from === null || length === null ? null : { dish, from, to: Math.min(DAY, from + length), done: false };
}

// `now` is the hour on the device on the day of the occasion, and null before it. The axis always
// holds now, so the red line is in view also when a dish is late.
export function timelineOf(
	plan: PlanDish[],
	serve: string | null,
	now: number | null
): { bars: Bar[]; span: Span; unplaced: PlanDish[] } {
	const bars = plan
		.flatMap((dish) => barOf(dish) ?? [])
		.sort((a, b) => a.from - b.from || a.dish.index - b.dish.index);
	const unplaced = plan.filter((one) => !bars.some((bar) => bar.dish === one));

	const end = serve === null ? null : clockToMinutes(serve);
	const starts = [...bars.map((bar) => bar.from), ...(now === null ? [] : [now])];
	const ends = [...bars.map((bar) => bar.to), ...(end === null ? [] : [end]), ...(now === null ? [] : [now])];
	// The axis goes from the hour of the first start to the hour of the last end, and it is at least
	// two hours long, so that one short dish does not fill the screen.
	const from = Math.floor(Math.min(...(starts.length ? starts : [9 * HOUR])) / HOUR) * HOUR;
	const to = Math.max(from + 2 * HOUR, Math.ceil(Math.max(...(ends.length ? ends : [from])) / HOUR) * HOUR);

	return { bars, span: { from, to }, unplaced };
}

// Where a time is on the axis, from 0 to 100.
export const percentOf = (minutes: number, { from, to }: Span) =>
	Math.min(100, Math.max(0, ((minutes - from) / (to - from)) * 100));

// The hour marks and the rules for the width that the chart has. A mark has a label, and a label
// needs room, so a narrow chart has a mark for each second or third hour. A rule is a thin line,
// so it needs less room, and it stays hourly while it can.
const STEPS = [30, 60, 120, 180, 240, 360, 720];
const MARK_PX = 56;
const RULE_PX = 14;

export function marksOf(span: Span, width: number): { marks: number[]; rules: number[] } {
	const perMinute = Math.max(width, 1) / (span.to - span.from);
	const every = (step: number) => {
		const at: number[] = [];
		for (let minutes = span.from; minutes <= span.to; minutes += step) at.push(minutes);
		return at;
	};
	const step = STEPS.find((one) => one * perMinute >= MARK_PX) ?? STEPS[STEPS.length - 1];
	return { marks: every(step), rules: perMinute * 60 >= RULE_PX ? every(60) : every(step) };
}
