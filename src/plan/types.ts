import type { RecipeEntry } from '../recipes/types';
import type { PlannedMeal, PlannedSide } from './plan-note';

// A side of a meal. The entry is null for a side with only a name, or when its recipe note is gone.
export type Side = PlannedSide & { entry: RecipeEntry | null };

// A meal of the plan. The entry is null when the note of the recipe is gone.
export type Meal = Omit<PlannedMeal, 'sides'> & { entry: RecipeEntry | null; sides: Side[] };
