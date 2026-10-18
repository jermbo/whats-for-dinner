import type { App, TFile } from 'obsidian';
import { addRecord } from '../cook/record';
import { addStepPhoto as addPhotoLine, markBest } from '../cook/step-photo';
import type { CookResult, RecipeEntry } from './types';
import { markCooked } from './plan-actions';
import type { PlanActionsHost } from './plan-actions';
import { setStocks } from './pantry-actions';
import type { PantryActionsHost } from './pantry-actions';
import { savePhoto, type PhotoActionsHost } from './photo-actions';

export type CookActionsHost = PantryActionsHost &
	PlanActionsHost &
	PhotoActionsHost & {
		app: App;
		today: string;
		recipes: RecipeEntry[];
		fileAt(path: string): TFile | null;
		isPlanned(path: string): boolean;
	};

export async function finishCooking(host: CookActionsHost, path: string, result: CookResult) {
	for (const [foodPath, stocks] of result.stocks) await setStocks(host, foodPath, stocks);

	const file = host.fileAt(path);
	const entry = host.recipes.find((recipe) => recipe.path === path);
	if (file && entry) {
		const photo = result.photo
			? await savePhoto(host, result.photo, file.basename, { is: 'meal' })
			: null;
		const { rating, note } = result;
		const hasInstructions = entry.recipe.instructions !== null;
		const record = { date: host.today, rating, note, photo };
		await host.app.vault.process(file, (text) => addRecord(text, hasInstructions, record));
	}

	if (host.isPlanned(path)) await markCooked(host, path);
}

// A step photo goes into the vault at once, so that it stays when you close Cook Mode early.
export async function addStepPhoto(host: CookActionsHost, path: string, step: number, photo: Blob) {
	const file = host.fileAt(path);
	if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
	const name = await savePhoto(host, photo, file.basename, { is: 'step', step });
	await host.app.vault.process(file, (text) => addPhotoLine(text, step, name));
}

export async function setBestPhoto(host: CookActionsHost, path: string, step: number, name: string | null) {
	const file = host.fileAt(path);
	if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
	await host.app.vault.process(file, (text) => markBest(text, step, name));
}
