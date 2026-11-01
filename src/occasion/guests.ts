// The guests of an occasion: who comes, how many, and what each one brings.

import { OPEN, personName, type Dish, type Guest } from './occasion-note';

export type GuestRow = { name: string; size: number };

// The guest list of the note, then each person of a dish with no line, at the size 1. A person
// can be a link in one place and plain text in the other, so the name is the key.
export function guestsOf({ dishes, guests }: { dishes: Dish[]; guests: Guest[] }): GuestRow[] {
	const listed = guests.map((guest) => ({ name: personName(guest.name), size: guest.size }));
	const names = new Set(listed.map((guest) => guest.name));
	const extra = [
		...new Set(dishes.flatMap((dish) => (dish.person === null ? [] : [personName(dish.person)])))
	].filter((name) => name !== OPEN && !names.has(name));
	return [...listed.filter((guest) => guest.name !== OPEN), ...extra.map((name) => ({ name, size: 1 }))];
}

// You, and the size of each party.
export const comingOf = (occasion: { dishes: Dish[]; guests: Guest[] }) =>
	1 + guestsOf(occasion).reduce((sum, guest) => sum + guest.size, 0);

export const openJobsOf = ({ dishes }: { dishes: Dish[] }) =>
	dishes.filter((dish) => dish.person !== null && personName(dish.person) === OPEN).length;

// The names of the jobs of a person: null for you.
export const jobsOf = ({ dishes }: { dishes: Dish[] }, person: string | null) =>
	dishes
		.filter((dish) => (dish.person === null ? null : personName(dish.person)) === person)
		.map((dish) => dish.name);
