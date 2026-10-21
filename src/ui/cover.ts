// A screen of its own opens with a circle: it grows from the button that you tapped until it
// covers the window, the new screen opens under it, and the circle fades. The circle has the
// colour of the new screen, so the change has no flash.

const GROW = 480;
const FADE = 260;

type Role = 'frame' | 'bg';

// The start of the circle: the arrow of a pill, the point of the tap, or the middle of the button.
function startOf(event: MouseEvent): { x: number; y: number } {
	const button = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
	const arrow = button?.querySelector('.wfd-button__arrow')?.getBoundingClientRect();
	if (arrow) return { x: arrow.left + arrow.width / 2, y: arrow.top + arrow.height / 2 };
	if (event.detail > 0) return { x: event.clientX, y: event.clientY };
	const box = button?.getBoundingClientRect();
	return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : { x: 0, y: 0 };
}

export function coverThen(event: MouseEvent, role: Role, open: () => void) {
	const source = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
	if (!source || matchMedia('(prefers-reduced-motion: reduce)').matches) return open();
	const { x, y } = startOf(event);
	const colour = getComputedStyle(source).getPropertyValue(`--wfd-color-${role}`);
	const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
	// A circle as large as the window, at the start point. Only its scale moves, so the browser
	// moves it with no new paint, also on a phone.
	const cover = document.createElement('div');
	Object.assign(cover.style, {
		position: 'fixed',
		left: `${x - far}px`,
		top: `${y - far}px`,
		width: `${far * 2}px`,
		height: `${far * 2}px`,
		zIndex: '50',
		borderRadius: '50%',
		pointerEvents: 'none',
		background: colour,
		willChange: 'transform'
	});
	document.body.append(cover);
	// Slow at the start and at the end, so the circle leaves the button and lands on the edges.
	const grow = cover.animate(
		[{ transform: `scale(${22 / far})` }, { transform: 'scale(1)' }],
		{ duration: GROW, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
	);
	grow.onfinish = () => {
		open();
		const fade = cover.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: FADE,
			delay: 80,
			fill: 'forwards'
		});
		fade.onfinish = () => cover.remove();
	};
}
