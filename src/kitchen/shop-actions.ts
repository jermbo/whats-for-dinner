import type { App, TFile } from 'obsidian';
import type { FoodNote } from '../note';
import { notePathIn } from '../note-path';
import { putAwayStock } from '../pantry/write';
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
import { isLineOf } from '../shop/receipt-line';
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
	addStockTo(path: string, stock: Stock, add?: (text: string, stock: Stock) => string): Promise<void>;
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
	for (const stock of stocksOf(facts)) await host.addStockTo(path, stock, putAwayStock);

	const file = host.fileAt(path);
	if (file) {
		await host.app.fileManager.processFrontMatter(file, (properties) => {
			properties.bought = host.today;
		});
	}
	return own ? path.replace(/\.md$/, '') : item.link;
}

export function flushReceiptFacts(host: ShopActionsHost) {
	const pending = new Map(host.mutable.pendingFacts);
	host.mutable.pendingFacts.clear();
	if (!pending.size) return Promise.resolve();
	return changeReceipt(host, (lines) =>
		lines.map((line) => {
			const key = [...pending.keys()].find((key) => keyOf(line, host.pathOf) === key);
			return key && !line.done ? { ...line, facts: pending.get(key) ?? line.facts } : line;
		})
	);
}

export async function putInCart(host: ShopActionsHost, key: string) {
	const row = host.calculated.missing.find((row) => row.key === key);
	const task = host.trip.find((item) => item.key === key) ?? (row && taskOf(row.key));
	if (task) await host.writeTrip((text) => putInCartNote(text, task));
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
		const isDone = (item: TripItem) =>
			lines.some((line) => line.done && isLineOf(line, item, host.pathOf));
		const cart = itemsOf(tasks, host.pathOf).filter((item) => item.inCart && !isDone(item));

		const facts = new Map(host.toPutAway.map((item) => [item.key, item.start]));
		const lineOfItem = (item: TripItem): ReceiptLine => ({
			link: item.link,
			name: item.name,
			facts:
				facts.get(item.key) ??
				fallbackPutAwayFacts(item, host.where.pantry, host.newPlace),
			done: false
		});
		if (!file) {
			if (cart.length) await makeReceipt(host, cart.map(lineOfItem));
			return;
		}
		const kept = lines.filter(
			(line) => line.done || cart.some((item) => isLineOf(line, item, host.pathOf))
		);
		const added = cart.filter(
			(item) => !lines.some((line) => isLineOf(line, item, host.pathOf))
		);
		if (kept.length === lines.length && !added.length) return;
		await host.app.vault.modify(file, withLines(text, [...kept, ...added.map(lineOfItem)]));
	});
}

export async function putAway(host: ShopActionsHost, given: Map<string, Facts>) {
	const items = host.trip.filter((item) => item.inCart && given.has(item.key));
	if (host.mutable.puttingAway || !items.length) return false;
	const isLast = host.cart.every((row) => given.has(row.key));
	host.mutable.puttingAway = true;
	try {
		await flushReceiptFacts(host);
		const done: { item: TripItem; line: ReceiptLine }[] = [];
		for (const item of items) {
			const facts =
				given.get(item.key) ??
				fallbackPutAwayFacts(item, host.where.pantry, host.newPlace);
			const link = await buy(host, item, facts);
			done.push({ item, line: { link, name: item.name, facts, done: true } });
		}
		await changeReceipt(host, (lines) => {
			const next = [...lines];
			for (const { item, line } of done) {
				const at = next.findIndex((other) => isLineOf(other, item, host.pathOf));
				if (at === -1) next.push(line);
				else next[at] = line;
			}
			return next;
		});

		const inPantry = done.filter(({ line }) => line.facts.intoPantry);
		if (inPantry.length === 1) host.notify(`${inPantry[0].item.name} is in the pantry.`);
		if (inPantry.length > 1) host.notify(`${inPantry.length} items are in the pantry.`);
		if (isLast) await completeTrip(host);
		return isLast;
	} finally {
		host.mutable.puttingAway = false;
	}
}

export async function notBought(host: ShopActionsHost, key: string) {
	const isLast = host.cart.every((row) => row.key === key);
	const ends = isLast && host.hasPutAway;
	await takeOutOfCart(host, key);
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
