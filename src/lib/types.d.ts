import type { Dexie, EntityTable } from 'dexie';

export type Unit = 'g' | 'ml' | 'count';
export type Tracking = 'quantity' | 'state';
export type StockState = 'have' | 'low' | 'out';
export type StorageLocation = 'pantry' | 'fridge' | 'freezer';
export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type MenuKind = 'recipe' | 'leftover';

/** Why a pantry quantity changed. The insights and the undo use it. */
export type Cause = 'bought' | 'cooked' | 'used' | 'corrected' | 'thrown' | 'undo';

export interface Ingredient {
	id: string;
	name: string;
	category: string;
	/** Recipes and the pantry both use this unit. There is no conversion. */
	unit: Unit;
	/** 'quantity' counts an amount. 'state' is only have, low, or out. */
	tracking: Tracking;
	perishable: boolean;
	updatedAt: string;
}

export interface RecipeIngredient {
	ingredientId: string;
	quantity: number;
}

export interface PrepStep {
	text: string;
	/** Hours between this step and the moment the meal is ready to cook. */
	leadHours: number;
}

export interface Recipe {
	id: string;
	name: string;
	mealType: MealType;
	servings: number;
	steps: string;
	/** A URL, or a book name and a page. */
	source: string;
	/** The URL of a photo. Empty or absent: the screens show a placeholder photo. */
	photo?: string;
	inRotation: boolean;
	/** Empty for a reference recipe. */
	ingredients: RecipeIngredient[];
	prepSteps: PrepStep[];
	createdAt: string;
	updatedAt: string;
}

export interface PantryItem {
	id: string;
	ingredientId: string;
	quantity: number;
	/** The largest quantity seen. The pantry check uses it for "full" and "half". */
	fullQuantity: number;
	state: StockState;
	location: StorageLocation;
	updatedAt: string;
}

/** One exact item on a shelf. It is one ingredient. */
export interface Product {
	id: string;
	ingredientId: string;
	name: string;
	/** Package size in the unit of the ingredient. */
	quantity: number;
	photoId: string | null;
	/** Optional. A scan finds the product. */
	barcode: string | null;
	updatedAt: string;
}

/** The picture of one product: a small JPEG. */
export interface Photo {
	id: string;
	blob: Blob;
}

/** One visit to a store: from the first tap until the cart is empty. */
export interface Trip {
	id: string;
	startedAt: string;
	/** The time when the cart became empty. Null while the trip is open. */
	completedAt: string | null;
	updatedAt: string;
}

/**
 * The record of one item in one trip. It is in the cart until the owner puts it away.
 * Then it is the history of the item.
 */
export interface Purchase {
	id: string;
	tripId: string;
	/** Null for an item that is not an ingredient, such as soap. */
	ingredientId: string | null;
	/** The name of the item at the time of the purchase. */
	name: string;
	/** Null when the owner did not tell which product it is. */
	productId: string | null;
	/** The item that the owner added to the list by hand, if this purchase is for one. */
	shoppingItemId: string | null;
	packages: number;
	/**
	 * In the unit of the ingredient. Null for an item with no count, and while the item is in
	 * the cart and the owner did not correct the quantity that the app proposes.
	 */
	quantity: number | null;
	/** The price of one package. Null when the owner gave no price. */
	price: number | null;
	cartAt: string;
	/** Null while the item is in the cart. */
	putAwayAt: string | null;
	updatedAt: string;
}

export interface MenuItem {
	id: string;
	kind: MenuKind;
	recipeId: string;
	addedAt: string;
	prepDoneAt: string | null;
	updatedAt: string;
}

export interface Deduction {
	ingredientId: string;
	amount: number;
}

export interface CookSession {
	id: string;
	recipeId: string;
	recipeName: string;
	kind: MenuKind;
	/** The menu item that this session removed. The undo puts it back. */
	menuItem: MenuItem;
	cookedAt: string;
	rating: number | null;
	note: string;
	deductions: Deduction[];
	leftoverMenuId: string | null;
	updatedAt: string;
}

export interface PantryChange {
	id: string;
	ingredientId: string;
	cause: Cause;
	delta: number;
	state: StockState | null;
	sessionId: string | null;
	at: string;
}

/** An item that the owner added to the shopping list by hand. */
export interface ShoppingItem {
	id: string;
	name: string;
	/** Null for an item that is not an ingredient, such as soap. */
	ingredientId: string | null;
	quantity: number;
	updatedAt: string;
}

/** How a gauge row shows a value, and how a place on the row becomes a value. */
export interface LevelScale {
	/** The value now. */
	value: number;
	max: number;
	/** The change for one press of an arrow key. */
	step: number;
	/** The number of blocks that the row shows. Zero gives one smooth fill. */
	blocks: number;
	/** The fill of the row for a value, from 0 to 1. */
	toFraction(value: number): number;
	/** The value at a place on the row, from 0 to 1. */
	fromFraction(fraction: number): number;
	/** The value in words, for example "500 g" or "Low". */
	text(value: number): string;
}

export interface Meta {
	key: string;
	value: unknown;
}

export type Database = Dexie & {
	ingredients: EntityTable<Ingredient, 'id'>;
	recipes: EntityTable<Recipe, 'id'>;
	pantry: EntityTable<PantryItem, 'id'>;
	products: EntityTable<Product, 'id'>;
	photos: EntityTable<Photo, 'id'>;
	trips: EntityTable<Trip, 'id'>;
	purchases: EntityTable<Purchase, 'id'>;
	menu: EntityTable<MenuItem, 'id'>;
	sessions: EntityTable<CookSession, 'id'>;
	pantryLog: EntityTable<PantryChange, 'id'>;
	shopping: EntityTable<ShoppingItem, 'id'>;
	meta: EntityTable<Meta, 'key'>;
};
