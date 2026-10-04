import { flushSync } from 'svelte';
import { prefersReducedMotion } from 'svelte/motion';
import { Draggable, gsap } from '$lib/motion/gsap';

/** The time of each move of a row, in seconds. */
const MOVE_S = 0.22;

/**
 * @typedef {{
 *   count: () => number,
 *   onsort: (from: number, to: number) => void,
 *   handle?: string
 * }} DragSortOptions
 *   count: how many rows can move. The rows after that count stay where they are, such as the
 *   empty row for the next step.
 *   onsort: the owner dropped the row at a new place. It must change the data, and the list
 *   shows the new order.
 *   handle: the selector of the part of the row that you hold. The rest of the row stays a
 *   normal place: a finger there scrolls the list.
 */

/**
 * The time of a move. A person who asks for reduced motion sees only the result.
 * @param {number} seconds
 */
const time = (seconds) => (prefersReducedMotion.current ? 0 : seconds);

/** True while a drop changes the order of the list. See "isDropping". */
let dropping = false;

/**
 * True while a drop changes the order of the list. A list that animates its own moves
 * (the "animate" directive of Svelte) must not animate this change: the row is at its place.
 */
export const isDropping = () => dropping;

/**
 * An attachment that lets you drag a row of a list up and down to a new place. You hold the
 * handle. The other rows move away to make room, so the eye sees where the row will land. When
 * you let go, the row settles in its place and "onsort" gets the new order.
 *
 * The row can be taller than the others. The place of the row is found from the middle of the
 * dragged row, and the places of the rows are read when the drag starts, so the list can also
 * scroll while it moves: the list scrolls by itself near its edges.
 * Use it for each row of a list whose parent is the scroll box of the list.
 * @param {DragSortOptions} options
 * @returns {(node: HTMLElement) => () => void}
 */
export function dragSort({ count, onsort, handle = '[data-handle]' }) {
	return (node) => {
		const trigger = node.querySelector(handle);
		const list = node.parentElement;
		if (!trigger || !list) return () => {};

		/** The rows that can move, and their places when the drag starts. */
		let rows = /** @type {HTMLElement[]} */ ([]);
		let tops = /** @type {number[]} */ ([]);
		let heights = /** @type {number[]} */ ([]);
		let from = 0;
		/** The place of the dragged row among the rows now. */
		let target = 0;

		/** The place that the middle of the dragged row is at. */
		function placeOf(/** @type {number} */ y) {
			const middle = tops[from] + y + heights[from] / 2;
			let place = 0;
			rows.forEach((_, row) => {
				if (row !== from && tops[row] + heights[row] / 2 < middle) place += 1;
			});
			return place;
		}

		/** Moves the other rows away from the place of the dragged row. */
		function open() {
			rows.forEach((row, at) => {
				if (at === from) return;
				// The rows without the dragged row: a row before the dragged row keeps its number.
				const other = at < from ? at : at - 1;
				let shift = 0;
				if (at < from && other >= target) shift = heights[from];
				if (at > from && other < target) shift = -heights[from];
				gsap.to(row, { y: shift, duration: time(MOVE_S), ease: 'power2.out', overwrite: 'auto' });
			});
		}

		/** The distance from the first row to the place where the dragged row will be. */
		function slot() {
			let top = tops[0];
			let other = 0;
			rows.forEach((_, at) => {
				if (at === from) return;
				if (other < target) top += heights[at];
				other += 1;
			});
			return top - tops[from];
		}

		const [draggable] = Draggable.create(node, {
			type: 'y',
			trigger,
			minimumMovement: 4,
			zIndexBoost: false,
			autoScroll: 1,
			// The handle is a label: it must start a drag, and a tap on it must still be a tap.
			dragClickables: true,
			onPress() {
				gsap.killTweensOf(node);
			},
			onDragStart() {
				const all = /** @type {HTMLElement[]} */ ([...list.children]);
				rows = all.slice(0, count());
				from = rows.indexOf(node);
				if (from < 0) return;
				tops = rows.map((row) => row.offsetTop);
				heights = rows.map((row) => row.offsetHeight);
				target = from;

				// The row cannot leave the list.
				const last = rows.length - 1;
				draggable.applyBounds({
					minY: tops[0] - tops[from],
					maxY: tops[last] + heights[last] - heights[from] - tops[from],
					minX: 0,
					maxX: 0
				});

				node.classList.add('is-dragging');
				gsap.to(node, { scale: 1.02, duration: time(0.15), ease: 'power2.out' });
			},
			onDrag() {
				if (from < 0) return;
				const place = placeOf(draggable.y);
				if (place === target) return;
				target = place;
				open();
				navigator.vibrate?.(5);
			},
			onDragEnd() {
				if (from < 0) return;
				const to = target;
				const moved = to !== from;

				gsap.to(node, {
					y: moved ? slot() : 0,
					scale: 1,
					duration: time(MOVE_S),
					ease: 'power2.out',
					overwrite: 'auto',
					onComplete() {
						node.classList.remove('is-dragging');
						// The rows are at the places of the new order. The data changes now, and
						// the list shows the same picture with no transform.
						dropping = true;
						gsap.set(rows, { clearProps: 'transform' });
						if (moved) flushSync(() => onsort(from, to));
						dropping = false;
						draggable.update();
					}
				});
			}
		});

		return () => {
			draggable.kill();
			gsap.killTweensOf(node);
		};
	};
}
