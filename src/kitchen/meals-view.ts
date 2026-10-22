import type { PlannedMeal } from '../plan/plan-note';
import type { Meal } from '../plan/types';
import type { RecipeEntry } from '../recipes/types';

// The meals that are in the plan. A task with a mark is a meal that left the plan.
export function mealsOf(plan: PlannedMeal[], recipes: RecipeEntry[]): Meal[] {
	const byPath = new Map(recipes.map((entry) => [entry.path, entry]));
	const entryOf = (path: string | null) => (path ? (byPath.get(path) ?? null) : null);
	return plan
		.filter((meal) => !meal.cooked)
		.map((meal) => ({
			...meal,
			entry: entryOf(meal.path),
			sides: meal.sides.map((side) => ({ ...side, entry: entryOf(side.path) }))
		}));
}
