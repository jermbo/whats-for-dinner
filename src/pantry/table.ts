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
