import { describe, expect, it } from 'vitest';
import { useByTimes } from '../../src/pantry/use-by-times';

describe('the use-by chips of "Add to pantry"', () => {
	const times = useByTimes('2026-11-01');
	const dateOf = (label: string) => times.find((time) => time.label === label)?.date;

	it('"1 week" is 7 days from today', () => {
		expect(dateOf('1 week')).toBe('2026-11-08');
	});

	it('"1 month" is 30 days, close enough for a shelf', () => {
		expect(dateOf('1 month')).toBe('2026-12-01');
	});

	it('"2 years" is 730 days, so a leap year makes it one day early', () => {
		expect(dateOf('2 years')).toBe('2028-10-31');
	});

	it('goes from the shortest time to the longest', () => {
		expect(times.map((time) => time.label)).toEqual([
			'1 week',
			'1 month',
			'3 months',
			'6 months',
			'1 year',
			'2 years'
		]);
	});
});
