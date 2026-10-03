import { Draggable, InertiaPlugin, gsap } from '$lib/motion/gsap';

/** A throw is a move of this part of the card width, or a release at this speed (pixels/second). */
const THROW_DISTANCE = 0.35;
const THROW_SPEED = 700;
/** A pull down of this many pixels shuffles the pile. */
const PULL = 110;
/** The card turns this many degrees for each pixel to the side, as a card in the fingers. */
const TURN = 0.05;

/**
 * @typedef {{
 *   onpull: (progress: number) => void,
 *   onthrow: (node: HTMLElement, direction: { x: number, y: number }) => void,
 *   onshuffle: () => void,
 *   onstay: (node: HTMLElement) => void
 * }} ThrowHandlers
 */

/**
 * How far a card is pulled down, from 0 to 1. Only a move that is more down than to the side counts.
 * @param {number} x
 * @param {number} y
 */
function pullOf(x, y) {
	return y > 0 && y > Math.abs(x) ? Math.min(1, y / PULL) : 0;
}

/**
 * An attachment that makes the top card of a pile a card that you can throw.
 * Throw it to the left, to the right, or up: "onthrow" gets the direction.
 * Pull it down far: "onshuffle". A small move: "onstay", and the card must go back.
 * A touch on a button is never a drag, so that a tap on a phone stays a tap.
 * A drag can start on the photo, which is a link: a tap on it still opens the link.
 * @param {ThrowHandlers} handlers
 * @returns {(node: HTMLElement) => () => void}
 */
export function throwCard(handlers) {
	return (node) => {
		InertiaPlugin.track(node, 'x,y');

		const [draggable] = Draggable.create(node, {
			type: 'x,y',
			minimumMovement: 6,
			zIndexBoost: false,
			// GSAP uses "clickableTest" only when "dragClickables" is false. Only the controls are
			// "clickable" here, so a link is not: a drag can start on it.
			dragClickables: false,
			clickableTest: (element) =>
				Boolean(element.closest('button, input, select, textarea, label')),
			onPress() {
				// A card that still moves to its place stops under the finger.
				gsap.killTweensOf(node);
			},
			onDrag() {
				gsap.set(node, { rotation: draggable.x * TURN });
				handlers.onpull(pullOf(draggable.x, draggable.y));
			},
			onDragEnd() {
				const { x, y } = draggable;
				if (pullOf(x, y) >= 1) {
					handlers.onshuffle();
					return;
				}
				handlers.onpull(0);

				// Only a move to the side or up is a throw. Down is for the shuffle.
				const vx = InertiaPlugin.getVelocity(node, 'x');
				const vy = Math.min(0, InertiaPlugin.getVelocity(node, 'y'));
				const fast = Math.hypot(vx, vy) > THROW_SPEED;
				const far = Math.hypot(x, Math.min(0, y)) > node.offsetWidth * THROW_DISTANCE;
				if (!fast && !far) {
					handlers.onstay(node);
					return;
				}

				const [dx, dy] = fast ? [vx, vy] : [x, Math.min(0, y)];
				const length = Math.hypot(dx, dy) || 1;
				handlers.onthrow(node, { x: dx / length, y: dy / length });
			}
		});

		return () => {
			draggable.kill();
			InertiaPlugin.untrack(node);
		};
	};
}
