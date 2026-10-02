/** The zone at each end of the element where the level is 0 or 1, so that a finger can reach them. */
const EDGE = 12;
/** A pointer must move this far before a tap becomes a slide. */
const SLOP = 6;

/**
 * @typedef {{
 *   onlevel: (level: number) => void,
 *   onend: (level: number) => void,
 *   oncancel: () => void
 * }} LevelDragHandlers
 */

/**
 * Makes an element a level control for a finger or a mouse.
 * A slide gives the level under the pointer, from 0 at the left edge to 1 at the right edge.
 * A tap gives the level at the tap. A vertical move stays a scroll of the page: the element
 * must have "touch-action: pan-y", and then the browser cancels the pointer.
 * @param {HTMLElement} node
 * @param {LevelDragHandlers} handlers
 */
export function levelDrag(node, handlers) {
	/** @type {number | null} The X position where the pointer went down. */
	let start = null;
	let sliding = false;

	/** @param {PointerEvent} event */
	function levelAt(event) {
		const box = node.getBoundingClientRect();
		const level = (event.clientX - box.left - EDGE) / (box.width - 2 * EDGE);
		return Math.min(1, Math.max(0, level));
	}

	/** @param {PointerEvent} event */
	function down(event) {
		if (!event.isPrimary || event.button !== 0) return;
		start = event.clientX;
		sliding = false;
		node.setPointerCapture(event.pointerId);
	}

	/** @param {PointerEvent} event */
	function move(event) {
		if (start === null) return;
		if (!sliding && Math.abs(event.clientX - start) < SLOP) return;
		sliding = true;
		handlers.onlevel(levelAt(event));
	}

	/** @param {PointerEvent} event */
	function up(event) {
		if (start === null) return;
		start = null;
		handlers.onend(levelAt(event));
	}

	function cancel() {
		if (start === null) return;
		start = null;
		handlers.oncancel();
	}

	node.addEventListener('pointerdown', down);
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerup', up);
	node.addEventListener('pointercancel', cancel);

	return {
		/** @param {LevelDragHandlers} next */
		update(next) {
			handlers = next;
		},
		destroy() {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', cancel);
		}
	};
}
