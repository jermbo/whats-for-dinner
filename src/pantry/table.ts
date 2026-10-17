// Finds and reads the first table of a note. Each row becomes a record, with the column names in
// small letters as its keys.

const DIVIDER = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
// A pipe with a backslash is text, not the edge of a cell.
const TEXT_PIPE = /\\\|/g;
const HOLDER = '\u0000';

const isRow = (line: string | undefined) => line !== undefined && line.trim().startsWith('|');

function cellsOf(line: string): string[] {
	return line
		.trim()
		.replace(TEXT_PIPE, HOLDER)
		.replace(/^\||\|$/g, '')
		.split('|')
		.map((cell) => cell.replaceAll(HOLDER, '|').trim());
}

// The lines of the first table: `start` is the header, and `end` is the first line after the table.
export function findTable(lines: string[]): { start: number; end: number } | null {
	const start = lines.findIndex((line, i) => isRow(line) && DIVIDER.test(lines[i + 1] ?? ''));
	if (start === -1) return null;

	let end = start + 2;
	while (isRow(lines[end])) end++;
	return { start, end };
}

export function readTable(text: string): Record<string, string>[] {
	const lines = text.split(/\r?\n/);
	const table = findTable(lines);
	if (!table) return [];

	const columns = cellsOf(lines[table.start]).map((column) => column.toLowerCase());
	return lines.slice(table.start + 2, table.end).map((line) => {
		const cells = cellsOf(line);
		return Object.fromEntries(columns.map((column, at) => [column, cells[at] ?? '']));
	});
}

// The new table goes where the first table was. A note with no table gets it at the end.
export function replaceTable(text: string, table: string): string {
	const lines = text.split(/\r?\n/);
	const at = findTable(lines);
	if (!at) return `${text.trimEnd()}\n\n${table}\n`.trimStart();
	return [...lines.slice(0, at.start), table, ...lines.slice(at.end)].join('\n');
}

// A markdown table with padded columns. In a table, a pipe is the edge of a cell, so each pipe in
// cell text can get a backslash, as Obsidian writes it.
export function formatMarkdownTable(
	columns: string[],
	rows: string[][],
	escapePipes = false
): string {
	const safe = escapePipes
		? rows.map((row) => row.map((cell) => cell.replaceAll('|', '\\|')))
		: rows;
	const widths = columns.map((column, at) =>
		Math.max(column.length, ...safe.map((row) => row[at]?.length ?? 0))
	);
	const line = (cells: string[]) =>
		`| ${cells.map((cell, at) => cell.padEnd(widths[at])).join(' | ')} |`;

	return [
		line(columns),
		line(widths.map((width) => '-'.repeat(width))),
		...safe.map(line)
	].join('\n');
}
