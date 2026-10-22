import { easeOf, timeOf } from './motion';

// A name flies from a point to a button, such as the name of an item that you ticked to the cart,
// so that you see where the item went. It moves to the side fast and up or down slow, so its path
// is an arc, and it gets small as it lands. Only its position, its scale, and its opacity move.

// The name is in the air for this many moves.
const MOVES = 1.8;
// The scale of the name when it lands.
const LANDS = 0.3;

export function flyTo(
	tab: HTMLElement,
	from: { x: number; y: number },
	to: Element | null | undefined,
	name: string,
	onland: () => void
) {
	const length = timeOf(tab, 'move') * MOVES;
	if (!to || !length) return onland();
	const box = to.getBoundingClientRect();
	const dx = box.left + box.width / 2 - from.x;
	const dy = box.top + box.height / 2 - from.y;

	// The outer layer moves to the side, and the name in it moves up or down: two easings make
	// the arc. The layer is in the tab, so the name has the tokens of the kitchen.
	const layer = document.createElement('div');
	layer.className = 'wfd-fly';
	Object.assign(layer.style, { left: `${from.x}px`, top: `${from.y}px` });
	const pill = document.createElement('div');
	pill.className = 'wfd-fly__name';
	pill.textContent = name;
	layer.append(pill);
	tab.append(layer);

	layer.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], {
		duration: length,
		easing: easeOf(tab),
		fill: 'forwards'
	});
	const landing = pill.animate(
		[
			{ transform: 'translateY(0) scale(1)', opacity: 1 },
			{ transform: `translateY(${dy}px) scale(${LANDS})`, opacity: 0.4 }
		],
		{ duration: length, easing: 'cubic-bezier(0.55, 0, 0.75, 0.4)', fill: 'forwards' }
	);
	landing.onfinish = () => {
		layer.remove();
		onland();
	};
}
