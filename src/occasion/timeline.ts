// The timeline of the day: one bar for each dish, from its start to the end of its time, on one
// axis of hours. A dish with no start or no time has no bar.

import { clockToMinutes } from './clock';
import type { PlanDish } from './cook-plan';

export type Bar = { dish: PlanDish; from: number; to: number };
export type Span = { from: number; to: number; ticks: number[] };

const HOUR = 60;
const DAY = 24 * HOUR;

export function timelineOf(
	plan: PlanDish[],
	serve: string | null
): { bars: Bar[]; span: Span; unplaced: PlanDish[] } {
	const open = plan.filter((one) => !one.dish.ready);
	const bars = open.flatMap((dish): Bar[] => {
		const from = clockToMinutes(dish.start ?? '');
		return from === null || dish.minutes === null
			? []
			: [{ dish, from, to: Math.min(DAY, from + dish.minutes) }];
	});
	const unplaced = open.filter((one) => !bars.some((bar) => bar.dish === one));

	const end = serve === null ? null : clockToMinutes(serve);
	const starts = bars.map((bar) => bar.from);
	const ends = [...bars.map((bar) => bar.to), ...(end === null ? [] : [end])];
	// The axis goes from the hour of the first start to the hour of the last end, and it is at least
	// two hours long, so that one short dish does not fill the screen.
	const from = Math.floor(Math.min(...(starts.length ? starts : [9 * HOUR])) / HOUR) * HOUR;
	const to = Math.max(from + 2 * HOUR, Math.ceil(Math.max(...(ends.length ? ends : [from])) / HOUR) * HOUR);

	// An hour mark for each hour, or for each second hour when the day is long, so the marks fit.
	const every = to - from > 8 * HOUR ? 2 * HOUR : HOUR;
	const ticks: number[] = [];
	for (let at = from; at <= to; at += every) ticks.push(at);
	return { bars, span: { from, to, ticks }, unplaced };
}

// Where a time is on the axis, from 0 to 100.
export const percentOf = (minutes: number, { from, to }: Span) =>
	Math.min(100, Math.max(0, ((minutes - from) / (to - from)) * 100));
