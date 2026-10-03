import { Draggable, InertiaPlugin, gsap } from '$lib/motion/gsap';

/** A swipe is a move of this part of the card width, or a release at this speed (pixels/second). */
const SWIPE_DISTANCE = 0.3;
const SWIPE_SPEED = 600;
/** The card turns this many degrees for each pixel to the side, as a card in the fingers. */
const TURN = 0.04;

/**
 * @typedef {-1 | 0 | 1} Side Left, no side, or right.
 * @typedef {{
 *   onswipe: (node: HTMLElement, side: -1 | 1) => void,
 *   onstay: (node: HTMLElement) => void,
 *   onlean?: (side: Side) => void
 * }} SwipeHandlers
 */

/**
 * An attachment that makes a card a card that you can swipe to the left or to the right.
 * A swipe: "onswipe" gets the side. A small move: "onstay", and the card must go back.
 * "onlean" tells the side while the card is far enough for a swipe, and 0 when it is not.
 * The card moves only sideways, so a finger that moves up or down scrolls the page.
 * A touch on a button is never a drag, so that a tap on a phone stays a tap.
 * A drag can start on a link: a tap on it still opens the link.
 * @param {SwipeHandlers} handlers
 * @returns {(node: HTMLElement) => () => void}
 */
export function swipeCard(handlers) {
	return (node) => {
		InertiaPlugin.track(node, 'x');

		/** @type {Side} */
		let lean = 0;

		/** @param {Side} side */
		function leanTo(side) {
			if (side === lean) return;
			lean = side;
			handlers.onlean?.(side);
		}

		/** True when a release at this place is a swipe. */
		const far = () => Math.abs(draggable.x) > node.offsetWidth * SWIPE_DISTANCE;

		const [draggable] = Draggable.create(node, {
			type: 'x',
			minimumMovement: 6,
			zIndexBoost: false,
			// GSAP uses "clickableTest" only when "dragClickables" is false. Only the controls are
			// "clickable" here, so a link is not: a drag can start on it.
			dragClickables: false,
			clickableTest: (element) =>
				Boolean(element.closest('button, input, select, textarea, label')),
			onPress() {
				// A card that still comes in stops under the finger, in its place.
				gsap.killTweensOf(node);
				gsap.set(node, { y: 0, scale: 1, opacity: 1 });
			},
			onDrag() {
				gsap.set(node, { rotation: draggable.x * TURN });
				leanTo(far() ? (draggable.x < 0 ? -1 : 1) : 0);
			},
			onDragEnd() {
				leanTo(0);
				const speed = InertiaPlugin.getVelocity(node, 'x');
				const fast = Math.abs(speed) > SWIPE_SPEED;
				if (!fast && !far()) {
					handlers.onstay(node);
					return;
				}
				handlers.onswipe(node, (fast ? speed : draggable.x) < 0 ? -1 : 1);
			}
		});

		return () => {
			draggable.kill();
			InertiaPlugin.untrack(node);
		};
	};
}
