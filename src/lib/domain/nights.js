// A night is one evening of the calendar, as a local date: "2026-10-05".

/**
 * The night of a time.
 * @param {number} time
 */
export function nightOf(time) {
	const date = new Date(time);
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * The start of the day of a night, in local time.
 * @param {string} night
 */
export function nightStart(night) {
	const [year, month, day] = night.split('-').map(Number);
	return new Date(year, month - 1, day).getTime();
}

/**
 * The night that is a number of days after a night. The date moves by days, not by hours:
 * a day with a change of the clock has 23 or 25 hours.
 * @param {string} night
 * @param {number} days
 */
export function nightAfter(night, days) {
	const date = new Date(nightStart(night));
	date.setDate(date.getDate() + days);
	return nightOf(date.getTime());
}

/**
 * The day of the week of a night, as "Date.getDay()" gives it: 0 is Sunday.
 * @param {string} night
 */
export function weekdayOf(night) {
	return new Date(nightStart(night)).getDay();
}

/**
 * A night as a short word: "Thu".
 * @param {string} night
 */
export function nightShort(night) {
	return new Date(nightStart(night)).toLocaleDateString(undefined, { weekday: 'short' });
}

/**
 * A night as a word: "Tonight", "Tomorrow", or the day of the week.
 * @param {string} night
 * @param {number} time
 */
export function nightName(night, time) {
	const today = nightOf(time);
	if (night === today) return 'Tonight';
	if (night === nightAfter(today, 1)) return 'Tomorrow';
	return new Date(nightStart(night)).toLocaleDateString(undefined, { weekday: 'long' });
}
