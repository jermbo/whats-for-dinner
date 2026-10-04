import { backOut, cubicOut } from 'svelte/easing';
import { fly, scale, slide } from 'svelte/transition';
import { lessMotion } from './less-motion.svelte';

/**
 * The transitions for elements that come into the page, go out of it, or change place.
 * Each one has no duration for a person who asks for reduced motion.
 */

/** @param {number} duration */
const ms = (duration) => (lessMotion.current ? 0 : duration);

/**
 * A row that opens when it comes in and closes when it goes out.
 * @param {Element} node
 */
export function collapse(node) {
	return slide(node, { duration: ms(280), easing: cubicOut });
}

/**
 * A row that goes out of a list: it shrinks to nothing and fades. The height comes from the row
 * as it is laid out now, so the row cannot get stuck at a wrong height.
 * @param {HTMLElement} node
 */
export function shrink(node) {
	const style = getComputedStyle(node);
	const height = node.offsetHeight;
	const top = parseFloat(style.paddingTop) || 0;
	const bottom = parseFloat(style.paddingBottom) || 0;
	return {
		duration: ms(240),
		easing: cubicOut,
		css: (/** @type {number} */ t) =>
			`overflow: hidden; opacity: ${t}; height: ${t * height}px; padding-block: ${t * top}px ${t * bottom}px;`
	};
}

/**
 * A row that comes into a list: it fades in and rises a little. It does not change its height,
 * so the rows around it do not stretch.
 * @param {Element} node
 */
export function appear(node) {
	return fly(node, { y: 8, duration: ms(220), easing: cubicOut });
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
 * It only moves the element: it does not scale it. The "flip" of Svelte also scales the element
 * by the ratio of two sizes, and a size of zero makes a transform that is not valid (NaN or
 * Infinity). Then the browser drops the animation, and the element can stay out of view.
 * @param {Element} node
 * @param {{ from: DOMRect, to: DOMRect }} rects
 * @returns {import('svelte/animate').AnimationConfig}
 */
export function reorder(node, { from, to }) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	if (!Number.isFinite(dx) || !Number.isFinite(dy) || (dx === 0 && dy === 0)) {
		return { duration: 0 };
	}
	return {
		duration: ms(380),
		easing: cubicOut,
		css: (_, u) => `transform: translate(${u * dx}px, ${u * dy}px);`
	};
}
