import { describe, expect, it } from 'vitest';
import { readReceipt } from '../../src/shop/read-receipt';

const PROPERTIES = { status: 'complete', date: '2026-10-14', store: 'Market A' };

const RECEIPT = `| Item                                              | Brand                             | Amount | Price | Sale | Place          | Use by |
| ------------------------------------------------- | --------------------------------- | ------ | ----- | ---- | -------------- | ------ |
| [[Larder/Pantry/Taco seasoning\\|Taco seasoning]] | [[Taco seasoning - Brand A.jpg]] | 28 g   | 1.79  | yes | Kitchen pantry |        |
| [[Larder/Pantry/Milk\\|Milk]]                     |                                   | 3.79 l | 3.99  |      | Fridge         | 2026-10-29 |
| [[Larder/Pantry/Eggs\\|Eggs]]                     |                                   | 12     | 3.49  |      | Fridge         | 2026-11-16 |
`;

const rowsOf = (body: string) => readReceipt('2026-10-14', PROPERTIES, body)?.rows ?? [];

describe('the rows of a receipt', () => {
	it('the receipt of 2026-10-14 has 3 lines', () => {
		expect(rowsOf(RECEIPT).map((row) => row.name)).toEqual(['Taco seasoning', 'Milk', 'Eggs']);
	});

	it('the milk is 3.79 l at 3.99, in "Fridge", with the use-by date 2026-10-29', () => {
		expect(rowsOf(RECEIPT)[1]).toMatchObject({
			link: 'Larder/Pantry/Milk',
			amount: '3.79 l',
			price: '3.99',
			onSale: false,
			place: 'Fridge',
			useBy: '2026-10-29'
		});
	});

	it('the taco seasoning is on sale at 1.79, with the brand of its photo', () => {
		expect(rowsOf(RECEIPT)[0]).toMatchObject({
			price: '1.79',
			onSale: true,
			brand: '[[Taco seasoning - Brand A.jpg]]'
		});
	});

	it('the receipt has the day 2026-10-14 and the store "Market A"', () => {
		expect(readReceipt('2026-10-14', PROPERTIES, RECEIPT)).toMatchObject({
			day: '2026-10-14',
			store: 'Market A',
			active: false
		});
	});
});

describe('a bad receipt', () => {
	it('the price "about 4" on the eggs does not change the milk at 3.99', () => {
		const rows = rowsOf(RECEIPT.replace('| 3.49  |', '| about 4 |'));
		expect(rows.map((row) => row.price)).toEqual(['1.79', '3.99', 'about 4']);
	});

	it('a row of 3 cells is a line with no place, and the other lines stay', () => {
		const rows = rowsOf(`${RECEIPT}| [[Larder/Pantry/Onions\\|Onions]] | | 1 kg |\n`);
		expect(rows).toHaveLength(4);
		expect(rows[3]).toMatchObject({ name: 'Onions', amount: '1 kg', price: '', place: '' });
	});

	it('a row with no item is not a line', () => {
		expect(rowsOf(`${RECEIPT}|  | | 1 kg | 2.00 | | Fridge | |\n`)).toHaveLength(3);
	});

	it('a table with no row has no line', () => {
		expect(rowsOf(RECEIPT.split('\n').slice(0, 2).join('\n'))).toEqual([]);
	});
});
