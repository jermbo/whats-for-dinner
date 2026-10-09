import { db } from '$lib/db/db';
import { PLANNING, planningRows, preferencesOf, validValue } from '$lib/domain/preferences';

/**
 * @typedef {import('$lib/domain/preferences').Preferences} Preferences
 * @typedef {import('$lib/domain/preferences').PreferenceKey} PreferenceKey
 * @typedef {import('$lib/types').Preference} Preference
 */

/** The preferences that the owner changed. A preference with its default has no row. */
export function changedPreferences() {
	return db.preferences.toArray();
}

/** The value of each preference now, for a function of the data layer that needs one. */
export async function readPreferences() {
	return preferencesOf(await changedPreferences());
}

/**
 * @template {PreferenceKey} K
 * @param {K} key
 * @param {Preferences[K]} value
 */
export function setPreference(key, value) {
	return db.preferences.put({ key, value: validValue(key, value) });
}

/**
 * Gives a preference its default again. The row goes away, so a new default of a later
 * version of the app applies to it.
 * @param {PreferenceKey} key
 */
export function resetPreference(key) {
	return db.preferences.delete(key);
}

/** The rows that a full backup has: the planning preferences. */
export async function planningPreferences() {
	return planningRows(await changedPreferences());
}

/**
 * Replaces the planning preferences with those of a full backup. The preferences of this
 * device stay. Call it in a transaction.
 * @param {Preference[]} rows
 */
export async function replacePlanningPreferences(rows) {
	await db.preferences.bulkDelete(PLANNING);
	await db.preferences.bulkPut(planningRows(rows));
}
