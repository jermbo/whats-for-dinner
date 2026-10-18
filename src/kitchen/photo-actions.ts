import type { App } from 'obsidian';
import { shrinkPhoto } from '../cook/photo';
import { availablePath } from '../note-path';
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
export async function savePhoto(
	host: PhotoActionsHost,
	photo: Blob,
	recipe: string,
	part: PhotoPart
): Promise<string> {
	const { vault } = host.app;
	const folder = photosFolder(host.where.recipes);
	const base = `${folder}/${photoName(recipe, part, host.today)}`;
	const path = availablePath(base, 'jpg', (path) => pathInUse(vault, path));
	await host.makeFolderOf(path);
	await vault.createBinary(path, await shrinkPhoto(photo));
	return path.slice(folder.length + 1);
}
