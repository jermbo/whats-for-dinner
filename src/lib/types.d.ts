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

/** A scanned product and the ingredient that it is. */
export interface Product {
	barcode: string;
	name: string;
	ingredientId: string;
	/** Package size in the unit of the ingredient. */
	quantity: number;
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
	products: EntityTable<Product, 'barcode'>;
	menu: EntityTable<MenuItem, 'id'>;
	sessions: EntityTable<CookSession, 'id'>;
	pantryLog: EntityTable<PantryChange, 'id'>;
	shopping: EntityTable<ShoppingItem, 'id'>;
	meta: EntityTable<Meta, 'key'>;
};
