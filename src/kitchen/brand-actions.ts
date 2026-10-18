import type { TFile } from 'obsidian';
import { changeBrands, type BrandChange } from '../pantry/write-brands';
import { saveBrandPhoto, type PhotoActionsHost } from './photo-actions';

// A brand of the form before "Save". `at` is its number in the section, or null for a new brand.
// `start` is the name that the form opened with. `photo` is a new photo from the camera.
export type BrandDraft = {
	at: number | null;
	start: string;
	name: string;
	photo: Blob | null;
	removed: boolean;
};

export type BrandActionsHost = PhotoActionsHost & {
	fileAt(path: string): TFile | null;
};

// "Save" of the form: each new photo becomes a file, and then the section gets each change in one
// write. A brand with no change writes nothing.
export async function saveBrands(host: BrandActionsHost, path: string, drafts: BrandDraft[]) {
	const file = host.fileAt(path);
	if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
	const changes: BrandChange[] = [];
	for (const draft of drafts) {
		const change = await changeOf(host, file.basename, draft);
		if (change) changes.push(change);
	}
	if (changes.length) await host.app.vault.process(file, (text) => changeBrands(text, changes));
}

async function changeOf(
	host: BrandActionsHost,
	food: string,
	{ at, start, name, photo, removed }: BrandDraft
): Promise<BrandChange | null> {
	if (removed) return at === null ? null : { is: 'remove', at };
	const file = photo ? await saveBrandPhoto(host, photo, food, name) : null;
	if (at === null) return file ? { is: 'add', name, photo: file } : null;
	return file || name.trim() !== start ? { is: 'change', at, name, photo: file } : null;
}

// A photo from the store or from put away is a new brand with no name. The file and the section
// are written at once, so the brand is there before the next tap. It gives the name of the file.
export async function addBrandPhoto(host: BrandActionsHost, path: string, photo: Blob) {
	const file = host.fileAt(path);
	if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
	const name = await saveBrandPhoto(host, photo, file.basename, '');
	await host.app.vault.process(file, (text) =>
		changeBrands(text, [{ is: 'add', name: '', photo: name }])
	);
	return name;
}
