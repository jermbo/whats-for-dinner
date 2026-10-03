import { flip } from 'svelte/animate';
import { backOut, cubicOut } from 'svelte/easing';
import { prefersReducedMotion } from 'svelte/motion';
import { fly, scale, slide } from 'svelte/transition';

/**
 * The transitions for elements that come into the page, go out of it, or change place.
 * Each one has no duration for a person who asks for reduced motion.
 */

/** @param {number} duration */
const ms = (duration) => (prefersReducedMotion.current ? 0 : duration);

/**
 * A row that opens when it comes in and closes when it goes out.
 * @param {Element} node
 */
export function collapse(node) {
	return slide(node, { duration: ms(280), easing: cubicOut });
}

/**
 * A value or a mark that pops when it changes.
 * @param {Element} node
 */
export function pop(node) {
	return scale(node, { start: 0.7, duration: ms(320), easing: backOut });
}

/**
 * A card that comes in from below.
 * @param {Element} node
 * @param {{ delay?: number }} [options]
 */
export function rise(node, { delay = 0 } = {}) {
	return fly(node, { y: 14, duration: ms(360), delay: ms(delay), easing: cubicOut });
}

/**
 * A card of Cook mode. The new card comes in from the side where the owner goes, and the
 * old card goes out at the other side. "direction" is 1 for the next card and -1 for back.
 * @param {Element} node
 * @param {{ direction?: number, leave?: boolean }} [options]
 */
export function turnPage(node, { direction = 1, leave = false } = {}) {
	return fly(node, {
		x: (leave ? -1 : 1) * direction * 48,
		duration: ms(leave ? 140 : 280),
		easing: cubicOut
	});
}

/**
 * An element of a keyed list that moves to its new place when the order changes.
 * @param {Element} node
 * @param {{ from: DOMRect, to: DOMRect }} rects
 */
export function reorder(node, rects) {
	return flip(node, rects, { duration: ms(450), easing: cubicOut });
}
