import type { FoodItem } from './pantry/types';
import type { RecipeResult } from './recipemd/types';

// A note of the vault, with the result of the RecipeMD rules. The rating is a property of the note.
export type Note = { path: string; result: RecipeResult; rating: number | null };

// A note of the pantry folder, with its food item.
export type FoodNote = { path: string; item: FoodItem };
