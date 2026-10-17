import type { TFile } from 'obsidian';
import { nameKey } from '../match/names';
import type { FoodNote } from '../note';
import { notePathIn } from '../note-path';
import { fullAfter } from '../pantry/level';
import { readFoodItem } from '../pantry/food-item';
import type { StapleLabel } from '../pantry/staple';
import type { FoodItem, Stock } from '../pantry/types';
import { addStock, putAwayStock, replaceStocks, showStocks } from '../pantry/write';
import { showMeasure } from '../units';
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
	const full = fullAfter(item, stocks);
	if (!full) return;
	await host.processFrontMatter(file.path, (properties) => {
		properties.full = showMeasure(full);
	});
}

export async function addStockTo(
	host: PantryActionsHost,
	path: string,
	stock: Stock,
	add: (text: string, stock: Stock) => string = addStock
) {
	const file = host.fileAt(path);
	const food = host.foods.find((food) => food.path === path);
	if (file) {
		await host.processFile(path, (text) => add(text, stock));
		if (food) await keepFull(host, file, food.item, [...food.item.stocks, stock]);
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
