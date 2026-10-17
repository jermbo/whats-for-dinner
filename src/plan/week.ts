// The week of the plan: the meals that you did not cook, in one group for each type of meal. The
// week has room for 7 meals of each type, one for each day.

import type { Meal } from '../kitchen/types';
import { typeOf } from '../recipes/browse';

export const ROOM = 7;

// The types that each week has, in the sequence in which you plan them: the dinners come first.
export const MAIN_TYPES = ['dinner', 'breakfast', 'lunch', 'snack'];

// A meal with no recipe note has no tags, so its type is "other".
export const typeOfMeal = (meal: Meal) => (meal.entry ? typeOf(meal.entry) : 'other');

const place = (type: string) =>
	MAIN_TYPES.includes(type) ? MAIN_TYPES.indexOf(type) : MAIN_TYPES.length;

export type WeekGroup = { type: string; meals: Meal[] };

// One group for each type that has a meal. A type that is not a main type comes last, by name.
export function weekGroups(open: Meal[]): WeekGroup[] {
	const types = [...new Set(open.map(typeOfMeal))].sort(
		(a, b) => place(a) - place(b) || a.localeCompare(b)
	);
	return types.map((type) => ({ type, meals: open.filter((meal) => typeOfMeal(meal) === type) }));
}

// The week can take one more meal of this type.
export const hasRoom = (open: Meal[], type: string) =>
	open.filter((meal) => typeOfMeal(meal) === type).length < ROOM;
