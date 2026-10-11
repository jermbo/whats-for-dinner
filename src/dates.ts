// Dates are text of the form year-month-day, in the time of the device.

const pad = (value: number) => String(value).padStart(2, '0');

export function today(): string {
	const now = new Date();
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
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
