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
 * @returns {[string, T[]][]}
 */
export function groupBy(list, key) {
	/** @type {Map<string, T[]>} */
	const groups = new Map();
	for (const item of list) {
		const name = key(item);
		groups.set(name, [...(groups.get(name) ?? []), item]);
	}
	return [...groups];
}

/**
 * @template {{ name: string }} T
 * @param {T[]} list
 */
export function sortByName(list) {
	return [...list].sort((a, b) => a.name.localeCompare(b.name));
}
