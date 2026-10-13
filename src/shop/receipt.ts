// The receipt of a trip is its shopping note after put away: a table in the place of the tasks,
// with one row for each item of the cart. Thus the vault has one note for each trip to the store.
// Your own text stays.

import { isSameItem, readTask, type TripTask } from './shopping-note';

// What put away did with one item of the cart. An item that is not in the pantry has no amount
// and no place.
export type Purchase = { item: TripTask; amount: string; place: string };

// The plugin leaves "Price", "Sale", and "Use by" empty. You can type a value into them.
const COLUMNS = ['Item', 'Amount', 'Price', 'Sale', 'Place', 'Use by'];

// The receipt has the name of the day of put away. A second receipt of one day gets a number:
// "2026-10-18 2".
export function receiptPath(folder: string, day: string, isTaken: (path: string) => boolean) {
	let path = `${folder}/${day}.md`;
	for (let count = 2; isTaken(path); count++) path = `${folder}/${day} ${count}.md`;
	return path;
}

// Each task with a mark becomes a row of the table, and the table is where the first task was.
// A task with no mark goes out: `leftOf` has it, for the note of the next trip.
export function receiptOf(text: string, purchases: Purchase[]): string {
	const lines = linesOf(text);
	const first = lines.findIndex((line) => readTask(line) !== null);
	if (first === -1) return text;

	const rows = cartTasks(lines).map((task) => {
		const purchase = purchases.find(({ item }) => isSameItem(item, task));
		return [showItem(task), purchase?.amount ?? '', '', '', purchase?.place ?? '', ''];
	});
	const ownText = (some: string[]) => some.filter((line) => readTask(line) === null);
	return [...ownText(lines.slice(0, first)), showTable(rows), ...ownText(lines.slice(first))].join(
		'\n'
	);
}

// The text of the note of the next trip: each task with no mark, as you wrote it. You did not buy
// that item, and the request still stands. No text: the trip leaves no task.
export function leftOf(text: string): string {
	const left = linesOf(text).filter((line) => readTask(line)?.inCart === false);
	return left.length ? `${left.join('\n')}\n` : '';
}

const linesOf = (text: string) => text.split(/\r?\n/);

// One task for each item of the cart, in the sequence of the note.
function cartTasks(lines: string[]): TripTask[] {
	const tasks = lines.flatMap((line) => readTask(line) ?? []).filter((task) => task.inCart);
	return tasks.filter((task, at) => tasks.findIndex((other) => isSameItem(other, task)) === at);
}

// In a table, a pipe is the edge of a cell. So the pipe of a link gets a backslash, as Obsidian
// writes it.
const showItem = ({ link, name }: TripTask) =>
	(link ? `[[${link}|${name}]]` : name).replaceAll('|', '\\|');

function showTable(rows: string[][]): string {
	const widths = COLUMNS.map((column, at) =>
		Math.max(column.length, ...rows.map((row) => row[at].length))
	);
	const line = (cells: string[]) =>
		`| ${cells.map((cell, at) => cell.padEnd(widths[at])).join(' | ')} |`;

	return [line(COLUMNS), line(widths.map((width) => '-'.repeat(width))), ...rows.map(line)].join(
		'\n'
	);
}
