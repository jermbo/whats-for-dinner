// Reads the first table of a note. Each row becomes a record, with the column names in small
// letters as its keys.

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

export function readTable(text: string): Record<string, string>[] {
	const lines = text.split(/\r?\n/);
	const start = lines.findIndex((line, i) => isRow(line) && DIVIDER.test(lines[i + 1] ?? ''));
	if (start === -1) return [];

	const columns = cellsOf(lines[start]).map((column) => column.toLowerCase());
	const rows: Record<string, string>[] = [];
	for (let i = start + 2; isRow(lines[i]); i++) {
		const cells = cellsOf(lines[i]);
		rows.push(Object.fromEntries(columns.map((column, at) => [column, cells[at] ?? ''])));
	}
	return rows;
}
