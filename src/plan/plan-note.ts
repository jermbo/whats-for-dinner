// The plan of the week is a note with one task for each meal:
// "- [ ] [[Recipes/Tacos|Tacos]] · 2026-10-11 · prep done". A task that is done is a meal that you
// cooked. A meal has no fixed day: the date is the day for which you selected the meal, and it has
// no effect after that day.
//
// The note is yours. A change of the plan changes only the lines of the meals, and each change
// starts from the text of the note, so the other text stays.

export type PlannedMeal = {
	path: string;
	cooked: boolean;
	// The day for which you selected the meal, as year-month-day, or null.
	day: string | null;
	// You confirmed the preparation of the recipe.
	prepDone: boolean;
};

const MEAL = /^\s*[-*]\s+\[([ xX])\]\s+(\[\[([^\]|#]+)[^\]]*\]\])(.*)$/;
const DAY = /\b\d{4}-\d{2}-\d{2}\b/;
const PREP_DONE = /\bprep done\b/i;

// The link stays as you wrote it, so a change of a meal does not change its name in the note.
type MealLine = { meal: PlannedMeal; link: string };

function readLine(line: string): MealLine | null {
	const match = MEAL.exec(line);
	if (!match) return null;

	const [, mark, link, target, facts] = match;
	const path = target.trim();
	return {
		link,
		meal: {
			path: path.endsWith('.md') ? path : `${path}.md`,
			cooked: mark !== ' ',
			day: DAY.exec(facts)?.[0] ?? null,
			prepDone: PREP_DONE.test(facts)
		}
	};
}

function showLine({ cooked, day, prepDone }: PlannedMeal, link: string): string {
	const task = `- [${cooked ? 'x' : ' '}] ${link}`;
	return [task, day, prepDone ? 'prep done' : null].filter(Boolean).join(' · ');
}

const linesOf = (text: string) => text.split(/\r?\n/);
const isMeal = (line: string) => readLine(line) !== null;
const isMealOf = (line: string, path: string) => readLine(line)?.meal.path === path;

export function readPlan(text: string): PlannedMeal[] {
	return linesOf(text).flatMap((line) => readLine(line)?.meal ?? []);
}

// A recipe is in the plan one time. A line that the recipe has already, such as a meal that you
// cooked, goes out, and the new meal comes after the last meal of the note.
export function addMeal(text: string, path: string, title: string): string {
	const meal = { path, cooked: false, day: null, prepDone: false };
	const line = showLine(meal, `[[${path.replace(/\.md$/, '')}|${title}]]`);

	const lines = linesOf(text).filter((other) => !isMealOf(other, path));
	const last = lines.findLastIndex(isMeal);
	if (last === -1) return `${lines.join('\n').trimEnd()}\n\n${line}\n`.trimStart();

	lines.splice(last + 1, 0, line);
	return lines.join('\n');
}

export function changeMeal(text: string, path: string, change: Partial<PlannedMeal>): string {
	const changed = linesOf(text).map((line) => {
		const found = readLine(line);
		return found?.meal.path === path ? showLine({ ...found.meal, ...change }, found.link) : line;
	});
	return changed.join('\n');
}

export function removeMeal(text: string, path: string): string {
	return linesOf(text)
		.filter((line) => !isMealOf(line, path))
		.join('\n');
}

export function removeMeals(text: string): string {
	return linesOf(text)
		.filter((line) => !isMeal(line))
		.join('\n');
}
