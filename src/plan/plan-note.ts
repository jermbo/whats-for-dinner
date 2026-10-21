// The plan of the week is a note with one task for each meal, and one indented line for each side:
//
//   - [ ] [[Recipes/Tacos|Tacos]] · 2026-10-11 · prep done
//   	- [[Recipes/Honey glazed carrots|Honey glazed carrots]]
//   	- Salad
//
// A meal has no fixed day: the date is the day on which you flagged it for tonight, and it has no
// effect on another day. A task with a mark is a meal that left the plan, from a note of before the
// cooked meals left the note.
//
// The note is yours. A change of the plan changes only the lines of the meals and their sides, and
// each change starts from the text of the note, so the other text stays.

// A side is a recipe, or only a name such as "Salad". A side with only a name has no path.
export type PlannedSide = { path: string | null; name: string };

export type PlannedMeal = {
	path: string;
	cooked: boolean;
	// The day that you gave the meal, as year-month-day, or null.
	day: string | null;
	// You confirmed the preparation of the recipe.
	prepDone: boolean;
	sides: PlannedSide[];
};

const MEAL = /^\s*[-*]\s+\[([ xX])\]\s+(\[\[([^\]|#]+)[^\]]*\]\])(.*)$/;
// An indented item that is not a task. A task below a meal is your own text.
const SIDE = /^[ \t]+[-*]\s+(?!\[[ xX]\]\s)(.+)$/;
const LINK = /^\[\[([^\]|#]+)[^\]|]*(?:\|([^\]]+))?\]\]/;
const DAY = /\b\d{4}-\d{2}-\d{2}\b/;
const PREP_DONE = /\bprep done\b/i;

const withMd = (path: string) => (path.endsWith('.md') ? path : `${path}.md`);

// The link stays as you wrote it, so a change of a meal does not change its name in the note.
type MealLine = { meal: PlannedMeal; link: string };

function readMeal(line: string): MealLine | null {
	const match = MEAL.exec(line);
	if (!match) return null;

	const [, mark, link, target, facts] = match;
	return {
		link,
		meal: {
			path: withMd(target.trim()),
			cooked: mark !== ' ',
			day: DAY.exec(facts)?.[0] ?? null,
			prepDone: PREP_DONE.test(facts),
			sides: []
		}
	};
}

function readSide(line: string): PlannedSide | null {
	const text = SIDE.exec(line)?.[1].trim();
	if (!text) return null;
	const link = LINK.exec(text);
	if (!link) return { path: null, name: text };
	const target = link[1].trim();
	return { path: withMd(target), name: (link[2] ?? target.split('/').pop() ?? target).trim() };
}

function showMeal({ cooked, day, prepDone }: PlannedMeal, link: string): string {
	const task = `- [${cooked ? 'x' : ' '}] ${link}`;
	return [task, day, prepDone ? 'prep done' : null].filter(Boolean).join(' · ');
}

const showSide = ({ path, name }: PlannedSide) =>
	`\t- ${path ? `[[${path.replace(/\.md$/, '')}|${name}]]` : name}`;

// What each line of the note is: a meal, a side of the meal above it, or your own text.
type Role = { is: 'meal'; line: MealLine } | { is: 'side'; of: string; side: PlannedSide } | null;

function rolesOf(lines: string[]): Role[] {
	let meal: string | null = null;
	return lines.map((line): Role => {
		const found = readMeal(line);
		if (found) {
			meal = found.meal.path;
			return { is: 'meal', line: found };
		}
		const side = meal ? readSide(line) : null;
		if (side && meal) return { is: 'side', of: meal, side };
		meal = null;
		return null;
	});
}

const linesOf = (text: string) => text.split(/\r?\n/);

export function readPlan(text: string): PlannedMeal[] {
	const meals: PlannedMeal[] = [];
	for (const role of rolesOf(linesOf(text))) {
		if (role?.is === 'meal') meals.push(role.line.meal);
		if (role?.is === 'side') meals.at(-1)?.sides.push(role.side);
	}
	return meals;
}

// The index of the last line of a meal or a side of a meal, or -1.
const lastOf = (roles: Role[], keep: (role: Role) => boolean) => roles.findLastIndex(keep);

const isOf = (role: Role, path: string) =>
	(role?.is === 'meal' && role.line.meal.path === path) || (role?.is === 'side' && role.of === path);

// A recipe is the main dish of one meal. A line that the recipe has already, such as a meal that
// left with a mark, goes out with its sides, and the new meal comes after the last meal of the note.
export function addMeal(text: string, path: string, title: string): string {
	const meal = { path, cooked: false, day: null, prepDone: false, sides: [] };
	const line = showMeal(meal, `[[${path.replace(/\.md$/, '')}|${title}]]`);

	const lines = linesOf(removeMeal(text, path));
	const last = lastOf(rolesOf(lines), (role) => role !== null);
	if (last === -1) return `${lines.join('\n').trimEnd()}\n\n${line}\n`.trimStart();

	lines.splice(last + 1, 0, line);
	return lines.join('\n');
}

export function changeMeal(
	text: string,
	path: string,
	change: Partial<Omit<PlannedMeal, 'sides'>>
): string {
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	return lines
		.map((line, at) => {
			const role = roles[at];
			if (role?.is !== 'meal' || role.line.meal.path !== path) return line;
			return showMeal({ ...role.line.meal, ...change }, role.line.link);
		})
		.join('\n');
}

// One meal has the flag of a day. The meal that had it loses its date, and a date of a different
// day stays as your text.
export function flagMeal(text: string, path: string, day: string): string {
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	return lines
		.map((line, at) => {
			const role = roles[at];
			if (role?.is !== 'meal') return line;
			const { meal, link } = role.line;
			if (meal.path === path) return showMeal({ ...meal, day }, link);
			return meal.day === day ? showMeal({ ...meal, day: null }, link) : line;
		})
		.join('\n');
}

// The meal and its sides go out.
export function removeMeal(text: string, path: string): string {
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	return lines.filter((_, at) => !isOf(roles[at], path)).join('\n');
}

// The new side comes after the last side of its meal.
export function addSide(text: string, path: string, side: PlannedSide): string {
	const lines = linesOf(text);
	const last = lastOf(rolesOf(lines), (role) => isOf(role, path));
	if (last === -1) return text;
	lines.splice(last + 1, 0, showSide(side));
	return lines.join('\n');
}

// The side at this place in the sides of the meal goes out.
export function removeSide(text: string, path: string, index: number): string {
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	const sides = roles.flatMap((role, at) => (role?.is === 'side' && role.of === path ? [at] : []));
	const out = sides[index];
	return out === undefined ? text : lines.filter((_, at) => at !== out).join('\n');
}
