import { easeOf, timeOf } from './motion';

// When a card opens or closes, the things around it get a new place in one frame: a bin or a
// card below it, or one in the next column. The glide makes that change smooth: it measures each
// thing before and after the change, and slides each one from its old place to its new one. Only
// the position moves, so the browser moves it with no new layout and no new paint.
//
// A thing with a surface, such as a bin, can also change its height. A copy of its surface under
// it gets taller or shorter with it, so the edge of the bin moves and does not jump. Only the scale
// of the copy moves, for the same reason.

type Place = { top: number; left: number; height: number };

// The element that draws the surface of a thing: the panel of a bin, or the card of a recipe.
const surfaceOf = (node: HTMLElement) => node.querySelector<HTMLElement>('[data-glide-bg]') ?? node;

const placeOf = (node: HTMLElement): Place => {
	const box = node.getBoundingClientRect();
	return { top: box.top, left: box.left, height: box.height };
};

// One copy for each surface: a glide that starts before the last one ends replaces its copy.
const copies = new WeakMap<HTMLElement, HTMLElement>();

// The copy is under each thing of the tab, so a thing that slides covers it. A surface that grows
// is clear while its copy grows, so that its new part shows from the top down.
function resizeSurface(node: HTMLElement, from: Place, to: Place, dx: number, dy: number) {
	const tab = node.closest<HTMLElement>('.wfd');
	if (!tab) return;
	const surface = surfaceOf(node);
	copies.get(surface)?.remove();
	surface.removeAttribute('data-glide-clear');
	const area = tab.getBoundingClientRect();
	const style = getComputedStyle(surface);
	const tall = Math.max(from.height, to.height);
	const copy = document.createElement('div');
	Object.assign(copy.style, {
		position: 'absolute',
		zIndex: '-1',
		top: `${to.top - area.top + tab.scrollTop}px`,
		left: `${to.left - area.left + tab.scrollLeft}px`,
		width: `${surface.getBoundingClientRect().width}px`,
		height: `${tall}px`,
		borderRadius: style.borderRadius,
		background: style.backgroundColor,
		transformOrigin: 'top',
		pointerEvents: 'none'
	});
	tab.append(copy);
	copies.set(surface, copy);
	const grows = to.height > from.height;
	if (grows) surface.setAttribute('data-glide-clear', '');
	const motion = copy.animate(
		[
			{
				transform: `translate(${dx}px, ${dy}px) scaleY(${from.height / tall})`
			},
			{ transform: `translate(0, 0) scaleY(${to.height / tall})` }
		],
		{ duration: timeOf(tab, 'move'), easing: easeOf(tab) }
	);
	motion.onfinish = () => {
		copy.remove();
		if (copies.get(surface) === copy) surface.removeAttribute('data-glide-clear');
	};
}

// The place of each thing of `selector` in `root`, before a change.
function measure(root: HTMLElement, selector: string) {
	const before = new Map<HTMLElement, Place>();
	for (const node of root.querySelectorAll<HTMLElement>(selector)) before.set(node, placeOf(node));
	return before;
}

// Slides each thing that moved from its place in `before` to its new place.
function slideFrom(root: HTMLElement, selector: string, before: Map<HTMLElement, Place>) {
	const length = timeOf(root, 'move');
	const easing = easeOf(root);
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
				{ duration: length, easing }
			);
			slide.id = 'glide';
		}

		if (node.hasAttribute('data-glide-surface') && Math.abs(to.height - from.height) > 1) {
			resizeSurface(node, from, to, from.left - to.left, from.top - to.top);
		}
	}
}

// Makes the change, and glides each thing of `selector` in `root` to its new place.
export function glide(root: HTMLElement | undefined, selector: string, change: () => void) {
	if (!root || !timeOf(root, 'move')) return change();
	const before = measure(root, selector);
	change();
	slideFrom(root, selector, before);
}

// A change that the vault makes comes some time after the write, so the screen cannot make it in
// one call. This measures now, and glides when `root` changes next. After `WAIT`, it stops.
const WAIT = 3000;

export function glideOnNextChange(root: HTMLElement | undefined, selector: string) {
	if (!root || !timeOf(root, 'move')) return;
	const before = measure(root, selector);
	const watch = new MutationObserver(() => {
		watch.disconnect();
		clearTimeout(timer);
		slideFrom(root, selector, before);
	});
	watch.observe(root, { childList: true, subtree: true });
	const timer = setTimeout(() => watch.disconnect(), WAIT);
}
