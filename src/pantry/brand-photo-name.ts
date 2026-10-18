// The name of a brand photo: the food item and the brand, such as `Taco seasoning - Brand A`. You
// type no name, and the name tells where the photo belongs. A brand with no name gives the date:
// `Taco seasoning - brand 2026-10-18`.

// The characters that a file name cannot have on each device go.
const clean = (name: string) =>
	name
		.replace(/[\\/:*?"<>|#^[\]]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

export function brandPhotoName(food: string, brand: string, date: string): string {
	const name = clean(brand);
	return name ? `${food} - ${name}` : `${food} - brand ${date}`;
}

// The photos of the brands are in this folder of the pantry folder, so that the plugin home keeps
// them.
export const brandPhotosFolder = (pantryFolder: string) => `${pantryFolder}/Photos`;
