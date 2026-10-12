// The kitchen: all that the screens show, and all that they can do. The notes of the vault are the
// only source. Each action writes a note, and the kitchen reads the note again after the change.

import { debounce, Notice, TFile, type App, type EventRef, type TAbstractFile } from 'obsidian';
import { shrinkPhoto } from './cook/photo';
import { addRecord } from './cook/record';
import { today } from './dates';
import { indexFoods, matchRecipe, type RecipeMatch } from './match/match';
import { nameKey } from './match/names';
import type { FoodNote, Note } from './note';
import { makeStock, readFoodItem } from './pantry/food-item';
import { fullAfter } from './pantry/level';
import type { FoodItem, Stock } from './pantry/types';
import { addStock, replaceStocks, showStocks } from './pantry/write';
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
import { lowFoods, shoppingList } from './shop/shopping-list';
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

// What the plugin keeps in its data file: the keys of the shopping rows that are in the cart, if
// the shopping list has the low food, and the settings.
type Saved = { cart: string[]; shopLow: boolean; settings: Settings };
type Disk = { load: () => Promise<Partial<Saved> | null>; save: (data: Saved) => Promise<void> };

const share = (entry: RecipeEntry) =>
	entry.match.ingredients.length ? entry.match.inPantry / entry.match.ingredients.length : 0;

function ratingOf(properties: Record<string, unknown>): number | null {
	const rating = Number(properties.rating);
	return rating >= 1 && rating <= 5 ? Math.round(rating) : null;
}

// A name that is safe as the name of a note, with a capital first letter.
function noteName(name: string): string {
	const clean = name.replace(/[\\/:*?"<>|#^[\]]/g, ' ').replace(/\s+/g, ' ').trim();
	return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export class Kitchen {
	notes = $state.raw<Note[]>([]);
	foods = $state.raw<FoodNote[]>([]);
	plan = $state.raw<PlannedMeal[]>([]);
	cart = $state.raw<string[]>([]);
	// The shopping list has the low food too.
	shopLow = $state(false);
	settings = $state.raw<Settings>(DEFAULT_SETTINGS);
	today = $state(today());

	// Where the notes are, as paths of the vault. An empty pantry folder or plan note is not
	// possible, so each of them gets its default.
	private where = $derived({
		recipes: folderPath(this.settings.recipesFolder),
		pantry: folderPath(this.settings.pantryFolder) || DEFAULT_SETTINGS.pantryFolder,
		plan: notePath(this.settings.planNote) || DEFAULT_SETTINGS.planNote
	});

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

	// The food to buy again: each food item that is below its low line, or that is out.
	low = $derived(lowFoods(this.foods, this.settings.lowPercent));

	// The list is the meals that you did not cook, minus the pantry. The low food is your choice.
	shopping = $derived(
		shoppingList(
			this.meals.flatMap(({ cooked, entry }) =>
				cooked || !entry
					? []
					: [{ title: entry.recipe.title, ingredients: entry.match.ingredients }]
			),
			this.shopLow ? this.low : []
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

	constructor(app: App, disk: Disk, register: (ref: EventRef) => void) {
		this.app = app;
		this.disk = disk;
		this.register = register;
	}

	// Reads the data file of the plugin. The settings screen needs it before the kitchen starts.
	async loadSaved() {
		const saved = await this.disk.load();
		this.cart = saved?.cart ?? [];
		this.shopLow = saved?.shopLow ?? false;
		this.settings = { ...DEFAULT_SETTINGS, ...saved?.settings };
	}

	// Changes settings and saves them. With a new folder or plan note, the kitchen reads the vault
	// again.
	async changeSettings(change: Partial<Settings>) {
		const places = ['recipesFolder', 'pantryFolder', 'planNote'] as const;
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
		const key = nameKey(name);
		const food = this.foods.find(({ item }) => nameKey(item.name) === key);
		const folder = this.where.pantry;
		const path = food?.path ?? `${folder}/${noteName(name)}.md`;

		const file = this.fileAt(path);
		if (file) {
			await this.app.vault.process(file, (text) => addStock(text, stock));
			if (food) await this.keepFull(file, food.item, [...food.item.stocks, stock]);
			return;
		}
		if (!this.app.vault.getAbstractFileByPath(folder)) await this.app.vault.createFolder(folder);
		const created = await this.app.vault.create(path, `${showStocks([stock])}\n`);
		const item = { name, aliases: [], brands: [], full: null, low: null, stocks: [] };
		await this.keepFull(created, item, [stock]);
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

	async toggleCart(key: string) {
		this.cart = this.cart.includes(key)
			? this.cart.filter((other) => other !== key)
			: [...this.cart, key];
		await this.save();
	}

	// Puts the low food on the shopping list, or takes it off.
	async toggleShopLow() {
		this.shopLow = !this.shopLow;
		await this.save();
	}

	// Puts each row of the cart into the pantry, in the place where that food item is now.
	async putAway() {
		const rows = this.shopping.filter((row) => this.cart.includes(row.key));
		for (const row of rows) {
			const place = row.food?.item.stocks[0]?.place ?? this.settings.newPlace;
			// A row with no amount, such as salt, goes in as one.
			const amounts = row.buy.length ? row.buy.map(showMeasure) : ['1'];
			for (const amount of amounts) await this.addStock(row.name, makeStock(place, amount, ''));
		}
		this.cart = [];
		await this.save();
		this.notify(`${rows.length} ${rows.length === 1 ? 'item is' : 'items are'} in the pantry.`);
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

	private save() {
		return this.disk.save({ cart: this.cart, shopLow: this.shopLow, settings: this.settings });
	}

	// --- The notes of the vault ---

	private fileAt(path: string): TFile | null {
		const file = this.app.vault.getAbstractFileByPath(path);
		return file instanceof TFile ? file : null;
	}

	// What a note is for the kitchen, from its path. Null: the kitchen does not read the note.
	private kindOf(path: string): 'plan' | 'food' | 'recipe' | null {
		const { plan, pantry, recipes } = this.where;
		if (path === plan) return 'plan';
		if (path.startsWith(`${pantry}/`)) return 'food';
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
		this.notesByPath.delete(path);
		this.foodsByPath.delete(path);
		this.show();
	}

	private show() {
		this.notes = [...this.notesByPath.values()];
		this.foods = [...this.foodsByPath.values()];
		this.plan = this.planNow;
		this.today = today();
	}
}
