// Obsidian keeps the properties of a note in a block at the top, between two lines of "---".
// The RecipeMD specification has no such block. The plugin permits it, and reads the recipe below it.

const EDGE = /^---[ \t]*$/;

export function withoutProperties(lines: string[]): string[] {
	if (!EDGE.test(lines[0] ?? '')) return lines;
	const end = lines.findIndex((line, i) => i > 0 && EDGE.test(line));
	return end === -1 ? lines : lines.slice(end + 1);
}
