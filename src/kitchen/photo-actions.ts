import type { App } from 'obsidian';
import { shrinkPhoto } from '../cook/photo';
import { availablePath } from '../note-path';
import { brandPhotoName, brandPhotosFolder } from '../pantry/brand-photo-name';
import { photoName, photosFolder, type PhotoPart } from '../recipes/photo-name';
import type { KitchenWhere } from './note-kind';
import { pathInUse } from './path-in-use';

export type PhotoActionsHost = {
	app: App;
	where: KitchenWhere;
	today: string;
	makeFolderOf(path: string): Promise<void>;
};

// Saves a photo of a recipe in the folder of the photos, and gives the name for its link, such as
// `Pancakes 2026-10-18.jpg`. The plugin makes the folder with the first photo.
export function savePhoto(
	host: PhotoActionsHost,
	photo: Blob,
	recipe: string,
	part: PhotoPart
): Promise<string> {
	const folder = photosFolder(host.where.recipes);
	return saveIn(host, photo, folder, photoName(recipe, part, host.today), 1);
}

// Saves the photo of a brand in the folder `Photos` of the pantry folder, and gives the name for its
// link, such as `Taco seasoning - Brand A.jpg`.
export function saveBrandPhoto(
	host: PhotoActionsHost,
	photo: Blob,
	food: string,
	brand: string
): Promise<string> {
	const folder = brandPhotosFolder(host.where.pantry);
	return saveIn(host, photo, folder, brandPhotoName(food, brand, host.today), 2);
}

async function saveIn(
	host: PhotoActionsHost,
	photo: Blob,
	folder: string,
	name: string,
	first: number
): Promise<string> {
	const { vault } = host.app;
	const path = availablePath(`${folder}/${name}`, 'jpg', (path) => pathInUse(vault, path), first);
	await host.makeFolderOf(path);
	await vault.createBinary(path, await shrinkPhoto(photo));
	return path.slice(folder.length + 1);
}
