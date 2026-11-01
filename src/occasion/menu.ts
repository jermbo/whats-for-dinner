// The menu of an occasion as the screen shows it, two ways: one card for each person who brings
// something, and one card for each course. In each card, the dishes keep the sequence of the menu.

import { OPEN, personName, type Dish } from './occasion-note';

// "things" are the jobs that are not food, such as plates. They come after the drinks.
const COURSES = ['starter', 'main', 'side', 'dessert', 'drink', 'things'];
const OTHER = 'other';

export type MenuDish = { dish: Dish; index: number; course: string };
// A person is null for you, OPEN for nobody yet, or the name of a guest.
export type PersonCard = { person: string | null; dishes: MenuDish[] };
export type CourseCard = { course: string; dishes: MenuDish[] };

// A dish with no course gets the type of its recipe. A name with no recipe is "other".
export const courseOf = (dish: Pick<Dish, 'course'>, type: string | null) =>
	(dish.course ?? type ?? OTHER).toLowerCase();

export const personOf = (dish: Dish) => (dish.person === null ? null : personName(dish.person));

// The known courses first, then each word of your own in the sequence of the note, then "other".
function rankOf(courses: string[]) {
	const own = [...new Set(courses.filter((course) => !COURSES.includes(course) && course !== OTHER))];
	return (course: string) => {
		if (COURSES.includes(course)) return COURSES.indexOf(course);
		if (course === OTHER) return COURSES.length + own.length;
		return COURSES.length + own.indexOf(course);
	};
}

// Each dish with its course, in the sequence of the menu. The sort keeps the sequence of the note
// for dishes with the same course.
export function menuDishes(dishes: Dish[], typeOf: (dish: Dish) => string | null): MenuDish[] {
	const all = dishes.map((dish, index) => ({ dish, index, course: courseOf(dish, typeOf(dish)) }));
	const rank = rankOf(all.map((one) => one.course));
	return [...all].sort((a, b) => rank(a.course) - rank(b.course));
}

// "You" first, then each guest with a job in the sequence of the guest list, then the open jobs.
// "You" and the open jobs are there also with no dish, so that a dish has a place to start.
export function personCards(menu: MenuDish[], guests: string[]): PersonCard[] {
	const of = (person: string | null) => menu.filter((one) => personOf(one.dish) === person);
	const withJob = guests.filter((guest) => guest !== OPEN && of(guest).length);
	return [null, ...withJob, OPEN].map((person) => ({ person, dishes: of(person) }));
}

// Each known course, also with no dish, as an empty slot. Then each course of your own.
export function courseCards(menu: MenuDish[]): CourseCard[] {
	const rank = rankOf(menu.map((one) => one.course));
	const courses = [...new Set([...COURSES, ...menu.map((one) => one.course)])].sort(
		(a, b) => rank(a) - rank(b)
	);
	return courses.map((course) => ({ course, dishes: menu.filter((one) => one.course === course) }));
}

// The courses that a dish can get with one tap: the known ones, and each one of this occasion.
export function courseOptions(courses: string[]): string[] {
	const own = courses.filter((course) => !COURSES.includes(course));
	return [...new Set([...COURSES, ...own])];
}
