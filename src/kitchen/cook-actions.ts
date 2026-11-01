import type { App, TFile } from 'obsidian';
import { addRecord } from '../cook/record';
import { addStepPhoto as addPhotoLine, markBest } from '../cook/step-photo';
import type { RecipeEntry } from '../recipes/types';
import type { CookResult } from './types';
import { markDishReady, type OccasionActionsHost } from './occasion-actions';
import { isPlanned, markCooked } from './plan-actions';
import type { PlanActionsHost } from './plan-actions';
import { setCheck, setStocks } from './pantry-actions';
import type { PantryActionsHost } from './pantry-actions';
import { savePhoto, type PhotoActionsHost } from './photo-actions';
import { tried } from './tried';

export type CookActionsHost = PantryActionsHost &
	PlanActionsHost &
	PhotoActionsHost &
	OccasionActionsHost & {
		app: App;
		today: string;
		recipes: RecipeEntry[];
		fileAt(path: string): TFile | null;
	};

// A dish of an occasion that Cook Mode cooks: the occasion note, and the place of the dish in it.
export type CookedDish = { occasion: string; index: number };

async function finishCooking(
	host: CookActionsHost,
	path: string,
	result: CookResult,
	dish: CookedDish | null
) {
	for (const [foodPath, stocks] of result.stocks) await setStocks(host, foodPath, stocks);
	for (const foodPath of result.check) await setCheck(host, foodPath, true);

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

	// The week and the occasion stay apart: a dish of an occasion does not change the plan.
	if (dish) await markDishReady(host, dish.occasion, dish.index);
	else if (isPlanned(host, path)) await markCooked(host, path);
}

// A step photo goes into the vault at once, so that it stays when you close Cook Mode early.
async function addStepPhoto(host: CookActionsHost, path: string, step: number, photo: Blob) {
	const file = host.fileAt(path);
	if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
	const name = await savePhoto(host, photo, file.basename, { is: 'step', step });
	await host.app.vault.process(file, (text) => addPhotoLine(text, step, name));
}

async function setBestPhoto(host: CookActionsHost, path: string, step: number, name: string | null) {
	const file = host.fileAt(path);
	if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
	await host.app.vault.process(file, (text) => markBest(text, step, name));
}

// What Cook Mode can write. Each write tells you in a notice when it fails.
export function cookActions(host: CookActionsHost) {
	return {
		finishCooking: (path: string, result: CookResult, dish: CookedDish | null) =>
			tried('The meal is not saved', () => finishCooking(host, path, result, dish)),
		addStepPhoto: (path: string, step: number, photo: Blob) =>
			tried('The photo is not saved', () => addStepPhoto(host, path, step, photo)),
		setBestPhoto: (path: string, step: number, name: string | null) =>
			tried('The best photo did not change', () => setBestPhoto(host, path, step, name))
	};
}
