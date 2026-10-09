/**
 * @template T
 * @typedef {{
 *   readonly current: T | null,
 *   keep: (value: T | null) => void,
 *   take: () => T | null
 * }} Undo
 *   current: the thing that "Undo" can bring back, or null. keep: stores it for a few seconds.
 *   take: gives it and forgets it.
 */

/**
 * Keeps the last thing that the owner removed for a few seconds, so that "Undo" can bring it
 * back.
 * Call it during component setup.
 * @param {number} [ms] The time that "Undo" stays, in milliseconds.
 * @returns {Undo<any>}
 */
export function useUndo(ms = 8000) {
	let kept = $state.raw(null);
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	return {
		get current() {
			return kept;
		},
		keep(value) {
			clearTimeout(timer);
			kept = value;
			if (value !== null) timer = setTimeout(() => (kept = null), ms);
		},
		take() {
			clearTimeout(timer);
			const value = kept;
			kept = null;
			return value;
		}
	};
}
