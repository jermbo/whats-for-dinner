import type { RecipeEntry } from '../recipes/types';
import type { PlannedMeal } from './plan-note';

// A meal of the plan. The entry is null when the note of the recipe is gone.
export type Meal = PlannedMeal & { entry: RecipeEntry | null };
