import type { RecipeMatch } from '../match/match';
import type { PlannedMeal } from '../plan/plan-note';
import type { Recipe } from '../recipemd/types';
import type { Settings } from '../settings';
import type { Stock } from '../pantry/types';

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
export type Saved = { skipped: string[]; settings: Settings };

export type Disk = {
	load: () => Promise<Partial<Saved> | null>;
	save: (data: Saved) => Promise<void>;
};
