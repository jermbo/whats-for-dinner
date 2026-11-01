import { notePathIn } from '../note-path';
import {
	addDish,
	addGuest,
	addTask,
	changeDish,
	newOccasionText,
	removeDish,
	removeGuest,
	setDishReady,
	setGuestSize,
	setTaskDone,
	type DishChange,
	type NewDish
} from '../occasion/occasion-note';
import type { Occasion } from '../occasion/occasions';
import { tried, triedFor } from './tried';

export type OccasionActionsHost = {
	occasions: Occasion[];
	where: { occasions: string };
	readNote(path: string): Promise<string>;
	createNote(path: string, text: string): Promise<void>;
	makeFolderOf(path: string): Promise<void>;
	writeOccasion(path: string, change: (text: string) => string): Promise<void>;
	// Moves the note to the trash, as Obsidian does when you delete a note.
	trash(path: string): Promise<void>;
};

// The path of the new note, or null when the note is not there. A copy starts from the text of a
// past occasion.
async function start(host: OccasionActionsHost, name: string, date: string, from: string | null) {
	const path = notePathIn(host.where.occasions, name);
	const past = from ? await host.readNote(from) : undefined;
	await host.makeFolderOf(path);
	await host.createNote(path, newOccasionText(date, past));
	return path;
}

// The dish at its place in the note. Each change starts from the text of the note at that moment.
const change = (host: OccasionActionsHost, path: string, edit: (text: string) => string) =>
	tried('The occasion did not change', () => host.writeOccasion(path, edit));

// A dish of the occasion that you finished in Cook Mode is ready.
export const markDishReady = (host: OccasionActionsHost, path: string, index: number) =>
	host.writeOccasion(path, (text) => setDishReady(text, index, true));

// What a screen can do with an occasion. Each write tells you in a notice when it fails.
export function occasionActions(host: OccasionActionsHost) {
	return {
		start: (name: string, date: string, from: string | null) =>
			triedFor('The occasion is not saved', () => start(host, name.trim(), date, from), null),
		addDish: (path: string, dish: NewDish) => change(host, path, (text) => addDish(text, dish)),
		removeDish: (path: string, index: number) => change(host, path, (text) => removeDish(text, index)),
		changeDish: (path: string, index: number, dishChange: DishChange) =>
			change(host, path, (text) => changeDish(text, index, dishChange)),
		setReady: (path: string, index: number, ready: boolean) =>
			change(host, path, (text) => setDishReady(text, index, ready)),
		setTaskDone: (path: string, index: number, done: boolean) =>
			change(host, path, (text) => setTaskDone(text, index, done)),
		addTask: (path: string, task: string) => change(host, path, (text) => addTask(text, task)),
		addGuest: (path: string, name: string) => change(host, path, (text) => addGuest(text, name)),
		setGuestSize: (path: string, name: string, size: number) =>
			change(host, path, (text) => setGuestSize(text, name, size)),
		removeGuest: (path: string, name: string) => change(host, path, (text) => removeGuest(text, name)),
		remove: (path: string) => tried('The occasion is not deleted', () => host.trash(path))
	};
}
