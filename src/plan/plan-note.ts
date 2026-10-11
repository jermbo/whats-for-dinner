// The plan of the week is a note with one task for each meal: "- [ ] [[Recipes/Chicken curry|Chicken curry]]".
// A task that is done is a meal that you cooked. A meal has no day.

export type PlannedMeal = { path: string; cooked: boolean };

const MEAL = /^\s*[-*]\s+\[([ xX])\]\s+\[\[([^\]|#]+)[^\]]*\]\]/;

export function readPlan(text: string): PlannedMeal[] {
	return text.split(/\r?\n/).flatMap((line) => {
		const match = MEAL.exec(line);
		if (!match) return [];
		const target = match[2].trim();
		return [{ path: target.endsWith('.md') ? target : `${target}.md`, cooked: match[1] !== ' ' }];
	});
}

export function showPlan(meals: (PlannedMeal & { title: string })[]): string {
	const lines = meals.map(({ path, cooked, title }) => {
		const target = path.replace(/\.md$/, '');
		return `- [${cooked ? 'x' : ' '}] [[${target}|${title}]]`;
	});
	return `${lines.join('\n')}\n`;
}
