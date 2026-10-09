import { prefersReducedMotion } from 'svelte/motion';

/** True when the owner asked for less motion in this app. The device has its own setting. */
let asked = $state(false);

/**
 * Less motion: a card or a page changes with no movement, and the screen shows only the result.
 * It is true when the device asks for it, or when the owner asked for it in this app.
 */
export const lessMotion = {
	get current() {
		return asked || prefersReducedMotion.current;
	}
};

/**
 * Sets the wish of the owner for less motion in this app. The styles read it from the root
 * element: see base.css.
 * @param {boolean} value
 */
export function askForLessMotion(value) {
	asked = value;
	document.documentElement.toggleAttribute('data-less-motion', value);
}
