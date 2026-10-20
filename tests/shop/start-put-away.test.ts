import { describe, expect, it } from 'vitest';
import type { Facts } from '../../src/shop/facts';
import type { ReceiptLine } from '../../src/shop/receipt';
import { startLines } from '../../src/shop/start-put-away';
import type { TripItem } from '../../src/shop/trip';

const pathOf = (link: string) => `${link}.md`;

const facts = (amount: string, place: string, useBy = ''): Facts => ({
	intoPantry: true,
	amount,
	place,
	useBy,
	price: '',
	onSale: false,
	brand: ''
});

const line = (name: string, done: boolean, amount: string, place: string): ReceiptLine => ({
	link: `Larder/Pantry/${name}`,
	name,
	facts: facts(amount, place),
	done
});

const inCart = (name: string): TripItem => ({
	link: `Larder/Pantry/${name}`,
	name,
	inCart: true,
	brand: '',
	key: `Larder/Pantry/${name}.md`
});

const MILK_DONE = line('Milk', true, '3.79 l', 'Fridge');
const MILK = line('Milk', false, '3.79 l', 'Fridge');
const EGGS = line('Eggs', false, '12', 'Fridge');

// The line that the stage proposes for an item with no line.
const proposed = (item: TripItem) => [line(item.name, false, '1 kg', 'Kitchen pantry')];

describe('the lines of the receipt when put away starts', () => {
	it('the milk that is done and the eggs that are still in the cart keep their lines, so the receipt does not change', () => {
		expect(startLines([MILK_DONE, EGGS], [inCart('Eggs')], proposed, pathOf)).toBeNull();
	});

	it('the milk that is done keeps its line when the eggs leave the cart', () => {
		expect(startLines([MILK_DONE, EGGS], [], proposed, pathOf)).toEqual([MILK_DONE]);
	});

	it('the eggs that are not in the cart any more have no line', () => {
		expect(startLines([EGGS], [], proposed, pathOf)).toEqual([]);
	});

	it('the onions of the cart get a line, and the line of the milk stays the same', () => {
		const lines = startLines([MILK], [inCart('Milk'), inCart('Onions')], proposed, pathOf);
		expect(lines).toEqual([MILK, line('Onions', false, '1 kg', 'Kitchen pantry')]);
	});

	it('a receipt that has each item of the cart does not change', () => {
		expect(startLines([MILK, EGGS], [inCart('Milk'), inCart('Eggs')], proposed, pathOf)).toBeNull();
	});
});
