// The kitchen: all that the screens show, and all that they can do. The notes of the vault are the
// only source. Each action writes a note, and the kitchen reads the note again after the change.

import { debounce, Notice, TFile, type App, type EventRef, type TAbstractFile } from 'obsidian';
import { shrinkPhoto } from './cook/photo';
import { addRecord } from './cook/record';
import { today } from './dates';
import { indexFoods, matchRecipe, type RecipeMatch } from './match/match';
import { nameKey } from './match/names';
import type { FoodNote, Note } from './note';
import { readFoodItem } from './pantry/food-item';
import { notePathIn } from './note-path';
import { fullAfter } from './pantry/level';
import type { StapleLabel } from './pantry/staple';
import type { FoodItem, Stock } from './pantry/types';
import { addStock, putAwayStock, replaceStocks, showStocks } from './pantry/write';
import {
	addMeal,
	changeMeal,
	readPlan,
	removeMeal,
	removeMeals,
	type PlannedMeal
} from './plan/plan-note';
import { hasRoom, ROOM } from './plan/week';
import { readProperties } from './read-properties';
import { readRecipe } from './recipemd/parse';
import type { Recipe } from './recipemd/types';
import { typeOf } from './recipes/browse';
import { readPrep } from './recipes/prep';
import { DEFAULT_SETTINGS, folderPath, notePath, type Settings } from './settings';
import { cartItemOf, stocksOf, type CartItem, type Facts } from './shop/facts';
import { lastRows } from './shop/last-receipt';
import { pastDateRows } from './shop/past-date';
import { readReceipt, type Receipt } from './shop/read-receipt';
import { leftOf, purchaseOf, receiptOf, receiptPath, type Purchase } from './shop/receipt';
import { needsOf, shoppingList } from './shop/shopping-list';
import {
	addExtra,
	openNotePath,
	putInCart,
	readTrip,
	removeTasks,
	taskOf,
	unmark,
	type TripTask
} from './shop/shopping-note';
import { suggestionsOf } from './shop/suggestions';
import { storeOrderOf } from './shop/store-order';
import { storesOf } from './shop/stores';
import { cartOf, isPantryItem, itemsOf, listOf, type TripItem } from './shop/trip';
import { showMeasure } from './units';

export type RecipeEntry = {
	path: string;
	recipe: Recipe;
	rating: number | null;
	match: RecipeMatch;
	// What you must do before you can cook the recipe, or null.
	prep: string | null;
};

// A meal of the plan. The entry is null when the note of the recipe is gone.
export type Meal = PlannedMeal & { entry: RecipeEntry | null };

export type CookResult = {
	// The new rows of each food item that the meal used, by the path of its note.
	stocks: Map<string, Stock[]>;
	rating: number | null;
	note: string;
	photo: Blob | null;
};

// What the plugin keeps in its data file: the paths of the food items whose suggestion you skipped
// for this trip, and the settings. The cart is not here. It is in the note of the trip, which
// Obsidian moves to your other device.
type Saved = { skipped: string[]; settings: Settings };
type Disk = { load: () => Promise<Partial<Saved> | null>; save: (data: Saved) => Promise<void> };

const share = (entry: RecipeEntry) =>
	entry.match.ingredients.length ? entry.match.inPantry / entry.match.ingredients.length : 0;

function ratingOf(properties: Record<string, unknown>): number | null {
	const rating = Number(properties.rating);
	return rating >= 1 && rating <= 5 ? Math.round(rating) : null;
}

export class Kitchen {
	notes = $state.raw<Note[]>([]);
	foods = $state.raw<FoodNote[]>([]);
	plan = $state.raw<PlannedMeal[]>([]);
	// The items of the open note of the trip.
	trip = $state.raw<TripItem[]>([]);
	// The store of the open trip, from the property `store` of its note, or no text.
	tripStore = $state('');
	// The paths of the notes of the items folder. The field "Add an item" proposes them.
	itemNotes = $state.raw<string[]>([]);
	// The receipts of the shopping folder: the history of your trips.
	private receipts = $state.raw<Receipt[]>([]);
	// The paths of the food items whose suggestion you skipped for this trip.
	private skipped = $state.raw<string[]>([]);
	settings = $state.raw<Settings>(DEFAULT_SETTINGS);
	today = $state(today());

	// Where the notes are, as paths of the vault. An empty pantry folder or plan note is not
	// possible, so each of them gets its default.
	private where = $derived({
		recipes: folderPath(this.settings.recipesFolder),
		pantry: folderPath(this.settings.pantryFolder) || DEFAULT_SETTINGS.pantryFolder,
		plan: notePath(this.settings.planNote) || DEFAULT_SETTINGS.planNote,
		shopping: folderPath(this.settings.shoppingFolder) || DEFAULT_SETTINGS.shoppingFolder,
		items: folderPath(this.settings.itemsFolder) || DEFAULT_SETTINGS.itemsFolder
	});
	private openNote = $derived(openNotePath(this.where.shopping));
	// A row with no place is not a row of the pantry, so an empty place is not possible.
	private newPlace = $derived(this.settings.newPlace.trim() || DEFAULT_SETTINGS.newPlace);

	// The recipes that use up the pantry come first, and food to use soon moves its recipes up.
	recipes = $derived.by(() => {
		const index = indexFoods(this.foods);
		return this.notes
			.flatMap(({ path, result, rating }): RecipeEntry[] => {
				if (!result.ok) return [];
				const match = matchRecipe(result.recipe, index, this.today, this.settings.soonDays);
				return [{ path, recipe: result.recipe, rating, match, prep: readPrep(result.recipe) }];
			})
			.sort(
				(a, b) =>
					Number(b.match.useSoon.length > 0) - Number(a.match.useSoon.length > 0) ||
					share(b) - share(a) ||
					a.recipe.title.localeCompare(b.recipe.title)
			);
	});

	rejected = $derived(
		this.notes
			.flatMap(({ path, result }) => (result.ok ? [] : [{ path, reason: result.reason }]))
			.sort((a, b) => a.path.localeCompare(b.path))
	);

	places = $derived(
		[...new Set(this.foods.flatMap(({ item }) => item.stocks.map((stock) => stock.place)))].sort()
	);

	meals = $derived(
		this.plan.map((meal): Meal => {
			const entry = this.recipes.find((recipe) => recipe.path === meal.path) ?? null;
			return { ...meal, entry };
		})
	);

	// What the meals that you did not cook need, with no regard to the pantry.
	private needs = $derived(
		needsOf(
			this.meals.flatMap(({ cooked, entry }) =>
				cooked || !entry
					? []
					: [{ title: entry.recipe.title, ingredients: entry.match.ingredients }]
			),
			this.where.pantry
		)
	);

	// The rows that the plugin calculates from those needs.
	private calculated = $derived({
		missing: shoppingList(this.needs, this.settings.lowPercent),
		past: pastDateRows(this.needs, this.today)
	});

	// The newest receipt row of each item: what you usually buy, and what it costs.
	private bought = $derived.by(() => lastRows(this.receipts, this.pathOf));

	list = $derived(listOf(this.calculated, this.trip, this.foods, this.bought));
	cart = $derived(cartOf(this.calculated, this.trip, this.foods, this.bought));

	// The stores of the receipts, for the stage Shop and the stage Put away.
	stores = $derived(storesOf(this.receipts));

	// Where each item was on the newest receipt of the store of the trip.
	storeOrder = $derived.by(() => storeOrderOf(this.receipts, this.tripStore, this.pathOf));

	// The items of the cart for the screen of put away, each with the facts that it starts with.
	toPutAway = $derived.by(() => {
		const last = this.bought;
		const now = { today: this.today, newPlace: this.newPlace };
		return this.cart.map((row): CartItem => {
			const item = this.trip.find((item) => item.key === row.key);
			const inPantry = item !== undefined && isPantryItem(item, this.where.pantry);
			return cartItemOf({ row, inPantry, last: last.get(row.key) ?? null }, now);
		});
	});

	// The food items that need a look. A food item that is on the list already, or that you
	// skipped, is not one of them.
	suggestions = $derived(
		suggestionsOf(
			this.foods,
			{
				today: this.today,
				soonDays: this.settings.soonDays,
				lowPercent: this.settings.lowPercent
			},
			{
				past: new Set(this.calculated.past.map((row) => row.key)),
				hidden: new Set([
					...this.skipped,
					...this.trip.map((item) => item.key),
					...this.calculated.missing.map((row) => row.key)
				])
			}
		)
	);

	private app: App;
	private disk: Disk;
	// Obsidian removes a registered event when the plugin stops.
	private register: (ref: EventRef) => void;
	private started = false;
	private notesByPath = new Map<string, Note>();
	private foodsByPath = new Map<string, FoodNote>();
	private planNow: PlannedMeal[] = [];
	private tripNow: TripTask[] = [];
	private tripStoreNow = '';
	private itemPaths = new Set<string>();
	private receiptsByPath = new Map<string, Receipt>();

	constructor(app: App, disk: Disk, register: (ref: EventRef) => void) {
		this.app = app;
		this.disk = disk;
		this.register = register;
	}

	// Reads the data file of the plugin. The settings screen needs it before the kitchen starts.
	async loadSaved() {
		const saved = await this.disk.load();
		this.skipped = saved?.skipped ?? [];
		this.settings = { ...DEFAULT_SETTINGS, ...saved?.settings };
	}

	// Changes settings and saves them. With a new folder or plan note, the kitchen reads the vault
	// again.
	async changeSettings(change: Partial<Settings>) {
		const places = [
			'recipesFolder',
			'pantryFolder',
			'planNote',
			'shoppingFolder',
			'itemsFolder'
		] as const;
		const moved = places.some((key) => key in change && change[key] !== this.settings[key]);
		this.settings = { ...this.settings, ...change };
		await this.save();
		if (moved && this.started) this.readAgain();
	}

	// Reads the vault one time, and then follows each change of a note.
	async start() {
		if (this.started) return;
		this.started = true;

		const { vault } = this.app;
		const { register } = this;
		await this.readAll();

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

	// --- Pantry ---

	async setStocks(path: string, stocks: Stock[]) {
		const file = this.fileAt(path);
		if (!file) return;
		const item = this.foods.find((food) => food.path === path)?.item;
		await this.app.vault.process(file, (text) => replaceStocks(text, stocks));
		if (item) await this.keepFull(file, item, stocks);
	}

	// Adds an amount to a food item. A food item that is new gets its own note.
	async addStock(name: string, stock: Stock) {
		await this.addStockTo(this.foodPath(name), stock);
	}

	// The note of the food item with a name. A name that no food item has gets the path of a new
	// note of the pantry folder.
	private foodPath(name: string) {
		const key = nameKey(name);
		const food = this.foods.find(({ item }) => nameKey(item.name) === key);
		return food?.path ?? notePathIn(this.where.pantry, name);
	}

	// Adds an amount to the food item of a note. If the note is not there, the plugin makes it.
	// `add` tells which row gets the amount.
	private async addStockTo(path: string, stock: Stock, add = addStock) {
		const file = this.fileAt(path);
		const food = this.foods.find((food) => food.path === path);
		if (file) {
			await this.app.vault.process(file, (text) => add(text, stock));
			if (food) await this.keepFull(file, food.item, [...food.item.stocks, stock]);
			return;
		}
		await this.makeFolderOf(path);
		const created = await this.app.vault.create(path, `${showStocks([stock])}\n`);
		// Before this change, the food item had no property and no row.
		await this.keepFull(created, readFoodItem(created.basename, {}, ''), [stock]);
	}

	// The low line of a food item, such as "200 g". With no text, the plugin sets the line.
	async setLow(path: string, low: string) {
		const file = this.fileAt(path);
		if (!file) return;
		await this.app.fileManager.processFrontMatter(file, (properties) => {
			if (low.trim()) properties.low = low.trim();
			else delete properties.low;
		});
	}

	// Labels a food item as a staple, with its kind, or as food that the Shop part never asks about.
	// Null takes the two labels off.
	async setStaple(path: string, label: StapleLabel) {
		const file = this.fileAt(path);
		if (!file) return;
		await this.app.fileManager.processFrontMatter(file, (properties) => {
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

	// The full amount is the most that the pantry had of a food item. `item` is the food item before
	// the change, and `stocks` are its rows after the change.
	private async keepFull(file: TFile, item: FoodItem, stocks: Stock[]) {
		const full = fullAfter(item, stocks);
		if (!full) return;
		await this.app.fileManager.processFrontMatter(file, (properties) => {
			properties.full = showMeasure(full);
		});
	}

	// --- Plan ---

	isPlanned(path: string) {
		return this.plan.some((meal) => meal.path === path && !meal.cooked);
	}

	// A meal is a meal of today from the moment that you select it, until the end of that day.
	isToday(meal: PlannedMeal) {
		return !meal.cooked && meal.day === this.today;
	}

	// The week has room for 7 meals of each type. A meal that you cooked gives its place back.
	async addToPlan(path: string) {
		const entry = this.recipes.find((recipe) => recipe.path === path);
		const type = entry ? typeOf(entry) : 'other';
		const open = this.meals.filter((meal) => !meal.cooked && meal.path !== path);
		if (!hasRoom(open, type)) {
			this.notify(`The week has ${ROOM} meals of the type "${type}". Cook or remove one first.`);
			return;
		}
		const title = entry?.recipe.title ?? path.replace(/\.md$/, '');
		await this.writePlan((text) => addMeal(text, path, title));
	}

	// Selects a meal for today, or puts it back with the other meals of the week.
	async setToday(path: string, on: boolean) {
		const day = on ? this.today : null;
		await this.writePlan((text) => changeMeal(text, path, { day }));
	}

	async setPrepDone(path: string, prepDone: boolean) {
		await this.writePlan((text) => changeMeal(text, path, { prepDone }));
	}

	async removeFromPlan(path: string) {
		await this.writePlan((text) => removeMeal(text, path));
	}

	async clearPlan() {
		await this.writePlan(removeMeals);
	}

	// --- Shop ---

	// A tap on a row of the list. An extra has its task already. A row that the plugin calculates
	// gets its task now.
	async putInCart(key: string) {
		const row = this.calculated.missing.find((row) => row.key === key);
		const task = this.trip.find((item) => item.key === key) ?? (row && taskOf(row.key));
		if (task) await this.writeTrip((text) => putInCart(text, task));
	}

	// "Undo" puts the item back on the list. If the plugin calculates a row for the item, the list
	// has it with no task, so the task goes out. If not, the task stays with no mark, as an extra.
	async takeOutOfCart(key: string) {
		const item = this.trip.find((item) => item.key === key);
		if (!item) return;
		const onList = this.calculated.missing.some((row) => row.key === key);
		await this.writeTrip((text) => (onList ? removeTasks(text, [item]) : unmark(text, item)));
	}

	// The price that you usually pay for an item: the newest price of its receipts with no sale mark,
	// or no text.
	regularOf(key: string): string {
		return this.bought.get(key)?.regular ?? '';
	}

	// In the store, you take an item that is not on the list. It goes into the cart at once.
	async addToCart(path: string) {
		await this.writeTrip((text) => putInCart(text, taskOf(path)));
	}

	async addNewToCart(name: string) {
		await this.addToCart(notePathIn(this.where.items, name));
	}

	// Puts the note of an item on the list, as an extra: a suggestion that you accept, a note that
	// the field "Add an item" proposes, or a new item. An item that is in the note stays as it is.
	async addExtra(path: string) {
		if (this.trip.some((item) => item.key === path)) return;
		await this.writeTrip((text) => addExtra(text, taskOf(path)));
	}

	// An item that no note has links into the items folder. The plugin makes no note for it.
	async addNewItem(name: string) {
		await this.addExtra(notePathIn(this.where.items, name));
	}

	// Takes an extra off the list. A staple is a suggestion again.
	async removeExtra(key: string) {
		const item = this.trip.find((item) => item.key === key);
		if (item) await this.writeTrip((text) => removeTasks(text, [item]));
	}

	// The store is a fact of the trip from its start, so the open note keeps it. You type a new store
	// letter by letter, and the note gets it when you stop.
	setTripStore(store: string) {
		this.tripStore = store.trim();
		this.writeStore(store.trim());
	}

	private writeStore = debounce((store: string) => void this.saveTripStore(store), 600, true);

	private saveTripStore(store: string) {
		return this.inTurn(async () => {
			if (!this.fileAt(this.openNote)) {
				await this.makeFolderOf(this.openNote);
				await this.app.vault.create(this.openNote, '');
			}
			const file = this.fileAt(this.openNote);
			if (!file) return;
			await this.app.fileManager.processFrontMatter(file, (properties) => {
				if (store) properties.store = store;
				else delete properties.store;
			});
		});
	}

	// The suggestion stays away until put away ends the trip.
	async skip(path: string) {
		this.skipped = [...this.skipped, path];
		await this.save();
	}

	async unskip(path: string) {
		this.skipped = this.skipped.filter((other) => other !== path);
		await this.save();
	}

	// The food item is never a suggestion again. The form of the Pantry part can undo this.
	async neverAsk(path: string) {
		await this.setStaple(path, 'never');
	}

	// Put away is in progress. A second tap must not add the food a second time.
	private puttingAway = false;

	// Ends the trip: each item of the cart goes into the pantry with the facts that you gave, and
	// the open note becomes the receipt of today. `given` has the facts of each item, by its key.
	// A trip can have no store.
	async putAway(given: Map<string, Facts>, store: string) {
		if (this.puttingAway) return;
		// The store goes into the receipt now. A write that waits would make a new open note after it.
		this.writeStore.cancel();
		this.puttingAway = true;
		try {
			const purchases: Purchase[] = [];
			for (const item of this.trip) {
				const facts = given.get(item.key);
				if (item.inCart && facts) purchases.push(await this.buy(item, facts));
			}
			if (!purchases.length) return;
			await this.endTrip(purchases, store.trim());

			this.skipped = [];
			await this.save();
			const count = purchases.filter(({ place }) => place).length;
			if (count) this.notify(`${count} ${count === 1 ? 'item is' : 'items are'} in the pantry.`);
		} finally {
			this.puttingAway = false;
		}
	}

	// Puts one item of the cart into the pantry. An item that does not go into the pantry, such as
	// batteries, changes nothing there.
	private async buy(item: TripItem, facts: Facts): Promise<Purchase> {
		if (!facts.intoPantry) return purchaseOf(item, facts, item.link);

		// An item of your own has no note in the pantry folder. It goes to the food item with its
		// name, or to a new one, and the receipt links to that note.
		const own = !isPantryItem(item, this.where.pantry);
		const path = own ? this.foodPath(item.name) : item.key;
		for (const stock of stocksOf(facts)) await this.addStockTo(path, stock, putAwayStock);

		const file = this.fileAt(path);
		if (file) {
			await this.app.fileManager.processFrontMatter(file, (properties) => {
				properties.bought = this.today;
			});
		}
		return purchaseOf(item, facts, own ? path.replace(/\.md$/, '') : item.link);
	}

	// The open note becomes the receipt: it gets the day as its property and as its name, and the
	// store. Each task with no mark starts the note of the next trip.
	private endTrip(purchases: Purchase[], store: string) {
		return this.inTurn(async () => {
			const file = this.fileAt(this.openNote);
			if (!file) return;

			let left = '';
			await this.app.vault.process(file, (text) => {
				left = leftOf(text);
				return receiptOf(text, purchases);
			});
			await this.app.fileManager.processFrontMatter(file, (properties) => {
				properties.date = this.today;
				if (store) properties.store = store;
			});
			const isTaken = (path: string) => this.app.vault.getAbstractFileByPath(path) !== null;
			const path = receiptPath(this.where.shopping, this.today, isTaken);
			await this.app.fileManager.renameFile(file, path);
			if (left) await this.app.vault.create(this.openNote, left);
		});
	}

	// --- Cook ---

	// Takes the food out of the pantry, and writes the rating and the record into the recipe note.
	async finishCooking(path: string, result: CookResult) {
		for (const [foodPath, stocks] of result.stocks) await this.setStocks(foodPath, stocks);

		const file = this.fileAt(path);
		const entry = this.recipes.find((recipe) => recipe.path === path);
		if (file && entry) {
			const photo = result.photo ? await this.savePhoto(result.photo, file) : null;
			const { rating, note } = result;
			if (rating) {
				await this.app.fileManager.processFrontMatter(file, (properties) => {
					properties.rating = rating;
				});
			}
			const hasInstructions = entry.recipe.instructions !== null;
			const record = { date: this.today, rating, note, photo };
			await this.app.vault.process(file, (text) => addRecord(text, hasInstructions, record));
		}

		if (this.isPlanned(path)) {
			await this.writePlan((text) => changeMeal(text, path, { cooked: true }));
		}
	}

	private async savePhoto(photo: Blob, recipe: TFile): Promise<string> {
		const name = `${recipe.basename} ${this.today}.jpg`;
		const path = await this.app.fileManager.getAvailablePathForAttachment(name, recipe.path);
		await this.app.vault.createBinary(path, await shrinkPhoto(photo));
		return path;
	}

	// The change gets the text that the note has at that moment. Thus two taps, one directly after
	// the other, do not lose a meal.
	private async writePlan(change: (text: string) => string) {
		const file = this.fileAt(this.where.plan);
		if (file) await this.app.vault.process(file, change);
		else await this.app.vault.create(this.where.plan, change(''));
	}

	// One change of the open note at a time. Thus two fast taps make the note one time, and the
	// second tap finds the task of the first.
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
		return this.disk.save({ skipped: this.skipped, settings: this.settings });
	}

	// --- The notes of the vault ---

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

	// The note that a link of the open note goes to, as Obsidian finds it: "Lime" is the note
	// "Pantry/Lime.md". A link to a note that is not there keeps its own path.
	private pathOf = (link: string) =>
		this.app.metadataCache.getFirstLinkpathDest(link, this.openNote)?.path ?? notePath(link);

	// What a note is for the kitchen, from its path. Null: the kitchen does not read the note. A
	// note of the shopping folder that is not the open note can be a receipt.
	private kindOf(path: string): 'plan' | 'trip' | 'food' | 'item' | 'receipt' | 'recipe' | null {
		const { plan, pantry, shopping, items, recipes } = this.where;
		if (path === plan) return 'plan';
		if (path === this.openNote) return 'trip';
		if (path.startsWith(`${pantry}/`)) return 'food';
		if (path.startsWith(`${items}/`)) return 'item';
		if (path.startsWith(`${shopping}/`)) return 'receipt';
		return !recipes || path.startsWith(`${recipes}/`) ? 'recipe' : null;
	}

	private async read(file: TAbstractFile) {
		if (!(file instanceof TFile) || file.extension !== 'md') return;
		if (!this.kindOf(file.path)) return;
		const text = await this.app.vault.cachedRead(file);
		// A rename can occur during the read, so the path comes after it.
		const { path } = file;
		const kind = this.kindOf(path);
		const { properties, body } = readProperties(text);

		if (kind === 'plan') {
			this.planNow = readPlan(text);
		} else if (kind === 'trip') {
			this.tripNow = readTrip(text);
			this.tripStoreNow = typeof properties.store === 'string' ? properties.store.trim() : '';
		} else if (kind === 'item') {
			this.itemPaths.add(path);
		} else if (kind === 'receipt') {
			const receipt = readReceipt(file.basename, properties, body);
			if (receipt) this.receiptsByPath.set(path, receipt);
			else this.receiptsByPath.delete(path);
		} else if (kind === 'food') {
			const item = readFoodItem(file.basename, properties, body);
			this.foodsByPath.set(path, { path, item });
		} else if (kind === 'recipe') {
			this.notesByPath.set(path, { path, result: readRecipe(text), rating: ratingOf(properties) });
		}
	}

	private async readAll() {
		this.notesByPath.clear();
		this.foodsByPath.clear();
		this.planNow = [];
		this.tripNow = [];
		this.tripStoreNow = '';
		this.itemPaths.clear();
		this.receiptsByPath.clear();
		await Promise.all(this.app.vault.getMarkdownFiles().map((file) => this.read(file)));
		this.show();
	}

	// You type the name of a folder letter by letter. The kitchen waits until you stop.
	private readAgain = debounce(() => void this.readAll(), 500, true);

	private async update(file: TAbstractFile) {
		await this.read(file);
		this.show();
	}

	private forget(path: string) {
		if (path === this.where.plan) this.planNow = [];
		if (path === this.openNote) {
			this.tripNow = [];
			this.tripStoreNow = '';
		}
		this.itemPaths.delete(path);
		this.receiptsByPath.delete(path);
		this.notesByPath.delete(path);
		this.foodsByPath.delete(path);
		this.show();
	}

	private show() {
		this.notes = [...this.notesByPath.values()];
		this.foods = [...this.foodsByPath.values()];
		this.plan = this.planNow;
		// A link can go to a different note after a change of the vault, so the paths are new each time.
		this.trip = itemsOf(this.tripNow, this.pathOf);
		this.tripStore = this.tripStoreNow;
		this.itemNotes = [...this.itemPaths];
		this.receipts = [...this.receiptsByPath.values()];
		this.today = today();
	}
}
