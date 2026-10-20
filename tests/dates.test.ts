import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addDays, daysBetween, showDate, today } from '../src/dates';

describe('the count of days', () => {
	it('2026-10-20 to 2026-10-25 is 5 days', () => {
		expect(daysBetween('2026-10-20', '2026-10-25')).toBe(5);
	});

	it('2026-10-22 to 2026-10-21 is -1 day', () => {
		expect(daysBetween('2026-10-22', '2026-10-21')).toBe(-1);
	});

	it('3 days after 2026-10-30 is 2026-11-02, across the end of a month', () => {
		expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
	});

	it('3 days after 2026-12-30 is 2027-01-02, across the end of a year', () => {
		expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
	});
});

describe('the dates of the clock', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-10-20T12:00'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('today is 2026-10-20 when the clock is at 2026-10-20', () => {
		expect(today()).toBe('2026-10-20');
	});

	it('the text of 2027-01-02 has the year 2027, because it is not this year', () => {
		expect(showDate('2027-01-02')).toContain('2027');
	});

	it('the text of 2026-10-25 has no year, because it is this year', () => {
		expect(showDate('2026-10-25')).not.toContain('2026');
	});
});
