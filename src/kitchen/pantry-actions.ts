import type { TFile } from 'obsidian';
import { nameKey } from '../match/names';
import type { FoodNote } from '../note';
import { notePathIn } from '../note-path';
import { readStocks } from '../pantry/food-item';
import type { StapleLabel } from '../pantry/staple';
import type { Stock } from '../pantry/types';
import { addPackage, replaceStocks, showStocks } from '../pantry/write';
import type { KitchenWhere } from './note-kind';
import { tried } from './tried';

export type PantryActionsHost = {
	foods: FoodNote[];
	where: KitchenWhere;
	fileAt(path: string): TFile | null;
	makeFolderOf(path: string): Promise<void>;
	processFile(path: string, change: (text: string) => string): Promise<void>;
	processFrontMatter(path: string, change: (properties: Record<string, unknown>) => void): Promise<void>;
	createFile(path: string, text: string): Promise<TFile>;
};

export type FoodPathHost = Pick<PantryActionsHost, 'foods' | 'where'>;

export function foodPath(host: FoodPathHost, name: string) {
	const key = nameKey(name);
	const food = host.foods.find(({ item }) => nameKey(item.name) === key);
	return food?.path ?? notePathIn(host.where.pantry, name);
}

// A package goes into its own row.
export async function addStockTo(host: PantryActionsHost, path: string, stock: Stock) {
	if (host.fileAt(path)) {
		await host.processFile(path, (text) => addPackage(text, stock));
		return;
	}
	await host.makeFolderOf(path);
	await host.createFile(path, `${showStocks([stock])}\n`);
}

export async function setStocks(host: PantryActionsHost, path: string, stocks: Stock[]) {
	if (!host.fileAt(path)) return;
	await host.processFile(path, (text) => replaceStocks(text, stocks));
}

// The new rows come from the rows of the text, so a second tap that comes before the screen
// reads the note again does not lose the first one.
async function changeStocks(
	host: PantryActionsHost,
	path: string,
	change: (stocks: Stock[]) => Stock[]
) {
	if (!host.fileAt(path)) return;
	await host.processFile(path, (text) => replaceStocks(text, change(readStocks(text))));
}

export async function addStockByName(host: PantryActionsHost, name: string, stock: Stock) {
	await addStockTo(host, foodPath(host, name), stock);
}

// A food item to check shows first in the audit. A change of its packages, or "Right", removes it.
export async function setCheck(host: PantryActionsHost, path: string, check: boolean) {
	if (!host.fileAt(path)) return;
	await host.processFrontMatter(path, (properties) => {
		if (check) properties.check = true;
		else delete properties.check;
	});
}

// The size of the next package. An empty text takes the property out, and the newest package
// gives the size again.
async function setSize(host: PantryActionsHost, path: string, size: string) {
	if (!host.fileAt(path)) return;
	await host.processFrontMatter(path, (properties) => {
		if (size.trim()) properties.size = size.trim();
		else delete properties.size;
	});
}

export async function setStaple(host: PantryActionsHost, path: string, label: StapleLabel) {
	if (!host.fileAt(path)) return;
	await host.processFrontMatter(path, (properties) => {
		if (label === 'never') {
			delete properties.staple;
			properties.suggest = 'never';
			return;
		}
		delete properties.suggest;
		if (label) properties.staple = label;
		else delete properties.staple;
	});
}

// What a screen can do with the pantry. Each action tells you in a notice when its write fails.
export function pantryActions(host: PantryActionsHost) {
	return {
		changeStocks: (path: string, change: (stocks: Stock[]) => Stock[]) =>
			tried('The pantry did not change', () => changeStocks(host, path, change)),
		addStock: (name: string, stock: Stock) =>
			tried('The food is not in the pantry', () => addStockByName(host, name, stock)),
		setCheck: (path: string, check: boolean) =>
			tried('The check did not change', () => setCheck(host, path, check)),
		setSize: (path: string, size: string) =>
			tried('The size did not change', () => setSize(host, path, size)),
		setStaple: (path: string, label: StapleLabel) =>
			tried('The staple did not change', () => setStaple(host, path, label))
	};
}
