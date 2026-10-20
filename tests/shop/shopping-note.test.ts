import { describe, expect, it } from 'vitest';
import { readTask, readTrip } from '../../src/shop/shopping-note';

const NEXT_TRIP = `- [ ] [[Larder/Pantry/Onions|Onions]]
- [ ] [[Larder/Pantry/Taco seasoning|Taco seasoning]]
- [ ] [[Larder/Pantry/Heavy cream|Heavy cream]]
- [ ] [[Larder/Pantry/Shell pasta|Shell pasta]]
- [ ] [[Larder/Pantry/Soy sauce|Soy sauce]]
`;

describe('the tasks of a shopping note', () => {
	it('the onions are the first task of the next trip, with no mark', () => {
		expect(readTrip(NEXT_TRIP)[0]).toEqual({
			link: 'Larder/Pantry/Onions',
			name: 'Onions',
			inCart: false,
			brand: ''
		});
	});

	it('the taco seasoning with a mark is in the cart, with the brand of the photo "Taco seasoning - Brand A.jpg"', () => {
		const task = readTask(
			'- [x] [[Larder/Pantry/Taco seasoning|Taco seasoning]] · [[Taco seasoning - Brand A.jpg]]'
		);
		expect(task).toEqual({
			link: 'Larder/Pantry/Taco seasoning',
			name: 'Taco seasoning',
			inCart: true,
			brand: '[[Taco seasoning - Brand A.jpg]]'
		});
	});

	it('the task "- [ ] Soap" is the item "Soap", with no link', () => {
		expect(readTask('- [ ] Soap')).toEqual({ link: null, name: 'Soap', inCart: false, brand: '' });
	});
});

describe('a bad shopping note', () => {
	it('the next trip with the task "- [ ] " and no text keeps its 5 tasks', () => {
		expect(readTrip(`${NEXT_TRIP}- [ ] \n- [ ]  \n`)).toHaveLength(5);
	});
});
