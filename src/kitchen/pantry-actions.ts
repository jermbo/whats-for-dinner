import type { TFile } from 'obsidian';
import { nameKey } from '../match/names';
import type { FoodNote } from '../note';
import { notePathIn } from '../note-path';
import { fullTextAfter } from '../pantry/level';
import { readFoodItem, readStocks } from '../pantry/food-item';
import type { StapleLabel } from '../pantry/staple';
import type { FoodItem, Stock } from '../pantry/types';
import { addLoose, addPackage, replaceStocks, showStocks } from '../pantry/write';
import type { KitchenWhere } from './note-kind';

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

async function keepFull(
	host: PantryActionsHost,
	file: TFile,
	item: FoodItem,
	stocks: Stock[]
) {
	const full = fullTextAfter(item, stocks);
	if (!full) return;
	await host.processFrontMatter(file.path, (properties) => {
		properties.full = full;
	});
}

// A package goes into its own row. Loose food goes into the row of its place.
export async function addStockTo(host: PantryActionsHost, path: string, stock: Stock) {
	const file = host.fileAt(path);
	const food = host.foods.find((food) => food.path === path);
	if (file) {
		const add = food?.item.loose ? addLoose : addPackage;
		// Put away writes the packages of an item one after the other, so the full amount comes
		// from the text, and not from the rows that the screen read before.
		let stocks: Stock[] = [];
		await host.processFile(path, (text) => {
			const next = add(text, stock);
			stocks = readStocks(next);
			return next;
		});
		if (food) await keepFull(host, file, food.item, stocks);
		return;
	}
	await host.makeFolderOf(path);
	const created = await host.createFile(path, `${showStocks([stock])}\n`);
	await keepFull(host, created, readFoodItem(created.basename, {}, ''), [stock]);
}

export async function setStocks(host: PantryActionsHost, path: string, stocks: Stock[]) {
	const file = host.fileAt(path);
	if (!file) return;
	const item = host.foods.find((food) => food.path === path)?.item;
	await host.processFile(path, (text) => replaceStocks(text, stocks));
	if (item) await keepFull(host, file, item, stocks);
}

// The new rows come from the rows of the text, so a second tap that comes before the screen
// reads the note again does not lose the first one.
export async function changeStocks(
	host: PantryActionsHost,
	path: string,
	change: (stocks: Stock[]) => Stock[]
) {
	const file = host.fileAt(path);
	if (!file) return;
	const item = host.foods.find((food) => food.path === path)?.item;
	let stocks: Stock[] = [];
	await host.processFile(path, (text) => {
		stocks = change(readStocks(text));
		return replaceStocks(text, stocks);
	});
	if (item) await keepFull(host, file, item, stocks);
}

export async function addStockByName(host: PantryActionsHost, name: string, stock: Stock) {
	await addStockTo(host, foodPath(host, name), stock);
}

export async function setLow(host: PantryActionsHost, path: string, low: string) {
	if (!host.fileAt(path)) return;
	await host.processFrontMatter(path, (properties) => {
		if (low.trim()) properties.low = low.trim();
		else delete properties.low;
	});
}

export async function setLoose(host: PantryActionsHost, path: string, loose: boolean) {
	if (!host.fileAt(path)) return;
	await host.processFrontMatter(path, (properties) => {
		if (loose) properties.loose = true;
		else delete properties.loose;
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
