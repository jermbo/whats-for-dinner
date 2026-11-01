import { addDays } from '../dates';

// The use-by chips of "Add to pantry". You read "best by 2028" on a can and think "2 years", and
// that is close enough for food on a shelf. A month is 30 days and a year is 365 days, so a date
// can be a few days off.
const TIMES: [label: string, days: number][] = [
	['1 week', 7],
	['1 month', 30],
	['3 months', 90],
	['6 months', 180],
	['1 year', 365],
	['2 years', 730]
];

export type UseByTime = { label: string; date: string };

export const useByTimes = (today: string): UseByTime[] =>
	TIMES.map(([label, days]) => ({ label, date: addDays(today, days) }));
