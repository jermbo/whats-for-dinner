import type { App, TFile } from 'obsidian';
import { shrinkPhoto } from '../cook/photo';
import { addRecord } from '../cook/record';
import type { CookResult, RecipeEntry } from './types';
import { markCooked } from './plan-actions';
import type { PlanActionsHost } from './plan-actions';
import { setStocks } from './pantry-actions';
import type { PantryActionsHost } from './pantry-actions';

export type CookActionsHost = PantryActionsHost &
	PlanActionsHost & {
		app: App;
		today: string;
		recipes: RecipeEntry[];
		fileAt(path: string): TFile | null;
		isPlanned(path: string): boolean;
	};

async function savePhoto(host: CookActionsHost, photo: Blob, recipe: TFile): Promise<string> {
	const name = `${recipe.basename} ${host.today}.jpg`;
	const path = await host.app.fileManager.getAvailablePathForAttachment(name, recipe.path);
	await host.app.vault.createBinary(path, await shrinkPhoto(photo));
	return path;
}

export async function finishCooking(host: CookActionsHost, path: string, result: CookResult) {
	for (const [foodPath, stocks] of result.stocks) await setStocks(host, foodPath, stocks);

	const file = host.fileAt(path);
	const entry = host.recipes.find((recipe) => recipe.path === path);
	if (file && entry) {
		const photo = result.photo ? await savePhoto(host, result.photo, file) : null;
		const { rating, note } = result;
		const hasInstructions = entry.recipe.instructions !== null;
		const record = { date: host.today, rating, note, photo };
		await host.app.vault.process(file, (text) => addRecord(text, hasInstructions, record));
	}

	if (host.isPlanned(path)) await markCooked(host, path);
}
