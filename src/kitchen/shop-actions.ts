import type { App, TFile } from 'obsidian';
import type { FoodNote } from '../note';
import { notePathIn } from '../note-path';
import type { StapleLabel } from '../pantry/staple';
import type { Stock } from '../pantry/types';
import { stocksOf, type CartItem, type Facts } from '../shop/facts';
import {
	completeReceipt,
	leftOf,
	linesIn,
	newReceipt,
	ownTextOf,
	receiptPath,
	withLines,
	type ReceiptLine
} from '../shop/receipt';
import { lineKey, partsOfLineKey } from '../shop/package-lines';
import { isAllDone, isLineOf, rowsOf } from '../shop/receipt-line';
import {
	addExtra as addExtraLine,
	putInCart as putInCartNote,
	readTrip,
	removeTasks,
	taskOf,
	unmark
} from '../shop/shopping-note';
import type { ShoppingRow } from '../shop/shopping-list';
import { isPantryItem, itemsOf, keyOf, type TripItem } from '../shop/trip';
import { readProperties } from '../read-properties';
import type { VaultBuffer } from './vault-buffer';
import type { KitchenWhere } from './note-kind';
import { fallbackPutAwayFacts } from './shop-read-model';
import { foodPath } from './pantry-actions';

export type ShopMutable = {
	puttingAway: boolean;
	pendingFacts: Map<string, Facts>;
};

export type ShopActionsHost = {
	app: App;
	vault: VaultBuffer;
	where: KitchenWhere;
	openNote: string;
	today: string;
	newPlace: string;
	tripStore: string;
	trip: TripItem[];
	calculated: { missing: ShoppingRow[] };
	cart: { key: string }[];
	toPutAway: CartItem[];
	// The rows of the active receipt, as the stage read them.
	activeLines: ReceiptLine[];
	hasPutAway: boolean;
	foods: FoodNote[];
	mutable: ShopMutable;
	onTripComplete(): Promise<void>;
	pathOf(link: string): string;
	fileAt(path: string): TFile | null;
	makeFolderOf(path: string): Promise<void>;
	inTurn(change: () => Promise<void>): Promise<void>;
	writeTrip(change: (text: string) => string): Promise<void>;
	notify(text: string): void;
	save(): Promise<void>;
	setTripStoreValue(store: string): void;
	cancelTripStoreWrite(): void;
	addStockTo(path: string, stock: Stock): Promise<void>;
	setStaple(path: string, label: StapleLabel): Promise<void>;
};

function changeReceipt(
	host: ShopActionsHost,
	change: (lines: ReceiptLine[]) => ReceiptLine[]
) {
	return host.inTurn(async () => {
		const file = host.vault.activePath ? host.fileAt(host.vault.activePath) : null;
		if (!file) return;
		const text = await host.app.vault.read(file);
		const next = withLines(text, change(linesIn(text)));
		if (next !== text) await host.app.vault.modify(file, next);
	});
}

async function makeReceipt(host: ShopActionsHost, lines: ReceiptLine[]) {
	const isTaken = (path: string) => host.app.vault.getAbstractFileByPath(path) !== null;
	const path = receiptPath(host.where.shopping, host.today, isTaken);
	await host.makeFolderOf(path);
	host.vault.activePath = path;
	await host.app.vault.create(path, newReceipt(host.today, host.tripStore.trim(), lines));
}

async function buy(host: ShopActionsHost, item: TripItem, facts: Facts): Promise<string | null> {
	if (!facts.intoPantry) return item.link;

	const own = !isPantryItem(item, host.where.pantry);
	const path = own ? foodPath(host, item.name) : item.key;
	for (const stock of stocksOf(facts)) await host.addStockTo(path, stock);

	const file = host.fileAt(path);
	if (file) {
		await host.app.fileManager.processFrontMatter(file, (properties) => {
			properties.bought = host.today;
		});
	}
	return own ? path.replace(/\.md$/, '') : item.link;
}

// The facts wait by the key of their line: the item and the number of its row.
export function flushReceiptFacts(host: ShopActionsHost) {
	const pending = new Map(host.mutable.pendingFacts);
	host.mutable.pendingFacts.clear();
	if (!pending.size) return Promise.resolve();
	return changeReceipt(host, (lines) => {
		const next = [...lines];
		for (const [key, facts] of pending) {
			const index = rowOfLine(next, host, key);
			if (index !== undefined && !next[index].done) next[index] = { ...next[index], facts };
		}
		return next;
	});
}

// The number in the table of the row of a line, or undefined.
function rowOfLine(lines: ReceiptLine[], host: ShopActionsHost, key: string): number | undefined {
	const { item, at } = partsOfLineKey(key);
	const trip = host.trip.find((one) => one.key === item);
	return trip ? rowsOf(lines, trip, host.pathOf)[at] : undefined;
}

// With a brand, the task keeps the brand that you took, as the cell of a receipt has it.
export async function putInCart(host: ShopActionsHost, key: string, brand?: string) {
	const row = host.calculated.missing.find((row) => row.key === key);
	const task = host.trip.find((item) => item.key === key) ?? (row && taskOf(row.key));
	if (task) await host.writeTrip((text) => putInCartNote(text, task, brand));
}

export async function takeOutOfCart(host: ShopActionsHost, key: string) {
	const item = host.trip.find((item) => item.key === key);
	if (!item) return;
	const onList = host.calculated.missing.some((row) => row.key === key);
	await host.writeTrip((text) => (onList ? removeTasks(text, [item]) : unmark(text, item)));
	await changeReceipt(host, (lines) =>
		lines.filter((line) => line.done || !isLineOf(line, item, host.pathOf))
	);
}

export async function addToCart(host: ShopActionsHost, path: string) {
	await host.writeTrip((text) => putInCartNote(text, taskOf(path)));
}

export async function addNewToCart(host: ShopActionsHost, name: string) {
	await addToCart(host, notePathIn(host.where.items, name));
}

export async function addExtra(host: ShopActionsHost, path: string) {
	if (host.trip.some((item) => item.key === path)) return;
	await host.writeTrip((text) => addExtraLine(text, taskOf(path)));
}

export async function addNewItem(host: ShopActionsHost, name: string) {
	await addExtra(host, notePathIn(host.where.items, name));
}

export async function removeExtra(host: ShopActionsHost, key: string) {
	const item = host.trip.find((item) => item.key === key);
	if (item) await host.writeTrip((text) => removeTasks(text, [item]));
}

export async function saveTripStore(host: ShopActionsHost, store: string) {
	return host.inTurn(async () => {
		if (!host.fileAt(host.openNote)) {
			await host.makeFolderOf(host.openNote);
			await host.app.vault.create(host.openNote, '');
		}
		const file = host.fileAt(host.openNote);
		if (!file) return;
		await host.app.fileManager.processFrontMatter(file, (properties) => {
			if (store) properties.store = store;
			else delete properties.store;
		});
	});
}

export function changeFacts(host: ShopActionsHost, key: string, facts: Facts, schedule: () => void) {
	host.mutable.pendingFacts.set(key, facts);
	schedule();
}

export function startPutAway(host: ShopActionsHost) {
	return host.inTurn(async () => {
		const open = host.fileAt(host.openNote);
		const tasks = open ? readTrip(await host.app.vault.read(open)) : [];
		const file = host.vault.activePath ? host.fileAt(host.vault.activePath) : null;
		const text = file ? await host.app.vault.read(file) : '';
		const lines = linesIn(text);
		const cart = itemsOf(tasks, host.pathOf).filter(
			(item) => item.inCart && !isAllDone(lines, item, host.pathOf)
		);

		// One row for each package that the stage proposes.
		const proposed = new Map(host.toPutAway.map((item) => [item.key, item.lines]));
		const linesOfItem = (item: TripItem): ReceiptLine[] => {
			const starts = proposed.get(item.key)?.map(({ start }) => start) ?? [
				fallbackPutAwayFacts(item, host.where.pantry, host.newPlace)
			];
			return starts.map((facts) => ({ link: item.link, name: item.name, facts, done: false }));
		};
		if (!file) {
			if (cart.length) await makeReceipt(host, cart.flatMap(linesOfItem));
			return;
		}
		const kept = lines.filter(
			(line) => line.done || cart.some((item) => isLineOf(line, item, host.pathOf))
		);
		const added = cart.filter(
			(item) => !lines.some((line) => isLineOf(line, item, host.pathOf))
		);
		if (kept.length === lines.length && !added.length) return;
		await host.app.vault.modify(file, withLines(text, [...kept, ...added.flatMap(linesOfItem)]));
	});
}

// `given` has the facts of each line that goes into the pantry, by the key of its line.
export async function putAway(host: ShopActionsHost, given: Map<string, Facts>) {
	const lines = [...given].flatMap(([key, facts]) => {
		const { item: itemKey, at } = partsOfLineKey(key);
		const item = host.trip.find((one) => one.inCart && one.key === itemKey);
		return item ? [{ key, item, at, facts }] : [];
	});
	if (host.mutable.puttingAway || !lines.length) return false;
	const isLast = host.toPutAway.every((item) =>
		item.lines.every(({ at }) => given.has(lineKey(item.key, at)))
	);
	host.mutable.puttingAway = true;
	try {
		await flushReceiptFacts(host);
		const done: { item: TripItem; at: number; line: ReceiptLine }[] = [];
		for (const { item, at, facts } of lines) {
			const link = await buy(host, item, facts);
			done.push({ item, at, line: { link, name: item.name, facts, done: true } });
		}
		await changeReceipt(host, (rows) => {
			const next = [...rows];
			for (const { item, at, line } of done) {
				const index = rowsOf(next, item, host.pathOf)[at];
				if (index === undefined) next.push(line);
				else next[index] = line;
			}
			return next;
		});

		const items = new Set(done.filter(({ line }) => line.facts.intoPantry).map(({ item }) => item));
		const names = [...items].map((item) => item.name);
		if (names.length === 1) host.notify(`${names[0]} is in the pantry.`);
		if (names.length > 1) host.notify(`${names.length} items are in the pantry.`);
		if (isLast) await completeTrip(host);
		return isLast;
	} finally {
		host.mutable.puttingAway = false;
	}
}

// "+ package": a copy of the open line, as a new row after the rows of its item.
export async function addPackageLine(host: ShopActionsHost, key: string, facts: Facts) {
	await flushReceiptFacts(host);
	const item = host.trip.find((one) => one.key === partsOfLineKey(key).item);
	if (!item) return;
	await changeReceipt(host, (lines) => {
		const last = rowsOf(lines, item, host.pathOf).at(-1);
		const copy = { link: item.link, name: item.name, facts, done: false };
		if (last === undefined) return [...lines, copy];
		return [...lines.slice(0, last + 1), copy, ...lines.slice(last + 1)];
	});
}

// "Not bought" takes one line out. The task stays in the cart while its item has a line, or a
// package in the pantry. The last line of an item takes the item out of the cart.
export async function notBought(host: ShopActionsHost, key: string) {
	const { item: itemKey, at } = partsOfLineKey(key);
	const item = host.trip.find((one) => one.key === itemKey);
	const cartItem = host.toPutAway.find((one) => one.key === itemKey);
	const left = host.toPutAway.flatMap((one) => one.lines.map((line) => lineKey(one.key, line.at)));
	const ends = left.every((other) => other === key) && host.hasPutAway;
	const others = host.activeLines.filter((line) => item && isLineOf(line, item, host.pathOf)).length > 1;

	await flushReceiptFacts(host);
	if (item && cartItem && others) {
		await changeReceipt(host, (lines) => {
			const index = rowsOf(lines, item, host.pathOf)[at];
			return lines.filter((line, other) => other !== index || line.done);
		});
	} else {
		await takeOutOfCart(host, itemKey);
	}
	if (ends) await completeTrip(host);
	return ends;
}

async function completeTrip(host: ShopActionsHost) {
	host.cancelTripStoreWrite();
	const store = host.tripStore.trim();
	await host.inTurn(async () => {
		const receipt = host.vault.activePath ? host.fileAt(host.vault.activePath) : null;
		const open = host.fileAt(host.openNote);
		const openText = open ? await host.app.vault.read(open) : '';
		if (receipt) {
			const ownText = ownTextOf(readProperties(openText).body);
			await host.app.vault.process(receipt, (text) =>
				completeReceipt(
					text,
					linesIn(text).filter((line) => line.done),
					ownText
				)
			);
			await host.app.fileManager.processFrontMatter(receipt, (properties) => {
				properties.status = 'complete';
				if (store) properties.store = store;
				else delete properties.store;
			});
		}
		if (open) await host.app.vault.modify(open, leftOf(openText));
		host.vault.activePath = null;
	});
	await host.onTripComplete();
}
