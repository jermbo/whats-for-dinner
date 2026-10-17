import type { PlannedMeal } from '../plan/plan-note';
import { addMeal, changeMeal, removeMeal, removeMeals } from '../plan/plan-note';
import { hasRoom, ROOM } from '../plan/week';
import { typeOf } from '../recipes/browse';
import type { Meal, RecipeEntry } from './types';

export type PlanActionsHost = {
	plan: PlannedMeal[];
	meals: Meal[];
	recipes: RecipeEntry[];
	today: string;
	notify(text: string): void;
	writePlan(change: (text: string) => string): Promise<void>;
};

export function isPlanned(host: PlanActionsHost, path: string) {
	return host.plan.some((meal) => meal.path === path && !meal.cooked);
}

export function isToday(host: PlanActionsHost, meal: PlannedMeal) {
	return !meal.cooked && meal.day === host.today;
}

export async function addToPlan(host: PlanActionsHost, path: string) {
	const entry = host.recipes.find((recipe) => recipe.path === path);
	const type = entry ? typeOf(entry) : 'other';
	const open = host.meals.filter((meal) => !meal.cooked && meal.path !== path);
	if (!hasRoom(open, type)) {
		host.notify(`The week has ${ROOM} meals of the type "${type}". Cook or remove one first.`);
		return;
	}
	const title = entry?.recipe.title ?? path.replace(/\.md$/, '');
	await host.writePlan((text) => addMeal(text, path, title));
}

export async function setToday(host: PlanActionsHost, path: string, on: boolean) {
	const day = on ? host.today : null;
	await host.writePlan((text) => changeMeal(text, path, { day }));
}

export async function setPrepDone(host: PlanActionsHost, path: string, prepDone: boolean) {
	await host.writePlan((text) => changeMeal(text, path, { prepDone }));
}

export async function removeFromPlan(host: PlanActionsHost, path: string) {
	await host.writePlan((text) => removeMeal(text, path));
}

export async function clearPlan(host: PlanActionsHost) {
	await host.writePlan(removeMeals);
}

export async function markCooked(host: PlanActionsHost, path: string) {
	await host.writePlan((text) => changeMeal(text, path, { cooked: true }));
}
