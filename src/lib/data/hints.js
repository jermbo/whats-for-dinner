import { getMeta, setMeta } from '$lib/db/meta';

/**
 * True when this device showed a hint already. A hint shows how a screen works, one time.
 * @param {string} key The name of the hint.
 */
export async function hintSeen(key) {
	return Boolean(await getMeta(key));
}

/** @param {string} key The name of the hint. */
export function markHintSeen(key) {
	return setMeta(key, true);
}
