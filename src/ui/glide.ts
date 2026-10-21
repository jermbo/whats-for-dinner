// When a card opens or closes, the things around it get a new place in one frame: a bin or a
// card below it, or one in the next column. The glide makes that change smooth: it measures each
// thing before and after the change, and slides each one from its old place to its new one. Only
// the position moves, so the browser moves it with no new layout and no new paint.
//
// A thing with a surface, such as a bin, can also change its height. One that grows shows its new
// part from the top down. One that gets shorter leaves a copy of its surface under it, which gets
// short with it, so the edge of the bin comes up and does not jump.

type Place = { top: number; left: number; height: number };

const LENGTH = 320;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// The element that draws the surface of a thing: the panel of a bin, or the card of a recipe.
const surfaceOf = (node: HTMLElement) => node.querySelector<HTMLElement>('[data-glide-bg]') ?? node;

const placeOf = (node: HTMLElement): Place => {
	const box = node.getBoundingClientRect();
	return { top: box.top, left: box.left, height: box.height };
};

// The copy of a surface that gets short. It is under each thing of the tab, so a thing that
// slides up covers it.
function shrinkSurface(node: HTMLElement, from: Place, to: Place, dx: number, dy: number) {
	const tab = node.closest<HTMLElement>('.wfd');
	if (!tab) return;
	const area = tab.getBoundingClientRect();
	const surface = surfaceOf(node);
	const style = getComputedStyle(surface);
	const copy = document.createElement('div');
	Object.assign(copy.style, {
		position: 'absolute',
		zIndex: '-1',
		top: `${to.top - area.top + tab.scrollTop}px`,
		left: `${to.left - area.left + tab.scrollLeft}px`,
		width: `${surface.getBoundingClientRect().width}px`,
		height: `${from.height}px`,
		borderRadius: style.borderRadius,
		background: style.backgroundColor,
		transformOrigin: 'top',
		pointerEvents: 'none'
	});
	tab.append(copy);
	const motion = copy.animate(
		[
			{ transform: `translate(${dx}px, ${dy}px) scaleY(1)` },
			{ transform: `translate(0, 0) scaleY(${to.height / from.height})` }
		],
		{ duration: LENGTH, easing: EASE }
	);
	motion.onfinish = () => copy.remove();
}

// Makes the change, and glides each thing of `selector` in `root` to its new place.
export function glide(root: HTMLElement | undefined, selector: string, change: () => void) {
	if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return change();
	const before = new Map<HTMLElement, Place>();
	for (const node of root.querySelectorAll<HTMLElement>(selector)) before.set(node, placeOf(node));

	change();

	const moves = new Map<HTMLElement, { dx: number; dy: number }>();
	for (const node of root.querySelectorAll<HTMLElement>(selector)) {
		const from = before.get(node);
		if (!from) continue;
		for (const running of node.getAnimations()) if (running.id === 'glide') running.cancel();
		const to = placeOf(node);
		moves.set(node, { dx: from.left - to.left, dy: from.top - to.top });

		// A thing in a thing that also moves moves with it, so it slides only its own part.
		const outer = node.parentElement?.closest<HTMLElement>(selector);
		const carried = outer ? moves.get(outer) : undefined;
		const dx = from.left - to.left - (carried?.dx ?? 0);
		const dy = from.top - to.top - (carried?.dy ?? 0);
		if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
			const slide = node.animate(
				[{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
				{ duration: LENGTH, easing: EASE }
			);
			slide.id = 'glide';
		}

		if (!node.hasAttribute('data-glide-surface')) continue;
		if (to.height < from.height - 1) {
			shrinkSurface(node, from, to, from.left - to.left, from.top - to.top);
		} else if (to.height > from.height + 1) {
			const radius = getComputedStyle(surfaceOf(node)).borderRadius;
			const reveal = node.animate(
				[
					{ clipPath: `inset(0 0 ${to.height - from.height}px 0 round ${radius})` },
					{ clipPath: `inset(0 0 0 0 round ${radius})` }
				],
				{ duration: LENGTH, easing: EASE }
			);
			reveal.id = 'glide';
		}
	}
}
