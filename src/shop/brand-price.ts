// Each brand has its own price: Brand A costs 2.49, and Brand B costs 1.99. So the price of a line
// at put away starts from the regular price of its brand.

import type { Brand } from '../pantry/brands';
import { brandAt } from './bought-brand';

// A receipt row with a price and no sale mark, with the cell of its brand.
export type RegularRow = { brand: string; price: string };

// The price of the newest regular row with this brand. With no such row, or with no brand, it is the
// regular price of any brand. `regulars` has the newest row first.
export function regularOfBrand(regulars: RegularRow[], brands: Brand[], cell: string): string {
	const at = brandAt(cell, brands);
	const own = at === null ? undefined : regulars.find((row) => brandAt(row.brand, brands) === at);
	return own?.price ?? regulars[0]?.price ?? '';
}
