// The plan of the week is a note with one task for each meal:
// "- [ ] [[Recipes/Tacos|Tacos]] · 2026-10-11 · prep done". A task that is done is a meal that you
// cooked. A meal has no fixed day: the date is the day for which you selected the meal, and it has
// no effect after that day.

export type PlannedMeal = {
	path: string;
	cooked: boolean;
	// The day for which you selected the meal, as year-month-day, or null.
	day: string | null;
	// You confirmed the preparation of the recipe.
	prepDone: boolean;
};

const MEAL = /^\s*[-*]\s+\[([ xX])\]\s+\[\[([^\]|#]+)[^\]]*\]\](.*)$/;
const DAY = /\b\d{4}-\d{2}-\d{2}\b/;
const PREP_DONE = /\bprep done\b/i;

export const newMeal = (path: string): PlannedMeal => ({
	path,
	cooked: false,
	day: null,
	prepDone: false
});

export function readPlan(text: string): PlannedMeal[] {
	return text.split(/\r?\n/).flatMap((line) => {
		const match = MEAL.exec(line);
		if (!match) return [];
		const [, mark, link, facts] = match;
		const target = link.trim();
		return [
			{
				path: target.endsWith('.md') ? target : `${target}.md`,
				cooked: mark !== ' ',
				day: DAY.exec(facts)?.[0] ?? null,
				prepDone: PREP_DONE.test(facts)
			}
		];
	});
}

export function showPlan(meals: (PlannedMeal & { title: string })[]): string {
	const lines = meals.map(({ path, cooked, day, prepDone, title }) => {
		const target = path.replace(/\.md$/, '');
		const task = `- [${cooked ? 'x' : ' '}] [[${target}|${title}]]`;
		return [task, day, prepDone ? 'prep done' : null].filter(Boolean).join(' · ');
	});
	return `${lines.join('\n')}\n`;
}
