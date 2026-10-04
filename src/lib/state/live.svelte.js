import { liveQuery } from 'dexie';

/**
 * A database query whose result updates when the data changes.
 * Call it during component setup.
 * @template T
 * @param {() => Promise<T>} query
 * @param {T} initial
 * @returns {{ readonly current: T }}
 */
export function live(query, initial) {
	// Raw state: records stay plain objects, so Dexie can store them again.
	let current = $state.raw(initial);

	$effect(() => {
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
