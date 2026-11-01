// An occasion is a note with one task line for each dish, the guests below the heading "Guests",
// and the tasks of the day below the heading "To do":
//
//   - [ ] [[Recipes/Roast turkey|Roast turkey]] · main · prep done
//   - [ ] Pumpkin pie · dessert · Mum
//   - [ ] Plates · things · ?
//
//   ## Guests
//
//   - Mum ×2
//
//   ## To do
//
//   - [ ] Borrow chairs · 2026-11-24
//
// The fields of a dish come after " · ". The scale and "prep done" have a fixed form. Of the other
// words, the first is the course and the second is the person, so "Rolls · Sam" has the course
// "Sam". The person "?" is nobody yet. The note is yours: a change starts from its text and changes
// only the task lines and the guest lines.

export type Dish = {
	// The recipe note, or null for a dish with only a name, such as "Pumpkin pie".
	path: string | null;
	name: string;
	course: string | null;
	scale: number;
	// The person as the note has it: "Mum", or a link such as "[[Mum]]". Null: your dish.
	person: string | null;
	// You cooked the dish, or it came.
	ready: boolean;
	prepDone: boolean;
};

export type OccasionTask = { text: string; day: string | null; done: boolean };

// A guest as the note has it: "Mum", or a link such as "[[Mum]]", and the size of the party.
export type Guest = { name: string; size: number };

// The person of a job that nobody brings yet.
export const OPEN = '?';

export type DishChange = Partial<Pick<Dish, 'course' | 'scale' | 'person' | 'prepDone'>>;

const TASK = /^(\s*[-*]\s+\[)([ xX])(\]\s+)(.+)$/;
const TO_DO = /^#{1,6}\s+to do\s*$/i;
const GUESTS = /^#{1,6}\s+guests\s*$/i;
const HEADING = /^#{1,6}\s/;
const GUEST = /^\s*[-*]\s+(?!\[[ xX]\])(.+?)(?:\s+×\s*(\d+))?\s*$/;
const LINK = /^\[\[([^\]|#]+)[^\]|]*(?:\|([^\]]+))?\]\]$/;
const SCALE = /^×\s*(\d+(?:[.,]\d+)?)$/;
const PREP_DONE = /^prep done$/i;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const FIELDS = /\s+·\s+/;

const withMd = (path: string) => (path.endsWith('.md') ? path : `${path}.md`);
const linesOf = (text: string) => text.split(/\r?\n/);

// The name of a person: "[[People/Mum|Mum]]" and "[[Mum]]" are "Mum".
export function personName(person: string): string {
	const link = LINK.exec(person.trim());
	if (!link) return person.trim();
	return (link[2] ?? link[1].split('/').pop() ?? link[1]).trim();
}

// The first part of a dish line stays as you wrote it, so a change does not change its name.
type DishLine = { dish: Dish; head: string };

function readDish(line: string): DishLine | null {
	const task = TASK.exec(line);
	if (!task) return null;
	const [head, ...fields] = task[4].trim().split(FIELDS);
	const link = LINK.exec(head);
	const target = link?.[1].trim();
	const dish: Dish = {
		path: target ? withMd(target) : null,
		name: target ? (link?.[2] ?? target.split('/').pop() ?? target).trim() : head,
		course: null,
		scale: 1,
		person: null,
		ready: task[2] !== ' ',
		prepDone: false
	};
	const words: string[] = [];
	for (const field of fields.map((one) => one.trim()).filter(Boolean)) {
		const scale = SCALE.exec(field);
		if (scale) dish.scale = Number(scale[1].replace(',', '.'));
		else if (PREP_DONE.test(field)) dish.prepDone = true;
		else words.push(field);
	}
	dish.course = words[0] ?? null;
	dish.person = words[1] ?? null;
	return { dish, head };
}

function readTask(line: string): OccasionTask | null {
	const task = TASK.exec(line);
	if (!task) return null;
	const [text, ...fields] = task[4].trim().split(FIELDS);
	const day = fields.map((field) => field.trim()).find((field) => DAY.test(field)) ?? null;
	return { text: text.trim(), day, done: task[2] !== ' ' };
}

const showScale = (scale: number) => `×${String(scale)}`;

function showDish({ ready, course, scale, person, prepDone }: Dish, head: string): string {
	const fields = [course, scale === 1 ? null : showScale(scale), person, prepDone ? 'prep done' : null];
	return [`- [${ready ? 'x' : ' '}] ${head}`, ...fields.filter(Boolean)].join(' · ');
}

function readGuest(line: string): Guest | null {
	const guest = GUEST.exec(line);
	return guest ? { name: guest[1].trim(), size: guest[2] ? Math.max(1, Number(guest[2])) : 1 } : null;
}

const showGuest = ({ name, size }: Guest) => `- ${name}${size > 1 ? ` ×${size}` : ''}`;

// What each line of the note is. The properties at the top are not lines of the note. A heading
// starts a part of the note: "Guests", "To do", or a heading of your own, where a task is a dish.
type Role =
	| { is: 'dish'; line: DishLine }
	| { is: 'task'; task: OccasionTask }
	| { is: 'guest'; guest: Guest }
	| { is: 'to do' }
	| { is: 'guests' }
	| null;

function rolesOf(lines: string[]): Role[] {
	let inProperties = lines[0] === '---';
	let under: 'dishes' | 'guests' | 'to do' = 'dishes';
	return lines.map((line, at): Role => {
		if (inProperties) {
			if (at > 0 && line === '---') inProperties = false;
			return null;
		}
		if (HEADING.test(line)) {
			under = TO_DO.test(line) ? 'to do' : GUESTS.test(line) ? 'guests' : 'dishes';
			return under === 'dishes' ? null : { is: under };
		}
		if (under === 'to do') {
			const task = readTask(line);
			return task ? { is: 'task', task } : null;
		}
		if (under === 'guests') {
			const guest = readGuest(line);
			return guest ? { is: 'guest', guest } : null;
		}
		const dish = readDish(line);
		return dish ? { is: 'dish', line: dish } : null;
	});
}

export function readOccasion(text: string): { dishes: Dish[]; tasks: OccasionTask[]; guests: Guest[] } {
	const roles = rolesOf(linesOf(text));
	return {
		dishes: roles.flatMap((role) => (role?.is === 'dish' ? [role.line.dish] : [])),
		tasks: roles.flatMap((role) => (role?.is === 'task' ? [role.task] : [])),
		guests: roles.flatMap((role) => (role?.is === 'guest' ? [role.guest] : []))
	};
}

// The index of the line of a dish or of a task, by its place among the dishes or the tasks.
function lineAt(roles: Role[], is: 'dish' | 'task', index: number): number {
	let count = -1;
	return roles.findIndex((role) => role?.is === is && ++count === index);
}

function headOf(dish: Pick<Dish, 'path' | 'name'>): string {
	return dish.path ? `[[${dish.path.replace(/\.md$/, '')}|${dish.name}]]` : dish.name;
}

// A line goes after the last line of its kind. With none, it goes above the first heading that the
// test finds, with an empty line, or at the end of the note.
function insert(text: string, line: string, after: (role: Role) => boolean, above: (role: Role) => boolean) {
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	const last = roles.findLastIndex(after);
	if (last !== -1) {
		lines.splice(last + 1, 0, line);
		return lines.join('\n');
	}
	const heading = roles.findIndex(above);
	if (heading !== -1) {
		lines.splice(heading, 0, line, '');
		return lines.join('\n');
	}
	return `${text.trimEnd()}\n\n${line}\n`.trimStart();
}

export type NewDish = Pick<Dish, 'path' | 'name'> & Partial<Pick<Dish, 'course' | 'person'>>;

// A new dish comes after the last dish. With no dish, it goes above "Guests" or "To do".
export function addDish(text: string, dish: NewDish): string {
	const line = showDish(
		{ course: null, person: null, ...dish, scale: 1, ready: false, prepDone: false },
		headOf(dish)
	);
	return insert(
		text,
		line,
		(role) => role?.is === 'dish',
		(role) => role?.is === 'guests' || role?.is === 'to do'
	);
}

// A new task comes after the last task. With no heading "To do", the heading comes at the end.
export function addTask(text: string, task: string): string {
	const line = `- [ ] ${task.trim()}`;
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	const last = roles.findLastIndex((role) => role?.is === 'task');
	if (last !== -1) {
		lines.splice(last + 1, 0, line);
		return lines.join('\n');
	}
	const head = roles.findIndex((role) => role?.is === 'to do');
	if (head === -1) return `${text.trimEnd()}\n\n## To do\n\n${line}\n`;
	lines.splice(head + 1, 0, '', line);
	return lines.join('\n');
}

const isGuest = (role: Role, name: string): role is { is: 'guest'; guest: Guest } =>
	role?.is === 'guest' && personName(role.guest.name) === name;

// A new guest comes after the last guest. With no guest list, the list comes above "To do".
function writeGuest(text: string, guest: Guest): string {
	const line = showGuest(guest);
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	const last = roles.findLastIndex((role) => role?.is === 'guest');
	if (last !== -1) {
		lines.splice(last + 1, 0, line);
		return lines.join('\n');
	}
	const head = roles.findIndex((role) => role?.is === 'guests');
	if (head !== -1) {
		lines.splice(head + 1, 0, '', line);
		return lines.join('\n');
	}
	const toDo = roles.findIndex((role) => role?.is === 'to do');
	if (toDo !== -1) {
		lines.splice(toDo, 0, '## Guests', '', line, '');
		return lines.join('\n');
	}
	return `${text.trimEnd()}\n\n## Guests\n\n${line}\n`.trimStart();
}

// A name that is a guest already adds nothing.
export function addGuest(text: string, name: string): string {
	const word = name.trim();
	if (!word || rolesOf(linesOf(text)).some((role) => isGuest(role, word))) return text;
	return writeGuest(text, { name: word, size: 1 });
}

// A person of a dish with no line gets a line. The name stays as you wrote it, also a link.
export function setGuestSize(text: string, name: string, size: number): string {
	const lines = linesOf(text);
	const at = rolesOf(lines).findIndex((role) => isGuest(role, name));
	const next = Math.max(1, Math.round(size));
	if (at === -1) return writeGuest(text, { name, size: next });
	const role = rolesOf(lines)[at];
	if (role?.is !== 'guest') return text;
	lines[at] = lines[at].replace(/^(\s*)[-*]\s+.*$/, `$1${showGuest({ ...role.guest, size: next })}`);
	return lines.join('\n');
}

// The guest goes, and each job of the guest is open again.
export function removeGuest(text: string, name: string): string {
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	return lines
		.map((line, at) => {
			const role = roles[at];
			if (role?.is !== 'dish' || role.line.dish.person === null) return line;
			if (personName(role.line.dish.person) !== name) return line;
			return showDish({ ...role.line.dish, person: OPEN }, role.line.head);
		})
		.filter((_, at) => !isGuest(roles[at], name))
		.join('\n');
}

export function removeDish(text: string, index: number): string {
	const lines = linesOf(text);
	const at = lineAt(rolesOf(lines), 'dish', index);
	return at === -1 ? text : lines.filter((_, line) => line !== at).join('\n');
}

// The line of the dish again, with the change. The link and the name stay as you wrote them.
export function changeDish(text: string, index: number, change: DishChange): string {
	const lines = linesOf(text);
	const roles = rolesOf(lines);
	const at = lineAt(roles, 'dish', index);
	const role = roles[at];
	if (role?.is !== 'dish') return text;
	lines[at] = showDish({ ...role.line.dish, ...change }, role.line.head);
	return lines.join('\n');
}

// A mark changes only the box, so the other text of the line stays.
function setMark(text: string, is: 'dish' | 'task', index: number, done: boolean): string {
	const lines = linesOf(text);
	const at = lineAt(rolesOf(lines), is, index);
	if (at === -1) return text;
	lines[at] = lines[at].replace(TASK, (_, start, __, end, rest) => `${start}${done ? 'x' : ' '}${end}${rest}`);
	return lines.join('\n');
}

export const setDishReady = (text: string, index: number, ready: boolean) =>
	setMark(text, 'dish', index, ready);

export const setTaskDone = (text: string, index: number, done: boolean) =>
	setMark(text, 'task', index, done);

// The text of a new occasion note. A copy of a past occasion gets its dishes, its guests, and its
// tasks with no day, each with no mark, because the work of last year is not the work of this year.
export function newOccasionText(date: string, past?: string): string {
	const top = `---\ndate: ${date}\n---\n`;
	if (past === undefined) return top;

	const roles = rolesOf(linesOf(past));
	const dishes = roles.flatMap((role) =>
		role?.is === 'dish'
			? [showDish({ ...role.line.dish, ready: false, prepDone: false }, role.line.head)]
			: []
	);
	const tasks = roles.flatMap((role) =>
		role?.is === 'task' && !role.task.day ? [`- [ ] ${role.task.text}`] : []
	);
	const guests = roles.flatMap((role) => (role?.is === 'guest' ? [showGuest(role.guest)] : []));
	const parts = [top.trimEnd()];
	if (dishes.length) parts.push(dishes.join('\n'));
	if (guests.length) parts.push(`## Guests\n\n${guests.join('\n')}`);
	if (tasks.length) parts.push(`## To do\n\n${tasks.join('\n')}`);
	return `${parts.join('\n\n')}\n`;
}
