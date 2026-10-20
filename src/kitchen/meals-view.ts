import type { PlannedMeal } from '../plan/plan-note';
import type { Meal } from '../plan/types';
import type { RecipeEntry } from '../recipes/types';

export function mealsOf(plan: PlannedMeal[], recipes: RecipeEntry[]): Meal[] {
	const byPath = new Map(recipes.map((entry) => [entry.path, entry]));
	return plan.map((meal) => ({ ...meal, entry: byPath.get(meal.path) ?? null }));
}
