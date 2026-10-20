import { describe, expect, it } from 'vitest';
import { stocksOf, type Facts } from '../../src/shop/facts';

const facts = (change: Partial<Facts>): Facts => ({
	intoPantry: true,
	amount: '',
	place: '',
	useBy: '',
	price: '',
	onSale: false,
	brand: '',
	...change
});

describe('the package that goes into the pantry', () => {
	it('the milk of 1 gal in "Fridge" with the use-by date 2026-10-29 is a full jug of 1 gal in "Fridge" with that date', () => {
		const [jug, ...others] = stocksOf(facts({ amount: '1 gal', place: 'Fridge', useBy: '2026-10-29' }));
		expect(others).toEqual([]);
		expect(jug).toMatchObject({ place: 'Fridge', left: 'full', sizeText: '1 gal', useBy: '2026-10-29' });
	});

	it('the eggs of 12 in "Fridge" are a carton of 12 of 12 in "Fridge"', () => {
		expect(stocksOf(facts({ amount: '12', place: 'Fridge' }))).toMatchObject([
			{ place: 'Fridge', left: '12', sizeText: '12', useBy: null }
		]);
	});

	it('the batteries that do not go into the pantry give no package', () => {
		expect(stocksOf(facts({ intoPantry: false, amount: '4' }))).toEqual([]);
	});
});
