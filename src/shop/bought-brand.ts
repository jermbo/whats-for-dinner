// The bought brand: the brand on a row of a receipt, or after the link of a cart task. The cell has
// the link to the first photo of the brand, because the plugin never renames a photo. So a receipt
// still finds its brand after the brand gets a name or a new name. A brand with no photo gives its
// name.

import type { Brand } from '../pantry/brands';

export const brandCell = (brand: Brand) =>
	brand.photos[0] ? `[[${brand.photos[0]}]]` : brand.name;

const LINK = /^!?\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]$/;
// Obsidian can write the folder into the link, so only the name of the file counts.
const fileOf = (link: string) => (link.split('/').pop() ?? link).trim().toLowerCase();

// The number of the brand that a cell names, or null. A cell links to one of the photos of the
// brand, or its text is the name of the brand. Capital and small letters are equal. A cell that is
// no brand of the food item counts as no brand.
export function brandAt(cell: string, brands: Brand[]): number | null {
	const text = cell.trim();
	if (!text) return null;
	const link = LINK.exec(text);
	const at = link
		? brands.findIndex((brand) => brand.photos.some((photo) => fileOf(photo) === fileOf(link[1])))
		: brands.findIndex((brand) => brand.name.toLowerCase() === text.toLowerCase());
	return at === -1 ? null : at;
}
