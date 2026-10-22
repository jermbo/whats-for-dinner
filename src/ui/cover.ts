import { easeOf, timeOf } from './motion';
import { lastTap } from './tap';

// A screen of its own opens with a circle: it grows from the button that you tapped until it
// covers the window, the new screen opens under it, and the circle fades. The circle has the
// colour of the new screen, so the change has no flash. A stage of the Shop changes the same way,
// with a circle that covers only the stage.

// The circle is a bit larger than its area. With the soft end of the easing, it covers the area
// at about half its time, so the new screen opens then and does not wait for the end.
const OVER = 1.1;
const COVERED = 0.5;
// The radius of the circle at its start: the circle of the arrow of a pill.
const START = 22;

type Role = 'frame' | 'bg';
type Box = { left: number; top: number; width: number; height: number };

// The start of the circle: the arrow of a pill, the point of the tap, or the middle of the button.
function startOf(source: HTMLElement): { x: number; y: number } {
	const arrow = source.querySelector('.wfd-button__arrow')?.getBoundingClientRect();
	if (arrow) return { x: arrow.left + arrow.width / 2, y: arrow.top + arrow.height / 2 };
	const tap = lastTap();
	if (tap) return tap;
	const box = source.getBoundingClientRect();
	return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

// The part of the area that is in the window: a stage can be longer than the screen.
function boxOf(area: HTMLElement | undefined): Box {
	if (!area) return { left: 0, top: 0, width: innerWidth, height: innerHeight };
	const box = area.getBoundingClientRect();
	const top = Math.max(box.top, 0);
	return { left: box.left, top, width: box.width, height: Math.min(box.bottom, innerHeight) - top };
}

// Grows the circle from `source` over `area`, or over the window, and calls `open` under it.
export function cover(source: HTMLElement, role: Role, open: () => void, area?: HTMLElement) {
	const grow = timeOf(source, 'move') * 2;
	if (!grow) return open();
	const easing = easeOf(source);
	const colour = getComputedStyle(source).getPropertyValue(`--wfd-color-${role}`);
	const box = boxOf(area);
	const start = startOf(source);
	const x = start.x - box.left;
	const y = start.y - box.top;
	const far = OVER * Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y));
	// The frame holds the circle in its area. It does not move, so it costs no new paint.
	const frame = document.createElement('div');
	Object.assign(frame.style, {
		position: 'fixed',
		left: `${box.left}px`,
		top: `${box.top}px`,
		width: `${box.width}px`,
		height: `${box.height}px`,
		zIndex: '50',
		overflow: 'hidden',
		pointerEvents: 'none'
	});
	// Only the scale of the circle moves, so the browser moves it with no new paint, also on a phone.
	const circle = document.createElement('div');
	Object.assign(circle.style, {
		position: 'absolute',
		left: `${x - far}px`,
		top: `${y - far}px`,
		width: `${far * 2}px`,
		height: `${far * 2}px`,
		borderRadius: '50%',
		background: colour,
		willChange: 'transform'
	});
	frame.append(circle);
	document.body.append(frame);
	const growing = circle.animate(
		[{ transform: `scale(${START / far})` }, { transform: 'scale(1)' }],
		{ duration: grow, easing, fill: 'forwards' }
	);
	setTimeout(open, grow * COVERED);
	growing.onfinish = () => {
		const fade = frame.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: grow / 2,
			easing,
			fill: 'forwards'
		});
		fade.onfinish = () => frame.remove();
	};
}

// The circle from the button of a click.
export function coverThen(event: MouseEvent, role: Role, open: () => void) {
	const source = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
	if (!source) return open();
	cover(source, role, open);
}
