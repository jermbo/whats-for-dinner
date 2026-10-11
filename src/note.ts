import type { FoodItem } from './pantry/types';
import type { RecipeResult } from './recipemd/types';

// A note of the vault, with the result of the RecipeMD rules.
export type Note = { path: string; result: RecipeResult };

// A note of the pantry folder, with its food item.
export type FoodNote = { path: string; item: FoodItem };
