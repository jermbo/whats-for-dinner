import { describe, expect, it } from 'vitest';
import { nearestLevel } from '../../src/pantry/left';

describe('the nearest level of a package', () => {
	it('0.32 of a package is at 1/4', () => {
		expect(nearestLevel(0.32)).toBe(0.25);
	});

	it('0.375 of a package is at 1/2, because the middle of two levels goes up', () => {
		expect(nearestLevel(0.375)).toBe(0.5);
	});

	it('0.05 of a package is at 1/4, because a package with food left is 1/4 or more', () => {
		expect(nearestLevel(0.05)).toBe(0.25);
	});

	it('nothing left is 0', () => {
		expect(nearestLevel(0)).toBe(0);
	});
});
