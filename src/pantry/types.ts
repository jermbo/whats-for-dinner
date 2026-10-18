import type { Amount } from '../recipemd/types';
import type { Brand } from './brands';
import type { Kind } from './staple';

// One package of a food item: one row of the table in its note. A loose food item has one row for
// each place.
export type Stock = {
	place: string;
	// What is left. Null when the text has no number, such as "a full bag". An empty row has the
	// factor 0 and the unit of its size, so that it compares with the other rows.
	amount: Amount | null;
	amountText: string;
	// The package size. The plugin fills it in, so it is null only when the amount has no number.
	size: Amount | null;
	sizeText: string;
	// The date as year-month-day, or null.
	useBy: string | null;
};

// One food of the pantry. Its note has the same name.
export type FoodItem = {
	name: string;
	// Other names that a recipe can use for this food item, such as "pasta" for elbow pasta.
	aliases: string[];
	// From the section "Brands" of the note, in its order.
	brands: Brand[];
	// The most that the pantry had of this food, such as "2 kg". The plugin learns it, and you can
	// change it in the note.
	full: Amount | null;
	// The low line: with less than this amount, the food item is low. Null: the plugin sets the line.
	low: Amount | null;
	// How often you buy this food. Null: the food item is not a staple.
	staple: Kind | null;
	// You told the plugin to never ask about this food in the Shop part.
	neverAsk: boolean;
	// The food item has no packages, such as apples: new food goes into the row of its place.
	loose: boolean;
	// The purchase date: the day of the last put away, as year-month-day, or null.
	bought: string | null;
	stocks: Stock[];
};
