// The receipt of a trip is a note of the shopping folder with a table: one row for each item of
// the cart. It starts when the stage Put away opens, so that each fact is in the vault at once and
// a different device continues the work. It is complete when each item is in the pantry. Your own
// text stays.

import { findTable } from '../pantry/table';
import { amountOf, type Facts } from './facts';
import { showPrice } from './price';
import { readReceipt, type ReceiptRow } from './read-receipt';
import { readTask, type Item } from './shopping-note';

// One row of an active receipt: the item, its facts, and if it is in the pantry.
export type ReceiptLine = Item & { facts: Facts; done: boolean };

const COLUMNS = ['Item', 'Amount', 'Price', 'Sale', 'Place', 'Use by'];
// Only an active receipt has this column. A complete receipt is done in each row.
const DONE = 'Done';

// The receipt has the name of the day on which put away starts. A second receipt of one day gets a
// number: "2026-10-18 2".
export function receiptPath(folder: string, day: string, isTaken: (path: string) => boolean) {
	let path = `${folder}/${day}.md`;
	for (let count = 2; isTaken(path); count++) path = `${folder}/${day} ${count}.md`;
	return path;
}

// The facts of a row, as the stage Put away reads them. An item that does not go into the pantry
// has no amount.
export function lineOf(row: ReceiptRow): ReceiptLine {
	const { link, name, amount, price, onSale, place, useBy, done } = row;
	return {
		link,
		name,
		done,
		facts: { intoPantry: amount !== '', amount, place, useBy, price, onSale }
	};
}

// The rows of the table of a receipt note, with the facts that the stage reads.
export const linesIn = (text: string): ReceiptLine[] =>
	readReceipt('', {}, text)?.rows.map(lineOf) ?? [];

// The text of a receipt that starts: active, with the day, the store, and a row for each item. A
// store in quotes is safe in the properties, also with a colon in it.
export function newReceipt(day: string, store: string, lines: ReceiptLine[]): string {
	const properties = [
		'status: active',
		`date: ${day}`,
		...(store ? [`store: ${JSON.stringify(store)}`] : [])
	];
	return `---\n${properties.join('\n')}\n---\n\n${withLines('', lines)}`;
}

// The table of an active receipt with these lines. A price stays as you typed it, so that the field
// does not change under your thumb.
export function withLines(text: string, lines: ReceiptLine[]): string {
	return withTable(text, showTable([...COLUMNS, DONE], lines.map(cellsOf)));
}

// The complete receipt: each price with 2 decimals, no column "Done", and your own text of the trip
// above the table.
export function completeReceipt(text: string, lines: ReceiptLine[], ownText: string): string {
	const rows = lines.map((line) => {
		const cells = cellsOf(line).slice(0, COLUMNS.length);
		cells[COLUMNS.indexOf('Price')] = showPrice(line.facts.price);
		return cells;
	});
	const table = showTable(COLUMNS, rows);
	return withTable(text, ownText ? `${ownText}\n\n${table}` : table);
}

// Your own text of the note of the trip: each line that is not a task, with no empty lines at the
// start and the end.
export const ownTextOf = (body: string) =>
	linesOf(body)
		.filter((line) => readTask(line) === null)
		.join('\n')
		.trim();

// The text of the note of the next trip: each task with no mark, as you wrote it. You did not buy
// that item, and the request still stands. No text: the trip leaves no task.
export function leftOf(text: string): string {
	const left = linesOf(text).filter((line) => readTask(line)?.inCart === false);
	return left.length ? `${left.join('\n')}\n` : '';
}

const linesOf = (text: string) => text.split(/\r?\n/);

// The new table goes where the table was. A note with no table gets it at the end.
function withTable(text: string, table: string): string {
	const lines = linesOf(text);
	const at = findTable(lines);
	if (!at) return `${text.trimEnd()}\n\n${table}\n`.trimStart();
	return [...lines.slice(0, at.start), table, ...lines.slice(at.end)].join('\n');
}

function cellsOf({ link, name, facts, done }: ReceiptLine): string[] {
	const pantry = facts.intoPantry;
	return [
		showItem(link, name),
		pantry ? amountOf(facts) : '',
		facts.price.trim(),
		facts.onSale ? 'yes' : '',
		pantry ? facts.place.trim() : '',
		pantry ? facts.useBy : '',
		done ? 'yes' : ''
	];
}

const showItem = (link: string | null, name: string) => (link ? `[[${link}|${name}]]` : name);

// In a table, a pipe is the edge of a cell. So the pipe of a link gets a backslash, as Obsidian
// writes it, and a pipe that you typed gets one too.
function showTable(columns: string[], rows: string[][]): string {
	const safe = rows.map((row) => row.map((cell) => cell.replaceAll('|', '\\|')));
	const widths = columns.map((column, at) =>
		Math.max(column.length, ...safe.map((row) => row[at].length))
	);
	const line = (cells: string[]) =>
		`| ${cells.map((cell, at) => cell.padEnd(widths[at])).join(' | ')} |`;

	return [line(columns), line(widths.map((width) => '-'.repeat(width))), ...safe.map(line)].join(
		'\n'
	);
}
