import type { TFile } from 'obsidian';
import type { FoodNote } from '../note';
import type { Verdict } from '../pantry/brands';
import { changeBrands, type BrandChange } from '../pantry/write-brands';
import { saveBrandPhoto, type PhotoActionsHost } from './photo-actions';
import { foodPath } from './pantry-actions';
import { triedFor, tried } from './tried';

// A brand of the form before "Save". `at` is its number in the section, or null for a new brand.
// `start` and `startVerdict` are what the form opened with. `photo` is a new photo from the camera.
export type BrandDraft = {
	at: number | null;
	start: string;
	name: string;
	startVerdict: Verdict | null;
	verdict: Verdict | null;
	photo: Blob | null;
	removed: boolean;
};

export type BrandActionsHost = PhotoActionsHost & {
	foods: FoodNote[];
	fileAt(path: string): TFile | null;
};

// "Save" of the form: each new photo becomes a file, and then the section gets each change in one
// write. A brand with no change writes nothing.
async function saveBrands(host: BrandActionsHost, path: string, drafts: BrandDraft[]) {
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
	{ at, start, name, startVerdict, verdict, photo, removed }: BrandDraft
): Promise<BrandChange | null> {
	if (removed) return at === null ? null : { is: 'remove', at };
	const file = photo ? await saveBrandPhoto(host, photo, food, name) : null;
	if (at === null) return file ? { is: 'add', name, verdict, photo: file } : null;
	const same = name.trim() === start && verdict === startVerdict;
	return file || !same ? { is: 'change', at, name, verdict, photo: file } : null;
}

// A photo from the store or from put away is a new brand with no name. The file and the section
// are written at once, so the brand is there before the next tap. It gives the name of the file.
async function addBrandPhoto(host: BrandActionsHost, path: string, photo: Blob) {
	const file = host.fileAt(path);
	if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
	const name = await saveBrandPhoto(host, photo, file.basename, '');
	await host.app.vault.process(file, (text) =>
		changeBrands(text, [{ is: 'add', name: '', verdict: null, photo: name }])
	);
	return name;
}

// What the form of the brands can write. Each write tells you in a notice when it fails.
export function brandActions(host: BrandActionsHost) {
	return {
		// By the name of the food item. A new food item has its note from "Add to pantry" before
		// this call.
		saveBrands: (name: string, drafts: BrandDraft[]) =>
			tried('The brands are not saved', () => saveBrands(host, foodPath(host, name), drafts)),
		// A new brand with no name, from the camera tile. It gives the name of the photo, or null.
		addBrandPhoto: (path: string, photo: Blob) =>
			triedFor<string | null>(
				'The photo is not saved',
				() => addBrandPhoto(host, path, photo),
				null
			)
	};
}
