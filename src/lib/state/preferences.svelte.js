import { getContext, setContext } from 'svelte';
import { changedPreferences } from '$lib/data/preferences';
import { preferencesOf } from '$lib/domain/preferences';
import { live } from './live.svelte';

/** @typedef {ReturnType<typeof makePreferences>} PreferencesState */

const KEY = Symbol('preferences');

/** The value of each preference: the rows that the owner changed, and the defaults. */
function makePreferences() {
	/** Not defined until the database gives the rows. */
	const rows = live(
		changedPreferences,
		/** @type {import('$lib/types').Preference[] | undefined} */ (undefined)
	);
	const values = $derived(preferencesOf(rows.current ?? []));

	return {
		/** False until the database gives the rows. */
		get ready() {
			return rows.current !== undefined;
		},
		/** The value of each preference. It has the defaults until the database gives the rows. */
		get values() {
			return values;
		}
	};
}

/**
 * Makes the preferences of the app. The root layout calls it one time, as it does for the
 * kitchen. See docs/settings/how-a-preference-works.md.
 */
export function providePreferences() {
	return setContext(KEY, makePreferences());
}

/**
 * The preferences of the app. A screen gives a value to the rule that uses it.
 * Call it during component setup.
 * @returns {PreferencesState}
 */
export function usePreferences() {
	return getContext(KEY);
}
