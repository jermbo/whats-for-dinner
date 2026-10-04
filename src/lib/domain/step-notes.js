/**
 * @typedef {import('$lib/types').CookSession} CookSession
 * @typedef {import('$lib/types').StepNote} StepNote
 */

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
