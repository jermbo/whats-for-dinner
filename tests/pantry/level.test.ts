import { describe, expect, it } from 'vitest';
import { readFoodItem } from '../../src/pantry/food-item';
import { levelOf } from '../../src/pantry/level';

const foodItem = (name: string, table: string) => readFoodItem(name, {}, table);

const RICE = `| Place          | Left | Size  | Use by |
| -------------- | ---- | ----- | ------ |
| Kitchen pantry | 3/4  | 2 kg  |        |
| Kitchen pantry | full | 900 g |        |`;

const MILK_AT_A_QUARTER = `| Place  | Left | Size  | Use by     |
| ------ | ---- | ----- | ---------- |
| Fridge | 1/4  | 1 gal | 2026-10-22 |`;

const MILK = `${MILK_AT_A_QUARTER}
| Fridge | full | 1 gal | 2026-10-29 |`;

const eggs = (left: number) => `| Place  | Left    | Size | Use by     |
| ------ | ------- | ---- | ---------- |
| Fridge | ${left} | 12   | 2026-10-25 |`;

const WATER = `| Place          | Left | Size | Use by |
| -------------- | ---- | ---- | ------ |
| Kitchen pantry | tap  |      |        |`;

describe('the level of a food item', () => {
	it('the rice has 2400 g of 2900 g, and is not low', () => {
		expect(levelOf(foodItem('Rice', RICE))).toMatchObject({
			kind: 'mass',
			has: 2400,
			full: 2900,
			isLow: false
		});
	});

	it('the milk with only a jug at 1/4 is low', () => {
		expect(levelOf(foodItem('Milk', MILK_AT_A_QUARTER))?.isLow).toBe(true);
	});

	it('the milk with a jug at 1/4 and a full jug is not low, because the second jug is a reserve', () => {
		expect(levelOf(foodItem('Milk', MILK))?.isLow).toBe(false);
	});

	it('the eggs with only a carton of 3 of 12 are low', () => {
		expect(levelOf(foodItem('Eggs', eggs(3)))?.isLow).toBe(true);
	});

	it('the eggs with only a carton of 4 of 12 are not low', () => {
		expect(levelOf(foodItem('Eggs', eggs(4)))?.isLow).toBe(false);
	});

	it('the water of the row "tap" has no level', () => {
		expect(levelOf(foodItem('Water', WATER))).toBeNull();
	});
});
