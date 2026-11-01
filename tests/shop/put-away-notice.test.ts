import { describe, expect, it } from 'vitest';
import { putAwayNotice } from '../../src/shop/put-away-notice';

describe('the notice after put away', () => {
	it('names the one item that went into the pantry', () => {
		expect(putAwayNotice(['Rice'])).toBe('Rice is in the pantry.');
	});

	it('counts two items', () => {
		expect(putAwayNotice(['Rice', 'Milk'])).toBe('2 items are in the pantry.');
	});

	it('is null when nothing went into the pantry', () => {
		expect(putAwayNotice([])).toBeNull();
	});
});
