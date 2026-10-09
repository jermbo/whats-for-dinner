import { db } from '$lib/db/db';
import { getMeta, setMeta } from '$lib/db/meta';

/** The end of the key of each hint. "Show the hints again" finds the hints with it. */
const SEEN = 'HintSeen';

/** @param {string} name The name of the hint, such as 'hand'. */
const keyOf = (name) => `${name}${SEEN}`;

/**
 * True when this device showed a hint already. A hint shows how a screen works, one time.
 * @param {string} name The name of the hint.
 */
export async function hintSeen(name) {
	return Boolean(await getMeta(keyOf(name)));
}

/** @param {string} name The name of the hint. */
export function markHintSeen(name) {
	return setMeta(keyOf(name), true);
}

/** Makes each hint new: it shows one more time. */
export function showHintsAgain() {
	return db.meta.filter((row) => row.key.endsWith(SEEN)).delete();
}
