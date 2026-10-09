import { newId, now } from '$lib/util/ids';
import { changeSession } from './cooking';

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
