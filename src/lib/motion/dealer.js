// The motions of the card of the dealer on the Menu screen. Each function gets the element of
// the card and moves it. The component of the dealer tells when.
import { gsap } from './gsap';

/** The card in its place. */
const REST = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

/**
 * Puts the card in its place with no motion.
 * @param {HTMLElement} node
 */
export function placeIdea(node) {
	gsap.set(node, REST);
}

/**
 * A new card comes in from below.
 * @param {HTMLElement} node
 */
export function dealIdea(node) {
	return gsap.fromTo(
		node,
		{ x: 0, y: 40, rotation: 0, scale: 0.94, opacity: 0 },
		{ ...REST, duration: 0.45, ease: 'back.out(1.4)', overwrite: true }
	);
}

/**
 * "Not this": the card goes out to the left.
 * @param {HTMLElement} node
 */
export function skipIdea(node) {
	return leave(node, { x: -innerWidth, rotation: -18, duration: 0.25 });
}

/**
 * "Keep": the card goes up to the menu. After a swipe, it goes up from the right.
 * @param {HTMLElement} node
 * @param {boolean} swiped
 */
export function keepIdea(node, swiped) {
	return leave(node, {
		x: swiped ? innerWidth * 0.5 : 0,
		y: -280,
		rotation: swiped ? 12 : 0,
		scale: 0.4,
		duration: 0.35
	});
}

/**
 * A swipe that was too short: the card comes back to its place.
 * @param {HTMLElement} node
 */
export function settleIdea(node) {
	return gsap.to(node, { ...REST, duration: 0.6, ease: 'elastic.out(1, 0.6)', overwrite: true });
}

/**
 * @param {HTMLElement} node
 * @param {gsap.TweenVars} to
 */
function leave(node, to) {
	return gsap.to(node, { ...to, opacity: 0, ease: 'power1.in', overwrite: true });
}
