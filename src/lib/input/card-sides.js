/** A move to the side of this many pixels is a swipe. */
const SWIPE = 56;

/** The controls of a card. A touch on one of them is never a tap on the card. */
const CONTROLS = 'button, a, input, select, textarea, label, summary, [data-controls]';

/** @param {EventTarget | null} target */
const onControl = (target) => target instanceof Element && target.closest(CONTROLS) !== null;

/**
 * An attachment for the card of Cook mode. The owner cooks with wet hands, so the target is
 * half of the card: a tap on the right half is "next", and a tap on the left half is "back".
 * A swipe to the left is "next", and a swipe to the right is "back".
 * The card scrolls up and down. Give it "touch-action: pan-y", so that the browser gives a
 * move to the side to this code.
 * @param {{ onnext: () => void, onback: () => void }} handlers
 * @returns {(node: HTMLElement) => () => void}
 */
export function cardSides(handlers) {
	return (node) => {
		/** @type {{ x: number, y: number } | null} The place where the finger came down. */
		let start = null;
		let swiped = false;

		/** @param {PointerEvent} event */
		function down(event) {
			swiped = false;
			start = onControl(event.target) ? null : { x: event.clientX, y: event.clientY };
		}

		/** @param {PointerEvent} event */
		function up(event) {
			if (!start) return;
			const x = event.clientX - start.x;
			const y = event.clientY - start.y;
			start = null;
			// Only a move that is more to the side than up or down is a swipe.
			if (Math.abs(x) < SWIPE || Math.abs(x) < 2 * Math.abs(y)) return;

			swiped = true;
			if (x < 0) handlers.onnext();
			else handlers.onback();
		}

		/** @param {MouseEvent} event */
		function click(event) {
			// A mouse gives a click after a swipe. That click is not a tap.
			if (swiped || onControl(event.target)) return;
			// The owner selected text, for example to copy it.
			if (getSelection()?.toString()) return;

			const box = node.getBoundingClientRect();
			if (event.clientX < box.left + box.width / 2) handlers.onback();
			else handlers.onnext();
		}

		const cancel = () => (start = null);

		node.addEventListener('pointerdown', down);
		node.addEventListener('pointerup', up);
		node.addEventListener('pointercancel', cancel);
		node.addEventListener('click', click);

		return () => {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', cancel);
			node.removeEventListener('click', click);
		};
	};
}
