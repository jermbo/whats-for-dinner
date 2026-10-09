// The motions of the cards in the hand of the Today screen. Each function gets the element
// of a card and moves it. The component of the hand tells when.
import { gsap } from './gsap';
import { pose } from './pile';

/** The time of a card that flies out of the hand, in seconds. */
const THROW_S = 0.35;
/** The time between two cards that drop back on the pile after a shuffle, in seconds. */
export const DROP_GAP_S = 0.06;

/**
 * Puts a card at its place in the pile with no motion.
 * @param {HTMLElement} node
 * @param {number} at The place in the pile. Place 0 is the top.
 */
export function placeCard(node, at) {
	gsap.set(node, pose(at));
}

/**
 * The hint: the top card goes to the side and comes back, and its turn button turns. This
 * shows that you can throw the card and turn it.
 * @param {HTMLElement} node
 */
export function hintCard(node) {
	const timeline = gsap
		.timeline()
		.to(node, { x: -64, rotation: -5, duration: 0.4, ease: 'power2.out' })
		.to(node, { ...pose(0), duration: 0.8, ease: 'elastic.out(1, 0.55)' });
	const turn = node.querySelector('.meal-card__turn');
	if (turn) {
		timeline.to(
			turn,
			{ rotation: 360, duration: 0.7, ease: 'back.out(1.6)', clearProps: 'transform' },
			'-=0.4'
		);
	}
	return timeline;
}

/**
 * Deals a new card into the hand: it comes up from below. The bottom card comes first.
 * @param {HTMLElement} node
 * @param {number} at
 * @param {number} count The number of cards in the pile.
 * @param {{ onComplete: () => void, onInterrupt: () => void }} ends
 *   A shuffle or a finger can stop the deal: then "onInterrupt" is called.
 */
export function dealCard(node, at, count, { onComplete, onInterrupt }) {
	return gsap.fromTo(
		node,
		{ y: 220, rotation: at % 2 ? 10 : -10, opacity: 0 },
		{
			...pose(at),
			duration: 0.7,
			delay: 0.15 + (count - 1 - at) * 0.08,
			ease: 'back.out(1.2)',
			onComplete,
			onInterrupt
		}
	);
}

/**
 * Moves a card to the pose of its place.
 * @param {HTMLElement} node
 * @param {number} at
 * @param {number} [delay] In seconds.
 */
export function settleCard(node, at, delay = 0) {
	return gsap.to(node, {
		...pose(at),
		duration: 0.5,
		delay,
		ease: 'back.out(1.4)',
		overwrite: 'auto'
	});
}

/**
 * The top card flies out of the hand.
 * @param {HTMLElement} node
 * @param {{ x: number, y: number }} direction
 */
export function throwOut(node, direction) {
	const distance = Math.max(innerWidth, innerHeight);
	return gsap.to(node, {
		x: `+=${direction.x * distance}`,
		y: `+=${direction.y * distance}`,
		rotation: `+=${direction.x * 30}`,
		duration: THROW_S,
		ease: 'power1.in',
		overwrite: 'auto'
	});
}

/**
 * The top card comes back to its place after a drag that was not a throw.
 * @param {HTMLElement} node
 */
export function springBack(node) {
	return gsap.to(node, {
		...pose(0),
		duration: 0.7,
		ease: 'elastic.out(1, 0.55)',
		overwrite: 'auto'
	});
}

/**
 * The cards split to the left and to the right, for a shuffle.
 * @param {(HTMLElement | undefined)[]} nodes The cards from the top of the pile down.
 */
export function splitPile(nodes) {
	const timeline = gsap.timeline();
	nodes.forEach((node, at) => {
		if (!node) return;
		const side = at % 2 === 0 ? -1 : 1;
		timeline.to(
			node,
			{
				x: side * node.offsetWidth * 0.55,
				y: -12 - at * 3,
				rotation: side * (8 + at),
				scale: 0.9,
				opacity: 1,
				duration: 0.32,
				ease: 'power2.out',
				overwrite: 'auto'
			},
			at * 0.03
		);
	});
	return timeline;
}
