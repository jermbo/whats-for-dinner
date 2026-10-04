import { newId } from '$lib/util/ids';
import { changeSession } from './cooking';

/**
 * Starts the timer of one time in one step. The session stores the time when the timer must
 * end. A browser stops the code of a page that is not in view, so a counter would stop also.
 * An end time does not stop.
 * @param {string} sessionId
 * @param {{ stepId: string, index: number, seconds: number }} time
 */
export function startTimer(sessionId, { stepId, index, seconds }) {
	const endsAt = new Date(Date.now() + seconds * 1000).toISOString();
	return changeSession(sessionId, (session) => ({
		timers: [
			...session.timers.filter((timer) => timer.stepId !== stepId || timer.index !== index),
			{ id: newId(), stepId, index, seconds, endsAt }
		]
	}));
}

/**
 * Stops a timer that runs, or removes a timer that is done.
 * @param {string} sessionId
 * @param {string} timerId
 */
export function stopTimer(sessionId, timerId) {
	return changeSession(sessionId, (session) => ({
		timers: session.timers.filter((timer) => timer.id !== timerId)
	}));
}
