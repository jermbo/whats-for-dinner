import { describe, expect, it } from 'vitest';
import type { FoodNote } from '../../src/note';
import { readFoodItem } from '../../src/pantry/food-item';
import { isSoon, stockRows } from '../../src/pantry/views';

const SOON_DAYS = 5;

const HEADER = '| Place | Left | Size | Use by |\n| ----- | ---- | ---- | ------ |';

const food = (name: string, row: string): FoodNote => ({
	path: `Larder/Pantry/${name}.md`,
	item: readFoodItem(name, {}, `${HEADER}\n${row}`)
});

const lineOf = (note: FoodNote) => stockRows([note])[0];

const OPEN_CARTON = lineOf(food('Eggs', '| Fridge | 4 | 12 | 2026-10-25 |'));
const NEW_CARTON = lineOf(food('Eggs', '| Fridge | 12 | 12 | 2026-11-16 |'));
const SPINACH = lineOf(food('Spinach', '| Fridge | 1/2 | 284 g | 2026-10-21 |'));

describe('food to use soon', () => {
	it('the eggs of 2026-10-25 are to use soon on 2026-10-20, in 5 days', () => {
		expect(isSoon(OPEN_CARTON, '2026-10-20', SOON_DAYS)).toBe(true);
	});

	it('the eggs of 2026-11-16 are not to use soon on 2026-10-20', () => {
		expect(isSoon(NEW_CARTON, '2026-10-20', SOON_DAYS)).toBe(false);
	});

	it('the spinach of 2026-10-21 is to use soon on 2026-10-22, because a date in the past is soon too', () => {
		expect(isSoon(SPINACH, '2026-10-22', SOON_DAYS)).toBe(true);
	});
});
