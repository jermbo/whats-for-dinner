import { liveQuery } from 'dexie';

/**
 * A database query whose result updates when the data changes.
 * Call it during component setup.
 * @template T
 * @param {() => Promise<T>} query
 * @param {T} initial
 * @param {() => unknown} [key] A function that reads the value that the query uses, such as
 *   the ID of a page. When the value changes, the query starts again.
 * @returns {{ readonly current: T }}
 */
export function live(query, initial, key) {
	// Raw state: records stay plain objects, so Dexie can store them again.
	let current = $state.raw(initial);

	$effect(() => {
		// The result of the old value must not show for the new value.
		if (key) {
			key();
			current = initial;
		}
		const subscription = liveQuery(query).subscribe({
			next: (value) => (current = value),
			error: (error) => console.error(error)
		});
		return () => subscription.unsubscribe();
	});

	return {
		get current() {
			return current;
		}
	};
}
