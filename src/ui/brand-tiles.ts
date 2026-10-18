import type { Brand } from '../pantry/brands';
import type { BrandTile } from './parts/BrandStrip.svelte';

// The brands of a food item as the strip shows them: the address of the first photo of each, or
// none for a brand that shows its name.
export const tilesOf = (brands: Brand[], urlOf: (photo: string) => string | null): BrandTile[] =>
	brands.map((brand, at) => ({
		key: String(at),
		name: brand.name,
		url: brand.photos[0] ? urlOf(brand.photos[0]) : null
	}));
