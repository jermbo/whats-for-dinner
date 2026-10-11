import type { Amount } from '../recipemd/types';

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
	stocks: Stock[];
};
