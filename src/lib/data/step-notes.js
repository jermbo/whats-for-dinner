import { newId, now } from '$lib/db/ids';
import { changeSession } from './cooking';

/**
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').StepNote} StepNote
 */

/**
 * Adds a note to a step. The note belongs to the cook session, so it is also a part of the
 * history of that cook.
 * @param {string} sessionId
 * @param {string} stepId
 * @param {string} text
 */
export function addStepNote(sessionId, stepId, text) {
	const clean = text.trim();
	if (!clean) return Promise.resolve();
	return changeSession(sessionId, (session) => ({
		stepNotes: [...session.stepNotes, { id: newId(), stepId, text: clean, at: now() }]
	}));
}

/**
 * Changes the text of a note. A note with no text goes away.
 * @param {string} sessionId The session that has the note.
 * @param {string} noteId
 * @param {string} text
 */
export function saveStepNote(sessionId, noteId, text) {
	const clean = text.trim();
	return changeSession(sessionId, (session) => ({
		stepNotes: clean
			? session.stepNotes.map((note) => (note.id === noteId ? { ...note, text: clean } : note))
			: session.stepNotes.filter((note) => note.id !== noteId)
	}));
}

/**
 * The notes of each step of a recipe, from all its cook sessions, newest first.
 * A note names its step by the ID, so it stays with the step when the step moves.
 * @param {CookSession[]} sessions The cook sessions of one recipe.
 * @returns {Map<string, { note: StepNote, sessionId: string }[]>} The step ID and its notes.
 */
export function notesByStep(sessions) {
	const all = sessions
		.flatMap((session) => session.stepNotes.map((note) => ({ note, sessionId: session.id })))
		.sort((a, b) => b.note.at.localeCompare(a.note.at));

	/** @type {Map<string, { note: StepNote, sessionId: string }[]>} */
	const byStep = new Map();
	for (const entry of all) {
		byStep.set(entry.note.stepId, [...(byStep.get(entry.note.stepId) ?? []), entry]);
	}
	return byStep;
}
