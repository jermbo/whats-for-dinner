// The name of a photo of a recipe: the recipe, the part, and the date. You type no name, and the
// name tells where the photo belongs: `Pancakes - step 3 2026-10-18`. The date has no time of
// day, because you do not cook one recipe two times on one day.

export type PhotoPart = { is: 'meal' } | { is: 'step'; step: number } | { is: 'source' };

export function photoName(recipe: string, part: PhotoPart, date: string): string {
	if (part.is === 'step') return `${recipe} - step ${part.step} ${date}`;
	if (part.is === 'source') return `${recipe} - source ${date}`;
	return `${recipe} ${date}`;
}

// The photos of the recipes are in this folder of the recipes folder.
export const photosFolder = (recipesFolder: string) =>
	recipesFolder ? `${recipesFolder}/Photos` : 'Photos';
