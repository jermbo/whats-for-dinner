import { untrack } from 'svelte';
import { lessMotion } from './less-motion.svelte';

/** The farthest that a row moves, in pixels. A row from farther away comes from this distance. */
const REACH = 72;
/** A new row or title rises from this distance. */
const RISE = 14;
const DURATION = 420;
/** The delay between two rows, so that the list settles from the top to the bottom. */
const STAGGER = 16;
/** The same curve as --ease-out in tokens.css. */
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

/**
 * A list that gets a new sequence, such as the pantry from "Place" to "Low first". Each row
 * moves to its new place from the side where it was, so the eye sees one list that sorts itself
 * and not a new list. A row from far away moves a short distance only, and fades in.
 *
 * The rows have a `data-regroup` attribute with a key. The framework can make a new element
 * for a row: the key tells which old place is its place.
 * @param {() => HTMLElement | undefined} container The element that has the rows.
 * @param {() => unknown} sequence The value that gives the list its sequence.
 */
export function useRegroup(container, sequence) {
	/**
	 * The top of each row before the change, by key. Null: there is no change to show.
	 * It is not state: a write to it must not start an effect.
	 * @type {Record<string, number> | null}
	 */
	let tops = null;

	/** @param {HTMLElement} node */
	const rowsOf = (node) =>
		/** @type {NodeListOf<HTMLElement>} */ (node.querySelectorAll('[data-regroup]'));

	// Before the page changes: where is each row?
	$effect.pre(() => {
		sequence();
		tops = null;
		const node = untrack(container);
		if (!node || lessMotion.current) return;

		tops = {};
		for (const row of rowsOf(node)) {
			tops[row.dataset.regroup ?? ''] = row.getBoundingClientRect().top;
		}
	});

	// After the page changed: each row in view moves from its old place to its new place.
	$effect(() => {
		sequence();
		const node = untrack(container);
		if (!node || !tops) return;

		let index = 0;
		for (const row of rowsOf(node)) {
			const { top, bottom } = row.getBoundingClientRect();
			// A wide screen has columns, so a row below the screen can come before a row in view.
			if (bottom < 0 || top > innerHeight) continue;

			const from = tops[row.dataset.regroup ?? ''];
			const distance = from === undefined ? RISE : from - top;
			if (distance === 0) continue;

			const near = from !== undefined && Math.abs(distance) <= REACH;
			const y = Math.max(-REACH, Math.min(REACH, distance));
			row.animate(
				[
					{ translate: `0 ${y}px`, opacity: near ? 1 : 0 },
					{ translate: '0 0', opacity: 1 }
				],
				{ duration: DURATION, delay: index * STAGGER, easing: EASE, fill: 'backwards' }
			);
			index += 1;
		}
		tops = null;
	});
}
