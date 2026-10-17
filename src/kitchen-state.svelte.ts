// The kitchen: all that the screens show, and all that they can do. The notes of the vault are the
// only source. Each action writes a note, and the kitchen reads the note again after the change.

import { debounce, Notice, TFile, type App, type EventRef, type TAbstractFile } from 'obsidian';
import { finishCooking as finishCookingAction, type CookActionsHost } from './kitchen/cook-actions';
import { mealsOf } from './kitchen/meals-view';
import {
	addStockByName,
	addStockTo,
	setLow as setLowAction,
	setStaple as setStapleAction,
	setStocks as setStocksAction,
	type PantryActionsHost
} from './kitchen/pantry-actions';
import {
	addToPlan as addToPlanAction,
	clearPlan as clearPlanAction,
	isPlanned as isPlannedAction,
	isToday as isTodayAction,
	removeFromPlan as removeFromPlanAction,
	setPrepDone as setPrepDoneAction,
	setToday as setTodayAction,
	type PlanActionsHost
} from './kitchen/plan-actions';
import {
	addExtra as addExtraAction,
	addNewItem as addNewItemAction,
	addNewToCart as addNewToCartAction,
	addToCart as addToCartAction,
	changeFacts as changeFactsAction,
	flushReceiptFacts,
	notBought as notBoughtAction,
	putAway as putAwayAction,
	putInCart as putInCartAction,
	removeExtra as removeExtraAction,
	saveTripStore,
	startPutAway as startPutAwayAction,
	takeOutOfCart as takeOutOfCartAction,
	type ShopActionsHost,
	type ShopMutable
} from './kitchen/shop-actions';
import { rejectedRecipes, recipesOf } from './kitchen/recipes-view';
import {
	choosePlaces as choosePlacesAction,
	chooseRecipesFolder as chooseRecipesFolderAction,
	finishSetup as finishSetupAction,
	makeHome as makeHomeAction,
	startAgain as startAgainAction,
	type SetupActionsHost
} from './kitchen/setup-actions';
import type { CookResult, Disk, Meal } from './kitchen/types';
import { noteKind, VaultBuffer } from './kitchen/vault-buffer';
import {
	calculatedList,
	cartItems,
	mealNeeds,
	putAwayCartItems,
	storeOrderOf,
	storesOf,
	tripSuggestions
} from './kitchen/shop-read-model';
import type { FoodNote, Note } from './note';
import type { StapleLabel } from './pantry/staple';
import { placesOf } from './pantry/places';
import type { Stock } from './pantry/types';
import type { PlannedMeal } from './plan/plan-note';
import { DEFAULT_SETTINGS, folderPath, notePath, type Settings } from './settings';
import { hasKitchenNotes, screenOf, type Setup } from './setup/screen';
import type { Facts } from './shop/facts';
import type { Receipt } from './shop/read-receipt';
import type { ReceiptLine } from './shop/receipt';
import { openNotePath } from './shop/shopping-note';
import { today } from './dates';

export type { CookResult, Meal, RecipeEntry } from './kitchen/types';

export class Kitchen {
	notes = $state.raw<Note[]>([]);
	foods = $state.raw<FoodNote[]>([]);
	plan = $state.raw<PlannedMeal[]>([]);
	trip = $state.raw<import('./shop/trip').TripItem[]>([]);
	tripStore = $state('');
	private active = $state.raw<{ path: string; lines: ReceiptLine[] } | null>(null);
	itemNotes = $state.raw<string[]>([]);
	private receipts = $state.raw<Receipt[]>([]);
	private skipped = $state.raw<string[]>([]);
	settings = $state.raw<Settings>(DEFAULT_SETTINGS);
	today = $state(today());
	// The step of setup, "done", or null before setup starts.
	setup = $state<Setup | null>(null);
	// If the vault had notes of the kitchen at the last read. Null before the first read.
	private hasNotes = $state<boolean | null>(null);
	screen = $derived(screenOf(this.setup, this.hasNotes));

	private where = $derived({
		recipes: folderPath(this.settings.recipesFolder),
		pantry: folderPath(this.settings.pantryFolder) || DEFAULT_SETTINGS.pantryFolder,
		plan: notePath(this.settings.planNote) || DEFAULT_SETTINGS.planNote,
		shopping: folderPath(this.settings.shoppingFolder) || DEFAULT_SETTINGS.shoppingFolder,
		items: folderPath(this.settings.itemsFolder) || DEFAULT_SETTINGS.itemsFolder
	});
	private openNote = $derived(openNotePath(this.where.shopping));
	private newPlace = $derived(this.settings.newPlace.trim() || DEFAULT_SETTINGS.newPlace);

	recipes = $derived.by(() =>
		recipesOf(this.notes, this.foods, this.today, this.settings.soonDays)
	);
	rejected = $derived(rejectedRecipes(this.notes));
	places = $derived(placesOf(this.settings.places, this.foods));
	meals = $derived(mealsOf(this.plan, this.recipes));

	private needs = $derived(mealNeeds(this.meals, this.where.pantry));
	private calculated = $derived(
		calculatedList(this.needs, this.settings.lowPercent, this.today)
	);
	private shopLists = $derived.by(() =>
		cartItems(
			this.calculated,
			this.trip,
			this.foods,
			this.receipts,
			this.pathOf,
			this.active
		)
	);

	list = $derived(this.shopLists.list);
	cart = $derived(this.shopLists.cart);
	hasPutAway = $derived(this.active?.lines.some((line) => line.done) ?? false);
	stores = $derived(storesOf(this.receipts));
	storeOrder = $derived.by(() => storeOrderOf(this.receipts, this.tripStore, this.pathOf));
	toPutAway = $derived.by(() =>
		putAwayCartItems(
			this.cart,
			this.trip,
			this.shopLists.bought,
			this.where.pantry,
			this.active,
			this.pathOf,
			{ today: this.today, newPlace: this.newPlace }
		)
	);
	suggestions = $derived(
		tripSuggestions(
			this.foods,
			{
				today: this.today,
				soonDays: this.settings.soonDays,
				lowPercent: this.settings.lowPercent
			},
			this.skipped,
			this.trip,
			this.calculated.missing.map((row) => row.key)
		)
	);

	private app: App;
	private disk: Disk;
	private register: (ref: EventRef) => void;
	private started = false;
	private vault = new VaultBuffer();
	private shopMutable: ShopMutable = { puttingAway: false, pendingFacts: new Map() };
	private writeFacts = debounce(() => void flushReceiptFacts(this.shopHost), 600, true);
	private writeStore = debounce((store: string) => void saveTripStore(this.shopHost, store), 600, true);

	constructor(app: App, disk: Disk, register: (ref: EventRef) => void) {
		this.app = app;
		this.disk = disk;
		this.register = register;
	}

	async loadSaved() {
		const saved = await this.disk.load();
		this.skipped = saved?.skipped ?? [];
		this.setup = saved?.setup ?? null;
		this.settings = { ...DEFAULT_SETTINGS, ...saved?.settings };
		// A new install writes the defaults, so that the data file and the settings tab agree.
		if (!saved?.settings) await this.save();
	}

	async changeSettings(change: Partial<Settings>) {
		const paths = [
			'recipesFolder',
			'pantryFolder',
			'planNote',
			'shoppingFolder',
			'itemsFolder'
		] as const;
		const moved = paths.some((key) => key in change && change[key] !== this.settings[key]);
		this.settings = { ...this.settings, ...change };
		await this.save();
		if (moved && this.started) this.readAgain();
	}

	// The folders of the vault, for the recipes step of setup.
	folders(): string[] {
		return this.app.vault
			.getAllFolders()
			.map((folder) => folder.path)
			.sort();
	}

	async chooseRecipesFolder(text: string) {
		await chooseRecipesFolderAction(this.setupHost, text);
	}

	async makeHome(name: string) {
		await makeHomeAction(this.setupHost, name);
	}

	async choosePlaces(places: string[], newPlace: string) {
		await choosePlacesAction(this.setupHost, places, newPlace);
	}

	finishSetup(staples: Map<string, string>): Promise<boolean> {
		return finishSetupAction(this.setupHost, staples);
	}

	async startSetupAgain() {
		await startAgainAction(this.setupHost);
	}

	// For a vault that had notes of the kitchen before setup. The settings tab has the button.
	async useNotes() {
		this.setup = 'done';
		await this.save();
	}

	async start() {
		if (this.started) return;
		this.started = true;

		const { vault } = this.app;
		const { register } = this;
		await this.readAll();
		// A vault from before the list of places starts with the places that its rows have.
		if (!this.settings.places.length && this.places.length) {
			await this.changeSettings({ places: this.places });
		}

		register(vault.on('create', (file) => this.update(file)));
		register(vault.on('modify', (file) => this.update(file)));
		register(vault.on('delete', (file) => this.forget(file.path)));
		register(
			vault.on('rename', (file, oldPath) => {
				this.forget(oldPath);
				void this.update(file);
			})
		);
	}

	notify(text: string) {
		new Notice(text);
	}

	open(path: string) {
		const file = this.fileAt(path);
		if (file) void this.app.workspace.getLeaf('tab').openFile(file);
	}

	async setStocks(path: string, stocks: Stock[]) {
		await setStocksAction(this.pantryHost, path, stocks);
	}

	async addStock(name: string, stock: Stock) {
		await addStockByName(this.pantryHost, name, stock);
	}

	async setLow(path: string, low: string) {
		await setLowAction(this.pantryHost, path, low);
	}

	async setStaple(path: string, label: StapleLabel) {
		await setStapleAction(this.pantryHost, path, label);
	}

	isPlanned(path: string) {
		return isPlannedAction(this.planHost, path);
	}

	isToday(meal: PlannedMeal) {
		return isTodayAction(this.planHost, meal);
	}

	async addToPlan(path: string) {
		await addToPlanAction(this.planHost, path);
	}

	async setToday(path: string, on: boolean) {
		await setTodayAction(this.planHost, path, on);
	}

	async setPrepDone(path: string, prepDone: boolean) {
		await setPrepDoneAction(this.planHost, path, prepDone);
	}

	async removeFromPlan(path: string) {
		await removeFromPlanAction(this.planHost, path);
	}

	async clearPlan() {
		await clearPlanAction(this.planHost);
	}

	async putInCart(key: string) {
		await putInCartAction(this.shopHost, key);
	}

	async takeOutOfCart(key: string) {
		await takeOutOfCartAction(this.shopHost, key);
	}

	regularOf(key: string): string {
		return this.shopLists.bought.get(key)?.regular ?? '';
	}

	async addToCart(path: string) {
		await addToCartAction(this.shopHost, path);
	}

	async addNewToCart(name: string) {
		await addNewToCartAction(this.shopHost, name);
	}

	async addExtra(path: string) {
		await addExtraAction(this.shopHost, path);
	}

	async addNewItem(name: string) {
		await addNewItemAction(this.shopHost, name);
	}

	async removeExtra(key: string) {
		await removeExtraAction(this.shopHost, key);
	}

	setTripStore(store: string) {
		this.tripStore = store.trim();
		this.writeStore(store.trim());
	}

	async skip(path: string) {
		this.skipped = [...this.skipped, path];
		await this.save();
	}

	async unskip(path: string) {
		this.skipped = this.skipped.filter((other) => other !== path);
		await this.save();
	}

	async neverAsk(path: string) {
		await this.setStaple(path, 'never');
	}

	startPutAway() {
		return startPutAwayAction(this.shopHost);
	}

	changeFacts(key: string, facts: Facts) {
		changeFactsAction(this.shopHost, key, facts, () => this.writeFacts());
	}

	async putAway(given: Map<string, Facts>): Promise<boolean> {
		this.writeFacts.cancel();
		return putAwayAction(this.shopHost, given);
	}

	async notBought(key: string): Promise<boolean> {
		return notBoughtAction(this.shopHost, key);
	}

	async finishCooking(path: string, result: CookResult) {
		await finishCookingAction(this.cookHost, path, result);
	}

	private get pantryHost(): PantryActionsHost {
		const k = this;
		return {
			get foods() {
				return k.foods;
			},
			get where() {
				return k.where;
			},
			fileAt: (path) => k.fileAt(path),
			makeFolderOf: (path) => k.makeFolderOf(path),
			processFile: async (path, change) => {
				const file = k.fileAt(path);
				if (file) await k.app.vault.process(file, change);
			},
			processFrontMatter: async (path, change) => {
				const file = k.fileAt(path);
				if (file) await k.app.fileManager.processFrontMatter(file, change);
			},
			createFile: async (path, text) => k.app.vault.create(path, text)
		};
	}

	private get setupHost(): SetupActionsHost {
		const k = this;
		return {
			get settings() {
				return k.settings;
			},
			get foodCount() {
				return k.foods.length;
			},
			exists: (path) => Boolean(k.app.vault.getAbstractFileByPath(path)),
			createFolder: async (path) => {
				await k.app.vault.createFolder(path);
			},
			createFile: async (path, text) => {
				await k.app.vault.create(path, text);
			},
			changeSettings: (change) => k.changeSettings(change),
			goTo: async (setup) => {
				k.setup = setup;
				await k.save();
			},
			addStock: (name, stock) => k.addStock(name, stock),
			trash: async (path) => {
				const folder = k.app.vault.getAbstractFileByPath(path);
				// The trash of the vault, and not of the system: a phone can have no system trash.
				if (folder) await k.app.vault.trash(folder, false);
			},
			forgetAll: async () => {
				k.skipped = [];
				k.setup = null;
				k.settings = DEFAULT_SETTINGS;
				await k.save();
				if (k.started) await k.readAll();
			}
		};
	}

	private get planHost(): PlanActionsHost {
		const k = this;
		return {
			get plan() {
				return k.plan;
			},
			get meals() {
				return k.meals;
			},
			get recipes() {
				return k.recipes;
			},
			get today() {
				return k.today;
			},
			notify: (text) => k.notify(text),
			writePlan: (change) => k.writePlan(change)
		};
	}

	private get shopHost(): ShopActionsHost {
		const k = this;
		return {
			app: k.app,
			vault: k.vault,
			get where() {
				return k.where;
			},
			get openNote() {
				return k.openNote;
			},
			get today() {
				return k.today;
			},
			get newPlace() {
				return k.newPlace;
			},
			get tripStore() {
				return k.tripStore;
			},
			get trip() {
				return k.trip;
			},
			get calculated() {
				return k.calculated;
			},
			get cart() {
				return k.cart;
			},
			get toPutAway() {
				return k.toPutAway;
			},
			get hasPutAway() {
				return k.hasPutAway;
			},
			get foods() {
				return k.foods;
			},
			mutable: k.shopMutable,
			onTripComplete: () => k.onTripComplete(),
			pathOf: (link) => k.pathOf(link),
			fileAt: (path) => k.fileAt(path),
			makeFolderOf: (path) => k.makeFolderOf(path),
			inTurn: (change) => k.inTurn(change),
			writeTrip: (change) => k.writeTrip(change),
			notify: (text) => k.notify(text),
			save: () => k.save(),
			setTripStoreValue: (store) => {
				k.tripStore = store;
			},
			cancelTripStoreWrite: () => k.writeStore.cancel(),
			addStockTo: (path, stock, add) => addStockTo(k.pantryHost, path, stock, add),
			setStaple: (path, label) => setStapleAction(k.pantryHost, path, label)
		};
	}

	private get cookHost(): CookActionsHost {
		const k = this;
		return {
			...k.pantryHost,
			...k.planHost,
			app: k.app,
			get today() {
				return k.today;
			},
			get recipes() {
				return k.recipes;
			},
			fileAt: (path) => k.fileAt(path),
			isPlanned: (path) => k.isPlanned(path)
		};
	}

	private async onTripComplete() {
		this.skipped = [];
		await this.save();
	}

	private async writePlan(change: (text: string) => string) {
		const file = this.fileAt(this.where.plan);
		if (file) await this.app.vault.process(file, change);
		else await this.app.vault.create(this.where.plan, change(''));
	}

	private tripChanges: Promise<void> = Promise.resolve();

	private inTurn(change: () => Promise<void>) {
		this.tripChanges = this.tripChanges.then(change, change);
		return this.tripChanges;
	}

	private writeTrip(change: (text: string) => string) {
		return this.inTurn(async () => {
			const file = this.fileAt(this.openNote);
			if (file) {
				await this.app.vault.process(file, change);
				return;
			}
			await this.makeFolderOf(this.openNote);
			await this.app.vault.create(this.openNote, change(''));
		});
	}

	private save() {
		return this.disk.save({
			skipped: this.skipped,
			settings: this.settings,
			...(this.setup ? { setup: this.setup } : {})
		});
	}

	private fileAt(path: string): TFile | null {
		const file = this.app.vault.getAbstractFileByPath(path);
		return file instanceof TFile ? file : null;
	}

	private async makeFolderOf(path: string) {
		const folder = path.slice(0, path.lastIndexOf('/'));
		if (folder && !this.app.vault.getAbstractFileByPath(folder)) {
			await this.app.vault.createFolder(folder);
		}
	}

	private pathOf = (link: string) =>
		this.app.metadataCache.getFirstLinkpathDest(link, this.openNote)?.path ?? notePath(link);

	private async read(file: TAbstractFile) {
		if (!(file instanceof TFile) || file.extension !== 'md') return;
		if (!noteKind(file.path, this.where, this.openNote)) return;
		const text = await this.app.vault.cachedRead(file);
		const { path } = file;
		const kind = noteKind(path, this.where, this.openNote);
		if (!kind) return;
		this.vault.applyRead(path, kind, text, file.basename);
	}

	private async readAll() {
		this.vault.clear();
		const files = this.app.vault.getMarkdownFiles();
		await Promise.all(files.map((file) => this.read(file)));
		this.hasNotes = hasKitchenNotes(
			files.map((file) => file.path),
			this.where
		);
		this.show();
	}

	private readAgain = debounce(() => void this.readAll(), 500, true);

	private async update(file: TAbstractFile) {
		await this.read(file);
		this.show();
	}

	private forget(path: string) {
		this.vault.forget(path, this.openNote, this.where.plan);
		this.show();
	}

	private show() {
		const snap = this.vault.snapshot(this.where, this.openNote, this.pathOf);
		this.notes = snap.notes;
		this.foods = snap.foods;
		this.plan = snap.plan;
		this.trip = snap.trip;
		this.tripStore = snap.tripStore;
		this.itemNotes = snap.itemNotes;
		this.receipts = snap.receipts;
		this.active = snap.active;
		this.today = today();
	}
}
