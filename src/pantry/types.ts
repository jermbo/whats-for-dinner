import type { Amount } from '../recipemd/types';
import type { Kind } from './staple';

// An amount of a food item in one place: one row of the table in its note.
export type Stock = {
	place: string;
	// Null when the text has no number, such as "a full bag".
	amount: Amount | null;
	amountText: string;
	// The date as year-month-day, or null.
	useBy: string | null;
};

// One food of the pantry. Its note has the same name.
export type FoodItem = {
	name: string;
	// Other names that a recipe can use for this food item, such as "pasta" for elbow pasta.
	aliases: string[];
	brands: string[];
	// The most that the pantry had of this food, such as "2 kg". The plugin learns it, and you can
	// change it in the note.
	full: Amount | null;
	// The low line: with less than this amount, the food item is low. Null: the plugin sets the line.
	low: Amount | null;
	// How often you buy this food. Null: the food item is not a staple.
	staple: Kind | null;
	// You told the plugin to never ask about this food in the Shop part.
	neverAsk: boolean;
	// The purchase date: the day of the last put away, as year-month-day, or null.
	bought: string | null;
	stocks: Stock[];
};
