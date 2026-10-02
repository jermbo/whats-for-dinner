import { db } from './db';

/** @param {string} key */
export async function getMeta(key) {
	return (await db.meta.get(key))?.value;
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function setMeta(key, value) {
	return db.meta.put({ key, value });
}
