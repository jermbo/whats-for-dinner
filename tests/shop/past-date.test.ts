import { describe, expect, it } from 'vitest';
import { readFoodItem } from '../../src/pantry/food-item';
import { isPastDate } from '../../src/shop/past-date';

const SPINACH = readFoodItem(
	'Spinach',
	{},
	'| Place | Left | Size | Use by |\n| ----- | ---- | ---- | ------ |\n| Fridge | 1/2 | 284 g | 2026-10-21 |'
);

describe('food past its date', () => {
	it('the spinach of 2026-10-21 is past its date on 2026-10-22', () => {
		expect(isPastDate(SPINACH, '2026-10-22')).toBe(true);
	});

	it('the spinach of 2026-10-21 is not past its date on 2026-10-21, because the date of today is not past', () => {
		expect(isPastDate(SPINACH, '2026-10-21')).toBe(false);
	});
});
