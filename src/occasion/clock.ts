// A time of day is text such as "13:30". Minutes count from midnight. A length is a number of
// minutes, written as "3h", "45 min", or "1h30".

const CLOCK = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const LENGTH = /^(?:(\d+)\s*h(?:ours?)?(?:\s*(\d+)\s*(?:m|min|mins|minutes?)?)?|(\d+)\s*(?:m|min|mins|minutes?))$/i;

const DAY = 24 * 60;
const pad = (value: number) => String(value).padStart(2, '0');

export function clockToMinutes(text: string): number | null {
	const match = CLOCK.exec(text.trim());
	return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

// A time before midnight or after it stays on the same day, so a long dish never starts at "-1:00".
export function minutesToClock(minutes: number): string {
	const day = Math.min(DAY - 1, Math.max(0, Math.round(minutes)));
	return `${pad(Math.floor(day / 60))}:${pad(day % 60)}`;
}

// The time moved by a number of minutes. A text that is not a time of day stays as it is.
export function shiftClock(time: string, by: number): string {
	const minutes = clockToMinutes(time);
	return minutes === null ? time : minutesToClock(minutes + by);
}

export function lengthToMinutes(text: string): number | null {
	const match = LENGTH.exec(text.trim());
	if (!match) return null;
	const minutes = match[3] ? Number(match[3]) : Number(match[1]) * 60 + Number(match[2] ?? 0);
	return minutes > 0 ? minutes : null;
}

export function showLength(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (!hours) return `${rest} min`;
	return rest ? `${hours}h${pad(rest)}` : `${hours}h`;
}

export const roundUp = (minutes: number, step = 5) => Math.ceil(minutes / step) * step;
export const roundDown = (minutes: number, step = 5) => Math.floor(minutes / step) * step;

// The time on the device, in minutes from midnight.
export function minutesNow(): number {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
}
