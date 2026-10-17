// Dates are text of the form year-month-day, in the time of the device.

const pad = (value: number) => String(value).padStart(2, '0');

const asText = (day: Date) =>
	`${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;

export function today(): string {
	return asText(new Date());
}

// The date that is a number of days after a date.
export function addDays(date: string, days: number): string {
	const day = new Date(`${date}T00:00`);
	day.setDate(day.getDate() + days);
	return asText(day);
}

// The count of days from one date to a second date. It is negative if the second date is earlier.
export function daysBetween(from: string, to: string): number {
	const day = 24 * 60 * 60 * 1000;
	return Math.round((Date.parse(`${to}T00:00`) - Date.parse(`${from}T00:00`)) / day);
}

// "13 Oct", with the year only when it is not this year.
export function showDate(date: string): string {
	const day = new Date(`${date}T00:00`);
	const year = day.getFullYear() === new Date().getFullYear() ? undefined : 'numeric';
	return day.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year });
}
