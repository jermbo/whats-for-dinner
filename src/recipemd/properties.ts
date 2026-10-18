// Obsidian keeps the properties of a note in a block at the top, between two lines of "---".
// The RecipeMD specification has no such block. The plugin permits it, and reads the recipe below it.

const EDGE = /^---[ \t]*$/;

export function withoutProperties(lines: string[]): string[] {
	return splitProperties(lines).body;
}

// The property block, with its two lines of "---", and the lines below it. "Convert" and "Edit"
// write the block again as it was.
export function splitProperties(lines: string[]): { properties: string[]; body: string[] } {
	if (!EDGE.test(lines[0] ?? '')) return { properties: [], body: lines };
	const end = lines.findIndex((line, i) => i > 0 && EDGE.test(line));
	if (end === -1) return { properties: [], body: lines };
	return { properties: lines.slice(0, end + 1), body: lines.slice(end + 1) };
}
