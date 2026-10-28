import type { TFile } from 'obsidian';
import type { FoodNote } from '../note';
import { readBrands, type Verdict } from '../pantry/brands';
import { changeBrands, type BrandChange } from '../pantry/write-brands';
import { saveBrandPhoto, type PhotoActionsHost } from './photo-actions';
import { foodPath } from './pantry-actions';
import { productPhoto } from './product-lookup';
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

// The facts of a scan for the brands of a food item: the barcode, the brand of the label, and the
// address of its photo.
export type ScannedBrand = { barcode: string; brand: string; photo: string | null };

// After a scan, the brand keeps the barcode, so the next scan finds it with no connection. A brand
// with the name of the label gets the barcode. A new brand gets the photo of the product, so that
// you find the package on the shelf of the store.
async function keepBarcode(host: BrandActionsHost, path: string, scan: ScannedBrand) {
	const file = host.fileAt(path);
	if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
	const brands = readBrands(await host.app.vault.read(file));
	if (brands.some((brand) => brand.barcode === scan.barcode)) return;
	const wanted = scan.brand.trim().toLowerCase();
	const at = wanted ? brands.findIndex((brand) => brand.name.toLowerCase() === wanted) : -1;
	if (at !== -1) {
		const { name, verdict } = brands[at];
		const change: BrandChange = { is: 'change', at, name, verdict, photo: null, barcode: scan.barcode };
		await host.app.vault.process(file, (text) => changeBrands(text, [change]));
		return;
	}
	const blob = scan.photo ? await productPhoto(scan.photo) : null;
	const photo = blob ? await saveBrandPhoto(host, blob, file.basename, scan.brand) : null;
	await host.app.vault.process(file, (text) =>
		changeBrands(text, [{ is: 'add', name: scan.brand, verdict: null, photo, barcode: scan.barcode }])
	);
}

// What the form of the brands can write. Each write tells you in a notice when it fails.
export function brandActions(host: BrandActionsHost) {
	return {
		// By the name of the food item. A new food item has its note from "Add to pantry" before
		// this call.
		saveBrands: (name: string, drafts: BrandDraft[]) =>
			tried('The brands are not saved', () => saveBrands(host, foodPath(host, name), drafts)),
		// By the name of the food item, after "Add to pantry" wrote its packages.
		keepBarcode: (name: string, scan: ScannedBrand) =>
			tried('The barcode is not saved', () => keepBarcode(host, foodPath(host, name), scan)),
		// A new brand with no name, from the camera tile. It gives the name of the photo, or null.
		addBrandPhoto: (path: string, photo: Blob) =>
			triedFor<string | null>(
				'The photo is not saved',
				() => addBrandPhoto(host, path, photo),
				null
			)
	};
}
