import type { Amount } from '../recipemd/types';
import type { Brand } from './brands';
import type { Kind } from './staple';

// One package of a food item: one row of the table in its note.
export type Stock = {
	place: string;
	// The amount behind what is left: the level times the size, or the count. Null when the text
	// has no number, such as "tap". An empty package has the factor 0 and the unit of its size, so
	// that it compares with the other rows.
	amount: Amount | null;
	amountText: string;
	// The text of the column `Left`: a level, such as "1/4", a count, such as "4", or a text such as
	// "tap". "0" is an empty package.
	left: string;
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
	// How often you buy this food. Null: the food item is not a staple.
	staple: Kind | null;
	// You told the plugin to never ask about this food in the Shop part.
	neverAsk: boolean;
	// A meal could not take this food out, so the weekly audit shows it first.
	check: boolean;
	// The size of the next package that you buy, such as "64 fl oz". Null: the size of the newest
	// package.
	size: Amount | null;
	// The purchase date: the day of the last put away, as year-month-day, or null.
	bought: string | null;
	stocks: Stock[];
};
