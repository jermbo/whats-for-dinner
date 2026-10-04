/**
 * @template {Record<string, any>} T
 * @template {keyof T} K
 * @param {T[]} list
 * @param {K} key
 * @returns {Map<T[K], T>}
 */
export function indexBy(list, key) {
	return new Map(list.map((item) => [item[key], item]));
}

/**
 * @template T
 * @param {T[]} list
 * @param {(item: T) => string} key
 * @returns {Map<string, T[]>} The groups, in the sequence of their first item.
 */
export function groupBy(list, key) {
	/** @type {Map<string, T[]>} */
	const groups = new Map();
	for (const item of list) {
		const name = key(item);
		groups.set(name, [...(groups.get(name) ?? []), item]);
	}
	return groups;
}

/**
 * @template {{ name: string }} T
 * @param {T[]} list
 */
export function sortByName(list) {
	return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * A copy of a list in a random order.
 * @template T
 * @param {T[]} list
 * @returns {T[]}
 */
export function shuffled(list) {
	const copy = [...list];
	for (let index = copy.length - 1; index > 0; index -= 1) {
		const other = Math.floor(Math.random() * (index + 1));
		[copy[index], copy[other]] = [copy[other], copy[index]];
	}
	return copy;
}
