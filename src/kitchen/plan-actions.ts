import { showName } from '../match/names';
import type { PlannedMeal, PlannedSide } from '../plan/plan-note';
import { addMeal, addSide, changeMeal, flagMeal, removeMeal, removeSide } from '../plan/plan-note';
import type { Meal } from '../plan/types';
import type { RecipeEntry } from '../recipes/types';
import { tried } from './tried';

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

function isTonight(host: PlanActionsHost, meal: Pick<PlannedMeal, 'cooked' | 'day'>) {
	return !meal.cooked && meal.day === host.today;
}

async function addToPlan(host: PlanActionsHost, path: string) {
	const entry = host.recipes.find((recipe) => recipe.path === path);
	const title = showName(entry?.recipe.title ?? path.replace(/\.md$/, ''));
	await host.writePlan((text) => addMeal(text, path, title));
}

// The flag for tonight is the date of today. A meal with no date is an option again.
async function setTonight(host: PlanActionsHost, path: string, on: boolean) {
	await host.writePlan((text) =>
		on ? flagMeal(text, path, host.today) : changeMeal(text, path, { day: null })
	);
}

async function setPrepDone(host: PlanActionsHost, path: string, prepDone: boolean) {
	await host.writePlan((text) => changeMeal(text, path, { prepDone }));
}

async function removeFromPlan(host: PlanActionsHost, path: string) {
	await host.writePlan((text) => removeMeal(text, path));
}

async function addSideTo(host: PlanActionsHost, path: string, side: PlannedSide) {
	await host.writePlan((text) => addSide(text, path, side));
}

async function removeSideOf(host: PlanActionsHost, path: string, index: number) {
	await host.writePlan((text) => removeSide(text, path, index));
}

// A cooked meal leaves the plan with its sides. Its record is in the recipe note.
export async function markCooked(host: PlanActionsHost, path: string) {
	await host.writePlan((text) => removeMeal(text, path));
}

// What a screen can do with the plan. Each write tells you in a notice when it fails.
export function planActions(host: PlanActionsHost) {
	return {
		isPlanned: (path: string) => isPlanned(host, path),
		isTonight: (meal: Pick<PlannedMeal, 'cooked' | 'day'>) => isTonight(host, meal),
		addToPlan: (path: string) => tried('The plan did not change', () => addToPlan(host, path)),
		setTonight: (path: string, on: boolean) =>
			tried('The plan did not change', () => setTonight(host, path, on)),
		setPrepDone: (path: string, prepDone: boolean) =>
			tried('The plan did not change', () => setPrepDone(host, path, prepDone)),
		removeFromPlan: (path: string) =>
			tried('The plan did not change', () => removeFromPlan(host, path)),
		addSide: (path: string, side: PlannedSide) =>
			tried('The plan did not change', () => addSideTo(host, path, side)),
		removeSide: (path: string, index: number) =>
			tried('The plan did not change', () => removeSideOf(host, path, index))
	};
}
