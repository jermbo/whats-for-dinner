// The last point that a finger or a mouse pressed in the kitchen tab. A circle of the motion
// starts there, also when the element that you pressed is gone, such as a line that became a card.

const tap = { x: 0, y: 0, at: -Infinity };

// A press counts for a circle only for a short time. After that, a change came from a key.
const FRESH = 700;

export function lastTap(): { x: number; y: number } | null {
	return performance.now() - tap.at < FRESH ? { x: tap.x, y: tap.y } : null;
}

export function listenForTaps(tab: HTMLElement): () => void {
	const ondown = (event: PointerEvent) => {
		tap.x = event.clientX;
		tap.y = event.clientY;
		tap.at = performance.now();
	};
	tab.addEventListener('pointerdown', ondown, { capture: true });
	return () => tab.removeEventListener('pointerdown', ondown, { capture: true });
}
