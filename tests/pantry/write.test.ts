import { describe, expect, it } from 'vitest';
import { makeStock, readStocks } from '../../src/pantry/food-item';
import { replaceStocks } from '../../src/pantry/write';

const MILK_PROPERTIES = `---
aliases:
  - whole milk
staple: often
bought: 2026-10-14
---`;

const MILK_BRANDS = `## Brands

- Store brand · buy again`;

const MILK = `${MILK_PROPERTIES}

| Place  | Left | Size  | Use by     |
| ------ | ---- | ----- | ---------- |
| Fridge | 1/4  | 1 gal | 2026-10-22 |
| Fridge | full | 1 gal | 2026-10-29 |

${MILK_BRANDS}
`;

const RICE = `---
staple: sometimes
---

| Place          | Left | Size  | Use by |
| -------------- | ---- | ----- | ------ |
| Kitchen pantry | 3/4  | 2 kg  |        |
| Kitchen pantry | full | 900 g |        |
`;

describe('the rows of a food item note', () => {
	it('the milk has 2 rows in "Fridge", with the use-by dates 2026-10-22 and 2026-10-29', () => {
		const stocks = readStocks(MILK);
		expect(stocks.map((stock) => [stock.place, stock.left, stock.useBy])).toEqual([
			['Fridge', '1/4', '2026-10-22'],
			['Fridge', 'full', '2026-10-29']
		]);
	});

	it('the milk with the first jug at 1/2 reads back with the jug at 1/2', () => {
		const [, full] = readStocks(MILK);
		const half = makeStock('Fridge', '1/2 gal', '2026-10-22', '1 gal');
		const text = replaceStocks(MILK, [half, full]);

		expect(readStocks(text).map((stock) => [stock.left, stock.sizeText, stock.useBy])).toEqual([
			['1/2', '1 gal', '2026-10-22'],
			['full', '1 gal', '2026-10-29']
		]);
	});

	it('the properties and the section "Brands" of the milk stay the same text at a write', () => {
		const [, full] = readStocks(MILK);
		const text = replaceStocks(MILK, [makeStock('Fridge', '1/2 gal', '2026-10-22', '1 gal'), full]);

		expect(text.startsWith(`${MILK_PROPERTIES}\n\n`)).toBe(true);
		expect(text).toContain(`\n\n${MILK_BRANDS}\n`);
	});

	it('the rice with the bag of 900 g at 0 has one row, because an empty package goes out', () => {
		const [bag] = readStocks(RICE);
		const text = replaceStocks(RICE, [bag, makeStock('Kitchen pantry', '0', '', '900 g')]);

		expect(readStocks(text).map((stock) => [stock.left, stock.sizeText])).toEqual([['3/4', '2 kg']]);
	});

	it('a line of text below the table of the rice stays the same text at a write', () => {
		const note = `${RICE.trimEnd()}\nThe 900 g bag is in the back.\n`;
		const text = replaceStocks(note, readStocks(note));

		expect(text).toContain('| Kitchen pantry | full | 900 g |        |\nThe 900 g bag is in the back.\n');
	});
});

describe('a bad food item note', () => {
	it('a note with properties and no table has no row', () => {
		expect(readStocks('---\nstaple: often\n---\n\nThe milk is in the fridge.\n')).toEqual([]);
	});

	it('a table with a header and no row has no row', () => {
		expect(readStocks('| Place | Left | Size | Use by |\n| ----- | ---- | ---- | ------ |\n')).toEqual([]);
	});

	it('the rice with a second row of `Left` "half" keeps its first row at 3/4 of 2 kg', () => {
		const note = RICE.replace('| full | 900 g |', '| half | 900 g |');
		const [first] = readStocks(note);

		expect([first.left, first.amountText, first.sizeText]).toEqual(['3/4', '1.5 kg', '2 kg']);
	});

	it('the rice with a size "2" and no unit gives its rows', () => {
		const note = RICE.replace('| 3/4  | 2 kg  |', '| 3/4  | 2     |');
		expect(readStocks(note)).toHaveLength(2);
	});

	// Bug 1: the reader cannot convert a level of a size with no unit, and the row is written empty.
	it.fails('the rice with a size "2" and no unit keeps "3/4" and "2" at a write', () => {
		const note = RICE.replace('| 3/4  | 2 kg  |', '| 3/4  | 2     |');
		const [bag] = readStocks(replaceStocks(note, readStocks(note)));

		expect([bag.left, bag.sizeText]).toEqual(['3/4', '2']);
	});

	// Bug 1: the same loss, for a row with "half" in `Left`.
	it.fails('the rice with a row of `Left` "half" keeps its size 900 g at a write', () => {
		const note = RICE.replace('| full | 900 g |', '| half | 900 g |');
		const [, bag] = readStocks(replaceStocks(note, readStocks(note)));

		expect([bag.left, bag.sizeText]).toEqual(['half', '900 g']);
	});
});
