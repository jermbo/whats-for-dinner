// The shopping note of a trip has one task for each item: "- [x] [[Pantry/Lime|Lime]]". A task
// with a mark is an item of the cart. A task with no mark is an extra: an item that is on the list
// because you put it there. A task with no link, such as "- [ ] Batteries", has its text as the
// name of its item.
//
// The note is yours. A change of the cart changes only the lines of the tasks, and each change
// starts from the text of the note, so the other text stays.

// An item as a shopping note names it: by a link, or by text.
export type Item = {
	// The note of the item as the link has it, such as "Pantry/Lime". Null: the item has no link.
	link: string | null;
	name: string;
};

export type TripTask = Item & { inCart: boolean };

const TASK = /^(\s*[-*]\s+\[)([ xX])(\]\s+)(.+)$/;
const LINK = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/;

// The note of the open trip has a fixed name, so that the open list is always in one place.
export const openNotePath = (folder: string) => `${folder}/Next trip.md`;

export function readTrip(text: string): TripTask[] {
	return linesOf(text).flatMap((line) => readTask(line) ?? []);
}

export function readTask(line: string): TripTask | null {
	const match = TASK.exec(line);
	if (!match) return null;

	const [, , mark, , text] = match;
	const item = readItem(text);
	return item && { ...item, inCart: mark !== ' ' };
}

// The item that a text names. Null: the text has no name in it. A row of a receipt names its item
// in the same way.
export function readItem(text: string): Item | null {
	const link = LINK.exec(text);
	const name = (link ? link[2] || nameOf(link[1]) : text).trim();
	return name ? { link: link ? link[1].trim() : null, name } : null;
}

// The link tells which item a task has. A task with no link has only its name.
export const isSameItem = (a: TripTask, b: TripTask) =>
	a.link === b.link && (a.link !== null || a.name === b.name);

// The task of an item that the note does not have yet. The link has the path of the note of the
// item, and the name of that note as its text. Thus two notes with one name do not get mixed.
export function taskOf(path: string): TripTask {
	const link = path.replace(/\.md$/, '');
	return { link, name: nameOf(link), inCart: false };
}

// Each task of the item gets a mark. An item with no task gets one, with a mark.
export function putInCart(text: string, item: TripTask): string {
	const lines = linesOf(text);
	if (!lines.some((line) => isTaskOf(line, item))) return addTask(lines, item, 'x');
	return setMark(lines, item, 'x');
}

// An item that has a task gets no second task.
export function addExtra(text: string, item: TripTask): string {
	const lines = linesOf(text);
	return lines.some((line) => isTaskOf(line, item)) ? text : addTask(lines, item, ' ');
}

export function unmark(text: string, item: TripTask): string {
	return setMark(linesOf(text), item, ' ');
}

export function removeTasks(text: string, items: TripTask[]): string {
	return linesOf(text)
		.filter((line) => !items.some((item) => isTaskOf(line, item)))
		.join('\n');
}

const linesOf = (text: string) => text.split(/\r?\n/);
const nameOf = (link: string) => link.split('/').pop() ?? link;

function isTaskOf(line: string, item: TripTask): boolean {
	const task = readTask(line);
	return task !== null && isSameItem(task, item);
}

// The new task comes after the last task of the note. With no task, it goes at the end.
function addTask(lines: string[], { link, name }: TripTask, mark: string): string {
	const line = `- [${mark}] ${link ? `[[${link}|${name}]]` : name}`;
	const last = lines.findLastIndex((other) => readTask(other) !== null);
	if (last === -1) return `${lines.join('\n').trimEnd()}\n\n${line}\n`.trimStart();

	lines.splice(last + 1, 0, line);
	return lines.join('\n');
}

// Only the mark changes, so the other text of the line stays as you wrote it.
function setMark(lines: string[], item: TripTask, mark: string): string {
	return lines
		.map((line) => (isTaskOf(line, item) ? line.replace(TASK, `$1${mark}$3$4`) : line))
		.join('\n');
}
