import { describe, expect, it } from 'vitest';
import type { Facts } from '../../src/shop/facts';
import type { ReceiptLine } from '../../src/shop/receipt';
import type { TripItem } from '../../src/shop/trip';
import { hasOtherLines, isAllPutAway, isLastNotBought } from '../../src/shop/trip-end';

const FACTS: Facts = {
	intoPantry: true,
	amount: '2 kg',
	place: 'Pantry',
	useBy: '',
	price: '',
	onSale: false,
	brand: ''
};

const cartItem = (key: string, ats: number[]) => ({ key, lines: ats.map((at) => ({ at })) });

const RICE = cartItem('Larder/Pantry/Rice.md', [0, 1]);
const MILK = cartItem('Larder/Pantry/Milk.md', [0]);

describe('the put away of all lines', () => {
	it('ends the trip when each line of the cart is given', () => {
		const given = new Map([
			['Larder/Pantry/Rice.md#0', FACTS],
			['Larder/Pantry/Rice.md#1', FACTS],
			['Larder/Pantry/Milk.md#0', FACTS]
		]);
		expect(isAllPutAway([RICE, MILK], given)).toBe(true);
	});

	it('does not end the trip when the second bag of rice is left', () => {
		const given = new Map([
			['Larder/Pantry/Rice.md#0', FACTS],
			['Larder/Pantry/Milk.md#0', FACTS]
		]);
		expect(isAllPutAway([RICE, MILK], given)).toBe(false);
	});
});

describe('"Not bought" of a line', () => {
	it('ends the trip when it is the last line and a line is in the pantry', () => {
		expect(isLastNotBought([MILK], 'Larder/Pantry/Milk.md#0', true)).toBe(true);
	});

	it('does not end the trip when no line is in the pantry yet', () => {
		expect(isLastNotBought([MILK], 'Larder/Pantry/Milk.md#0', false)).toBe(false);
	});

	it('does not end the trip when a different line is left', () => {
		expect(isLastNotBought([RICE, MILK], 'Larder/Pantry/Milk.md#0', true)).toBe(false);
	});
});

describe('the other lines of an item', () => {
	const pathOf = (link: string) => `${link}.md`;
	const rice: TripItem = {
		key: 'Larder/Pantry/Rice.md',
		name: 'Rice',
		link: 'Larder/Pantry/Rice',
		inCart: true,
		brand: ''
	};
	const line = (name: string, link: string | null): ReceiptLine => ({
		name,
		link,
		facts: FACTS,
		done: false
	});

	it('finds a second bag of rice in the receipt', () => {
		const lines = [line('Rice', 'Larder/Pantry/Rice'), line('Rice', 'Larder/Pantry/Rice')];
		expect(hasOtherLines(lines, rice, pathOf)).toBe(true);
	});

	it('finds no other line when the rice has one row', () => {
		const lines = [line('Rice', 'Larder/Pantry/Rice'), line('Milk', 'Larder/Pantry/Milk')];
		expect(hasOtherLines(lines, rice, pathOf)).toBe(false);
	});
});
