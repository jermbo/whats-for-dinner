import { TFile } from 'obsidian';
import { recipeText, type IntakeDraft } from '../intake/recipe-text';
import { availablePath, notePathIn } from '../note-path';
import { pathInUse } from './path-in-use';
import { savePhoto, type PhotoActionsHost } from './photo-actions';

export type IntakeActionsHost = PhotoActionsHost;

// A stub is the note of a food item with no row, so the pantry knows the food and the Shop part
// shows it as out. Two lines with the same new food make one stub.
async function makeStubs(host: IntakeActionsHost, draft: Pick<IntakeDraft, 'ingredients'>) {
	const paths = new Set(
		draft.ingredients.flatMap((one) => (one.is === 'food' && one.isNew && one.link ? [one.link] : []))
	);
	for (const path of paths) {
		if (pathInUse(host.app.vault, path)) continue;
		await host.makeFolderOf(path);
		await host.app.vault.create(path, '');
	}
}

// Writes the note of a new recipe in the recipes folder, and gives its path. A name in use gets a
// number, such as "Pancakes 1.md", so "Save" never writes over a recipe. The source photos go into
// the vault only now: intake that you close with no "Save" leaves nothing.
export async function saveRecipe(
	host: IntakeActionsHost,
	draft: IntakeDraft,
	photos: Blob[]
): Promise<string> {
	const wanted = notePathIn(host.where.recipes, draft.title).replace(/^\//, '');
	const path = availablePath(wanted.replace(/\.md$/, ''), 'md', (path) =>
		pathInUse(host.app.vault, path)
	);
	const name = path.slice(path.lastIndexOf('/') + 1, -'.md'.length);

	const sourcePhotos = [...draft.sourcePhotos];
	for (const photo of photos) sourcePhotos.push(await savePhoto(host, photo, name, { is: 'source' }));

	await host.makeFolderOf(path);
	await host.app.vault.create(path, recipeText({ ...draft, sourcePhotos }));
	await makeStubs(host, draft);
	return path;
}

// "Convert" and "Edit" replace the text of the same note. The note keeps its name, so each link to
// it still works, and its property block stays. The core plugin "File recovery" keeps the old
// version. New source photos come after the photos that the note has.
export async function replaceRecipe(
	host: IntakeActionsHost,
	path: string,
	properties: string,
	draft: IntakeDraft,
	photos: Blob[]
) {
	const file = host.app.vault.getAbstractFileByPath(path);
	if (!(file instanceof TFile)) throw new Error(`The note "${path}" is not in the vault now.`);

	const sourcePhotos = [...draft.sourcePhotos];
	for (const photo of photos) {
		sourcePhotos.push(await savePhoto(host, photo, file.basename, { is: 'source' }));
	}
	const text = recipeText({ ...draft, sourcePhotos });
	await host.app.vault.process(file, () => (properties ? `${properties}\n${text}` : text));
	await makeStubs(host, draft);
}
