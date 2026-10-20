import { describe, expect, it } from 'vitest';
import { completeReceipt, linesIn, newReceipt, withLines } from '../../src/shop/receipt';

const RECEIPT = `---
status: complete
date: 2026-10-14
store: "Market A"
---

| Item                                              | Brand                             | Amount | Price | Sale | Place          | Use by |
| ------------------------------------------------- | --------------------------------- | ------ | ----- | ---- | -------------- | ------ |
| [[Larder/Pantry/Taco seasoning\\|Taco seasoning]] | [[Taco seasoning - Brand A.jpg]] | 28 g   | 1.79  | yes | Kitchen pantry |        |
| [[Larder/Pantry/Milk\\|Milk]]                     |                                   | 3.79 l | 3.99  |      | Fridge         | 2026-10-29 |
| [[Larder/Pantry/Eggs\\|Eggs]]                     |                                   | 12     | 3.49  |      | Fridge         | 2026-11-16 |
`;

describe('the receipt that the plugin writes', () => {
	it('the 3 lines of the receipt of 2026-10-14 read back the same from a new receipt', () => {
		const lines = linesIn(RECEIPT);
		expect(linesIn(newReceipt('2026-10-20', 'Market A', lines))).toEqual(lines);
	});

	it('the text "Mum comes on Friday." above the table stays the same text when the plugin completes the receipt', () => {
		const lines = linesIn(RECEIPT);
		const active = withLines(newReceipt('2026-10-20', 'Market A', []), lines).replace(
			'---\n\n|',
			'---\n\nMum comes on Friday.\n\n|'
		);
		const complete = completeReceipt(active, lines, '');

		expect(complete).toContain('---\n\nMum comes on Friday.\n\n| Item');
		expect(linesIn(complete)).toEqual(lines);
	});

	it('the text of the note of the trip goes above the table of the complete receipt', () => {
		const lines = linesIn(RECEIPT);
		const complete = completeReceipt(newReceipt('2026-10-20', '', lines), lines, 'Mum comes on Friday.');
		expect(complete).toContain('Mum comes on Friday.\n\n| Item');
	});
});
