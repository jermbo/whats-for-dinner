// The kitchen: all that the screens show, and all that they can do. The notes of the vault are the
// only source. Each action writes a note, and the kitchen reads the note again after the change.
// The actions are in one object for each subject, such as `kitchen.pantry`.

import { debounce, Notice, TFile, type App, type Component, type TAbstractFile } from 'obsidian';
import { brandActions, type BrandActionsHost } from './kitchen/brand-actions';
import { cookActions, type CookActionsHost } from './kitchen/cook-actions';
import { intakeActions, type IntakeActionsHost } from './kitchen/intake-actions';
import { occasionActions, type OccasionActionsHost } from './kitchen/occasion-actions';
import { mealsOf } from './kitchen/meals-view';
import {
	addStockByName,
	addStockTo,
	pantryActions,
	setStaple,
	type PantryActionsHost
} from './kitchen/pantry-actions';
import type { PhotoActionsHost } from './kitchen/photo-actions';
import { planActions, type PlanActionsHost } from './kitchen/plan-actions';
import { rejectedRecipes, recipesOf } from './kitchen/recipes-view';
import { setupActions, type SetupActionsHost } from './kitchen/setup-actions';
import {
	flushReceiptFacts,
	saveTripStore,
	shopActions,
	type ShopActionsHost,
	type ShopMutable
} from './kitchen/shop-actions';
import {
	cartItems,
	putAwayCartItems,
	storeOrderOf,
	storesOf,
	tripSuggestions
} from './kitchen/shop-read-model';
import { tried } from './kitchen/tried';
import { calculatedList, mealNeeds } from './shop/calculated-list';
import type { Disk, KitchenPage, Part } from './kitchen/types';
import { noteKind, VaultBuffer } from './kitchen/vault-buffer';
import { indexFoods } from './match/match';
import { listedDishes, toBuyOf } from './occasion/occasion-list';
import type { Occasion } from './occasion/occasions';
import type { FoodNote, Note } from './note';
import { notePathIn } from './note-path';
import { placesOf } from './pantry/places';
import type { PlannedMeal } from './plan/plan-note';
import { DEFAULT_SETTINGS, folderPath, notePath, type Settings } from './settings';
import { homeOf } from './setup/home';
import { hasKitchenNotes, screenOf, type Setup } from './setup/screen';
import type { Receipt } from './shop/read-receipt';
import type { ReceiptLine } from './shop/receipt';
import { openNotePath } from './shop/shopping-note';
import type { TripItem } from './shop/trip';
import { today } from './dates';

export type { CookResult, KitchenPage, Part } from './kitchen/types';

const PART_KEY = 'whats-for-dinner-part';
// A write waits this long after the last key, so that each key that you type is not a write.
const TYPING_WAIT_MS = 600;
// A move of folders in the settings is a few changes. The vault is read again once, after the last.
const SETTINGS_WAIT_MS = 500;
const MINUTE_MS = 60_000;
const PARTS: unknown[] = ['pantry', 'recipes', 'plan', 'shop', 'occasion'];

export class Kitchen {
	notes = $state.raw<Note[]>([]);
	foods = $state.raw<FoodNote[]>([]);
	plannedMeals = $state.raw<PlannedMeal[]>([]);
	trip = $state.raw<TripItem[]>([]);
	tripStore = $state('');
	private active = $state.raw<{ path: string; lines: ReceiptLine[] } | null>(null);
	itemNotes = $state.raw<string[]>([]);
	private receipts = $state.raw<Receipt[]>([]);
	occasions = $state.raw<Occasion[]>([]);
	private skipped = $state.raw<string[]>([]);
	settings = $state.raw<Settings>(DEFAULT_SETTINGS);
	today = $state(today());
	// The step of setup, "done", or null before setup starts.
	setupStep = $state<Setup | null>(null);
	// If the vault had notes of the kitchen at the last read. Null before the first read.
	private hasNotes = $state<boolean | null>(null);
	screen = $derived(screenOf(this.setupStep, this.hasNotes));
	// A page that covers the four parts, such as intake. A command of Obsidian can open it, so it is
	// here and not in a screen.
	page = $state.raw<KitchenPage | null>(null);
	// The part on the screen. It is here so that it stays when the tab closes, and the local storage
	// keeps it after a restart. That storage is per device, so Sync does not move it.
	part = $state<Part>('pantry');
	// The occasion whose screen is open in the Occasions part, or null for the list.
	private occasionPath = $state<string | null>(null);
	// The line of the note that you converted last. The Recipes part shows it once more when it opens,
	// so that you see the line go out of the list of notes that fail.
	private converted: { path: string; reason: string } | null = null;

	// The actions of each subject. A host gives an action the fields as they are when the action
	// runs, so the object is new for each call.
	get pantry() {
		return pantryActions(this.pantryHost);
	}
	get brands() {
		return brandActions(this.brandHost);
	}
	get plan() {
		return planActions(this.planHost);
	}
	get shop() {
		return shopActions(this.shopHost);
	}
	get cook() {
		return cookActions(this.cookHost);
	}
	get intake() {
		return intakeActions(this.intakeHost);
	}
	get setup() {
		return setupActions(this.setupHost);
	}
	get occasion() {
		return occasionActions(this.occasionHost);
	}

	private where = $derived({
		recipes: folderPath(this.settings.recipesFolder),
		pantry: folderPath(this.settings.pantryFolder) || DEFAULT_SETTINGS.pantryFolder,
		plan: notePath(this.settings.planNote) || DEFAULT_SETTINGS.planNote,
		shopping: folderPath(this.settings.shoppingFolder) || DEFAULT_SETTINGS.shoppingFolder,
		items: folderPath(this.settings.itemsFolder) || DEFAULT_SETTINGS.itemsFolder,
		occasions: folderPath(this.settings.occasionsFolder) || DEFAULT_SETTINGS.occasionsFolder
	});
	private openNote = $derived(openNotePath(this.where.shopping));
	// The place for new food. An empty setting is the default place.
	newPlace = $derived(this.settings.newPlace.trim() || DEFAULT_SETTINGS.newPlace);

	recipes = $derived.by(() =>
		recipesOf(this.notes, this.foods, this.today, this.settings.soonDays)
	);
	rejected = $derived(rejectedRecipes(this.notes));
	foodIndex = $derived(indexFoods(this.foods));
	places = $derived(placesOf(this.settings.places, this.foods));
	meals = $derived(mealsOf(this.plannedMeals, this.recipes));
	// When the note is gone, such as after "Delete occasion", the part shows the list again.
	openOccasion = $derived(this.occasions.find((occasion) => occasion.path === this.occasionPath) ?? null);

	private needs = $derived(
		mealNeeds(this.meals, this.where.pantry, listedDishes(this.occasions, this.recipes, this.today))
	);
	private calculated = $derived(calculatedList(this.needs, this.today));
	private shopLists = $derived.by(() =>
		cartItems(this.calculated, {
			trip: this.trip,
			foods: this.foods,
			receipts: this.receipts,
			active: this.active,
			pathOf: this.pathOf
		})
	);

	list = $derived(this.shopLists.list);
	cart = $derived(this.shopLists.cart);
	hasPutAway = $derived(this.active?.lines.some((line) => line.done) ?? false);
	stores = $derived(storesOf(this.receipts));
	storeOrder = $derived.by(() => storeOrderOf(this.receipts, this.tripStore, this.pathOf));
	toPutAway = $derived.by(() =>
		putAwayCartItems(this.cart, {
			trip: this.trip,
			bought: this.shopLists.bought,
			pantryFolder: this.where.pantry,
			active: this.active,
			pathOf: this.pathOf,
			now: { today: this.today, newPlace: this.newPlace }
		})
	);
	suggestions = $derived(
		tripSuggestions(
			this.foods,
			{ today: this.today, soonDays: this.settings.soonDays },
			{
				skipped: this.skipped,
				trip: this.trip,
				missingKeys: this.calculated.missing.map((row) => row.key)
			}
		)
	);

	private app: App;
	private disk: Disk;
	// An event, a listener, or a timer that the kitchen registers here stops with the plugin.
	private plugin: Component;
	private started = false;
	private vault = new VaultBuffer();
	private shopMutable: ShopMutable = { puttingAway: false, pendingFacts: new Map() };
	private writeFacts = debounce(
		() => void tried('The receipt did not change', () => flushReceiptFacts(this.shopHost)),
		TYPING_WAIT_MS,
		true
	);
	private writeStore = debounce(
		(store: string) =>
			void tried('The store is not saved', () => saveTripStore(this.shopHost, store)),
		TYPING_WAIT_MS,
		true
	);

	constructor(app: App, disk: Disk, plugin: Component) {
		this.app = app;
		this.disk = disk;
		this.plugin = plugin;
		const part = app.loadLocalStorage(PART_KEY);
		if (PARTS.includes(part)) this.part = part;
	}

	showPart(part: Part) {
		this.part = part;
		this.app.saveLocalStorage(PART_KEY, part);
	}

	showOccasion(path: string) {
		this.occasionPath = path;
		this.showPart('occasion');
	}

	closeOccasion() {
		this.occasionPath = null;
	}

	// What the occasion needs to buy, as the list has it, or will have it.
	toBuyOf(occasion: Occasion) {
		return toBuyOf(occasion, {
			meals: this.meals,
			occasions: this.occasions,
			recipes: this.recipes,
			today: this.today,
			pantryFolder: this.where.pantry
		});
	}

	async loadSaved() {
		const saved = await this.disk.load();
		this.skipped = saved?.skipped ?? [];
		this.setupStep = saved?.setup ?? null;
		this.settings = { ...DEFAULT_SETTINGS, ...saved?.settings };
		// A vault from before the occasions keeps them in its own plugin home.
		const home = homeOf(this.settings.pantryFolder);
		if (saved?.settings && !saved.settings.occasionsFolder && home) {
			this.settings = { ...this.settings, occasionsFolder: `${home}/Occasions` };
		}
		// A new install writes the defaults, so that the data file and the settings tab agree.
		if (!saved?.settings) await this.save();
	}

	async changeSettings(change: Partial<Settings>) {
		const paths = [
			'recipesFolder',
			'pantryFolder',
			'planNote',
			'shoppingFolder',
			'itemsFolder',
			'occasionsFolder'
		] as const;
		const moved = paths.some((key) => key in change && change[key] !== this.settings[key]);
		this.settings = { ...this.settings, ...change };
		await this.save();
		if (moved && this.started) this.readAgain();
	}

	async start() {
		if (this.started) return;
		this.started = true;

		const { vault } = this.app;
		const { plugin } = this;
		await this.readAll();
		// A vault from before the list of places starts with the places that its rows have.
		if (!this.settings.places.length && this.places.length) {
			await this.changeSettings({ places: this.places });
		}

		plugin.registerEvent(vault.on('create', (file) => this.update(file)));
		plugin.registerEvent(vault.on('modify', (file) => this.update(file)));
		plugin.registerEvent(vault.on('delete', (file) => this.forget(file.path)));
		plugin.registerEvent(
			vault.on('rename', (file, oldPath) => {
				this.forget(oldPath);
				void this.update(file);
			})
		);

		// The kitchen can stay open past midnight with no change of a note. A phone stops the timer
		// while Obsidian is in the background, so the date is read again when it comes into view.
		const checkToday = () => {
			this.today = today();
		};
		plugin.registerInterval(window.setInterval(checkToday, MINUTE_MS));
		plugin.registerDomEvent(document, 'visibilitychange', checkToday);
	}

	notify(text: string) {
		new Notice(text);
	}

	open(path: string) {
		const file = this.fileAt(path);
		if (file) void this.app.workspace.getLeaf('tab').openFile(file);
	}

	regularOf(key: string): string {
		return this.shopLists.bought.get(key)?.regular ?? '';
	}

	openPage(page: KitchenPage) {
		this.page = page;
	}

	closePage() {
		this.page = null;
	}

	// The address of a photo of a recipe, for an image on the screen, or null when it is gone.
	photoUrl(link: string, recipePath: string): string | null {
		const file = this.app.metadataCache.getFirstLinkpathDest(link, recipePath);
		return file ? this.app.vault.getResourcePath(file) : null;
	}

	// Where the stub of a new food goes: the pantry folder, with the name of the food.
	newFoodPath(name: string): string {
		return notePathIn(this.where.pantry, name);
	}

	takeConverted() {
		const line = this.converted;
		this.converted = null;
		return line;
	}

	private get photoHost(): PhotoActionsHost {
		const kitchen = this;
		return {
			app: kitchen.app,
			get where() {
				return kitchen.where;
			},
			get today() {
				return kitchen.today;
			},
			makeFolderOf: (path) => kitchen.makeFolderOf(path)
		};
	}

	private get intakeHost(): IntakeActionsHost {
		const kitchen = this;
		return {
			...kitchen.photoHost,
			get rejected() {
				return kitchen.rejected;
			},
			keepConverted: (line) => {
				kitchen.converted = line;
			}
		};
	}

	private get brandHost(): BrandActionsHost {
		const kitchen = this;
		return {
			...kitchen.photoHost,
			get foods() {
				return kitchen.foods;
			},
			fileAt: (path) => kitchen.fileAt(path)
		};
	}

	private get pantryHost(): PantryActionsHost {
		const kitchen = this;
		return {
			get foods() {
				return kitchen.foods;
			},
			get where() {
				return kitchen.where;
			},
			fileAt: (path) => kitchen.fileAt(path),
			makeFolderOf: (path) => kitchen.makeFolderOf(path),
			processFile: async (path, change) => {
				const file = kitchen.fileAt(path);
				if (file) await kitchen.app.vault.process(file, change);
			},
			processFrontMatter: async (path, change) => {
				const file = kitchen.fileAt(path);
				if (file) await kitchen.app.fileManager.processFrontMatter(file, change);
			},
			createFile: async (path, text) => kitchen.app.vault.create(path, text)
		};
	}

	private get setupHost(): SetupActionsHost {
		const kitchen = this;
		return {
			get settings() {
				return kitchen.settings;
			},
			get foodCount() {
				return kitchen.foods.length;
			},
			exists: (path) => Boolean(kitchen.app.vault.getAbstractFileByPath(path)),
			createFolder: async (path) => {
				await kitchen.app.vault.createFolder(path);
			},
			createFile: async (path, text) => {
				await kitchen.app.vault.create(path, text);
			},
			changeSettings: (change) => kitchen.changeSettings(change),
			goTo: async (setup) => {
				kitchen.setupStep = setup;
				await kitchen.save();
			},
			// The action and not the method, so that an error stops setup, and setup tells it once.
			addStock: (name, stock) => addStockByName(kitchen.pantryHost, name, stock),
			trash: async (path) => {
				const folder = kitchen.app.vault.getAbstractFileByPath(path);
				// The trash of the vault, and not of the system: a phone can have no system trash.
				if (folder) await kitchen.app.vault.trash(folder, false);
			},
			forgetAll: async () => {
				kitchen.skipped = [];
				kitchen.setupStep = null;
				kitchen.settings = DEFAULT_SETTINGS;
				await kitchen.save();
				if (kitchen.started) await kitchen.readAll();
			},
			folders: () =>
				kitchen.app.vault
					.getAllFolders()
					.map((folder) => folder.path)
					.sort()
		};
	}

	private get planHost(): PlanActionsHost {
		const kitchen = this;
		return {
			get plan() {
				return kitchen.plannedMeals;
			},
			get meals() {
				return kitchen.meals;
			},
			get recipes() {
				return kitchen.recipes;
			},
			get today() {
				return kitchen.today;
			},
			notify: (text) => kitchen.notify(text),
			writePlan: (change) => kitchen.writePlan(change)
		};
	}

	private get shopHost(): ShopActionsHost {
		const kitchen = this;
		return {
			app: kitchen.app,
			vault: kitchen.vault,
			get where() {
				return kitchen.where;
			},
			get openNote() {
				return kitchen.openNote;
			},
			get today() {
				return kitchen.today;
			},
			get newPlace() {
				return kitchen.newPlace;
			},
			get tripStore() {
				return kitchen.tripStore;
			},
			get trip() {
				return kitchen.trip;
			},
			get calculated() {
				return kitchen.calculated;
			},
			get cart() {
				return kitchen.cart;
			},
			get toPutAway() {
				return kitchen.toPutAway;
			},
			get activeLines() {
				return kitchen.active?.lines ?? [];
			},
			get hasPutAway() {
				return kitchen.hasPutAway;
			},
			get foods() {
				return kitchen.foods;
			},
			mutable: kitchen.shopMutable,
			onTripComplete: () => kitchen.onTripComplete(),
			pathOf: (link) => kitchen.pathOf(link),
			fileAt: (path) => kitchen.fileAt(path),
			makeFolderOf: (path) => kitchen.makeFolderOf(path),
			inTurn: (change) => kitchen.inTurn(change),
			writeTrip: (change) => kitchen.writeTrip(change),
			notify: (text) => kitchen.notify(text),
			save: () => kitchen.save(),
			get skipped() {
				return kitchen.skipped;
			},
			setSkipped: (paths) => {
				kitchen.skipped = paths;
			},
			setTripStoreValue: (store) => {
				kitchen.tripStore = store;
			},
			writeFactsSoon: () => kitchen.writeFacts(),
			cancelFactsWrite: () => kitchen.writeFacts.cancel(),
			writeStoreSoon: (store) => kitchen.writeStore(store),
			cancelTripStoreWrite: () => kitchen.writeStore.cancel(),
			addStockTo: (path, stock) => addStockTo(kitchen.pantryHost, path, stock),
			setStaple: (path, label) => setStaple(kitchen.pantryHost, path, label)
		};
	}

	private get occasionHost(): OccasionActionsHost {
		const kitchen = this;
		return {
			get occasions() {
				return kitchen.occasions;
			},
			get where() {
				return kitchen.where;
			},
			readNote: async (path) => {
				const file = kitchen.fileAt(path);
				return file ? kitchen.app.vault.cachedRead(file) : '';
			},
			createNote: async (path, text) => {
				await kitchen.app.vault.create(path, text);
			},
			makeFolderOf: (path) => kitchen.makeFolderOf(path),
			writeOccasion: async (path, change) => {
				const file = kitchen.fileAt(path);
				if (!file) throw new Error(`The note "${path}" is not in the vault now.`);
				await kitchen.app.vault.process(file, change);
			},
			trash: async (path) => {
				const file = kitchen.fileAt(path);
				if (file) await kitchen.app.fileManager.trashFile(file);
			}
		};
	}

	private get cookHost(): CookActionsHost {
		const kitchen = this;
		return {
			...kitchen.occasionHost,
			...kitchen.pantryHost,
			...kitchen.planHost,
			app: kitchen.app,
			get today() {
				return kitchen.today;
			},
			get recipes() {
				return kitchen.recipes;
			},
			fileAt: (path) => kitchen.fileAt(path)
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
			...(this.setupStep ? { setup: this.setupStep } : {})
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

	// False when the file is not a note of the kitchen.
	private async read(file: TAbstractFile): Promise<boolean> {
		if (!(file instanceof TFile) || file.extension !== 'md') return false;
		if (!noteKind(file.path, this.where, this.openNote)) return false;
		const text = await this.app.vault.cachedRead(file);
		const { path } = file;
		// A change of a folder in the settings can come during the read, so the kind is found again.
		const kind = noteKind(path, this.where, this.openNote);
		if (!kind) return false;
		this.vault.applyRead(path, kind, text, file.basename);
		return true;
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

	private readAgain = debounce(() => void this.readAll(), SETTINGS_WAIT_MS, true);

	// A different note of the vault changes nothing, so the lists of the kitchen do not run again.
	// A photo shows the kitchen again: Sync can bring it after the note that links to it.
	private async update(file: TAbstractFile) {
		const isNote = file instanceof TFile && file.extension === 'md';
		if ((await this.read(file)) || !isNote) this.show();
	}

	private forget(path: string) {
		this.vault.forget(path, this.openNote, this.where.plan);
		this.show();
	}

	private show() {
		const snap = this.vault.snapshot(this.where, this.openNote, this.pathOf);
		this.notes = snap.notes;
		this.foods = snap.foods;
		this.plannedMeals = snap.plan;
		this.trip = snap.trip;
		this.tripStore = snap.tripStore;
		this.itemNotes = snap.itemNotes;
		this.receipts = snap.receipts;
		this.active = snap.active;
		this.occasions = snap.occasions;
	}
}
