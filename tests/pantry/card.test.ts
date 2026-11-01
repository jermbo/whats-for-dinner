import { describe, expect, it } from 'vitest';
import { newestPlace } from '../../src/pantry/card';
import { readFoodItem } from '../../src/pantry/food-item';

const item = (rows: string) =>
	readFoodItem('Black beans', {}, `| Place | Left | Size | Use by |\n| - | - | - | - |\n${rows}`);

describe('the place of a new package of a known food', () => {
	it('is the place of the newest package', () => {
		const beans = item('| Kitchen pantry | full | 425 g | |\n| Downstairs pantry | full | 425 g | |\n');
		expect(newestPlace(beans)).toBe('Downstairs pantry');
	});

	it('skips an empty package: the shelf of an empty can is not where the food is', () => {
		const beans = item('| Kitchen pantry | full | 425 g | |\n| Downstairs pantry | 0 | 425 g | |\n');
		expect(newestPlace(beans)).toBe('Kitchen pantry');
	});

	it('is null for a food item with no package, so the form uses the place of the last add', () => {
		expect(newestPlace(item(''))).toBeNull();
	});
});
