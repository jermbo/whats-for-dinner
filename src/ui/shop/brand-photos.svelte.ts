import { SvelteSet } from 'svelte/reactivity';
import type { Kitchen } from '../../kitchen-state.svelte';
import { brandAt } from '../../shop/bought-brand';
import type { ShoppingRow } from '../../shop/shopping-list';

// The photo that shows large: its row, the name of its file, and the small photo that it grows
// from.
type Large = { key: string; path: string; photo: string; from: HTMLElement };

// The photos of the brands on the Shop stage: the package of a row, the brands below a row, and
// the photo that shows large. The brand comes from the note, so a new photo gets its brand when
// the note is read.
export class BrandPhotos {
	// The rows that show their brands below them. A tap on the package opens them.
	readonly packsOpen = new SvelteSet<string>();
	// An item of the cart shows only the brand that you took. A tap on it shows each brand again,
	// so that you can take a different one.
	readonly opened = new SvelteSet<string>();
	large = $state<Large | null>(null);

	constructor(
		private readonly kitchen: () => Kitchen,
		private readonly rows: () => ShoppingRow[]
	) {}

	readonly largeBrand = $derived.by(() => {
		const large = this.large;
		const row = large && this.rows().find((one) => one.key === large.key);
		return row ? this.brandsOf(row).find((brand) => brand.photos[0] === large?.photo) : undefined;
	});

	readonly urlFor = (row: ShoppingRow) => (photo: string) =>
		this.kitchen().photoUrl(photo, row.food?.path ?? '');

	readonly brandsOf = (row: ShoppingRow) => row.food?.item.brands ?? [];

	// The package of a row: the photo of its first brand, or its name, or nothing.
	readonly packOf = (row: ShoppingRow): { url: string } | { name: string } | null => {
		const brand = this.brandsOf(row)[0];
		const url = brand?.photos[0] ? this.urlFor(row)(brand.photos[0]) : null;
		if (url) return { url };
		return brand?.name ? { name: brand.name } : null;
	};

	readonly flipPack = (key: string) =>
		this.packsOpen.has(key) ? this.packsOpen.delete(key) : this.packsOpen.add(key);

	readonly showLarge = (row: ShoppingRow, at: number, from: HTMLElement) => {
		const photo = this.brandsOf(row)[at]?.photos[0];
		if (photo && row.food) this.large = { key: row.key, path: row.food.path, photo, from };
	};

	// The photo of a new package is a new brand with no name. It shows large at once, so that "In
	// cart" is one tap away.
	readonly takeNew = async (row: ShoppingRow, photo: Blob, from: HTMLElement) => {
		if (!row.food) return;
		const { path } = row.food;
		const name = await this.kitchen().brands.addBrandPhoto(path, photo);
		if (name) this.large = { key: row.key, path, photo: name, from };
	};

	// The brand that the item of the cart has, by its place among the brands of the food.
	readonly cartBrandOf = (row: ShoppingRow): number | null => {
		const item = this.kitchen().trip.find((one) => one.key === row.key);
		return item ? brandAt(item.brand, this.brandsOf(row)) : null;
	};
}
