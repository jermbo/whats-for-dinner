import type { RecipeMatch } from '../match/match';
import type { Recipe } from '../recipemd/types';

export type RecipeEntry = {
	path: string;
	recipe: Recipe;
	rating: number | null;
	match: RecipeMatch;
	// What you must do before you can cook the recipe, or null.
	prep: string | null;
	// The link of the photo of the newest meal with a photo, or null. The card shows it.
	photo: string | null;
};
