import { lastTap } from './tap';

// The point in a card where its circle starts: an element of the card that asks for it, such as
// the star of "Tonight", or the last tap in the card, or the middle of the head of the card.
export function originOf(card: HTMLElement): { x: number; y: number } {
	const box = card.getBoundingClientRect();
	const asked = card.querySelector<HTMLElement>('[data-ink-from]')?.getBoundingClientRect();
	if (asked) return { x: asked.left + asked.width / 2 - box.left, y: asked.top + asked.height / 2 - box.top };
	const tap = lastTap();
	const inside =
		tap && tap.x >= box.left && tap.x <= box.right && tap.y >= box.top && tap.y <= box.bottom;
	if (inside) return { x: tap.x - box.left, y: tap.y - box.top };
	return { x: box.width / 2, y: Math.min(box.height / 2, 40) };
}

// The time of a circle is two moves, from the motion tokens, so less motion makes it 0.
export function inkLength(card: HTMLElement): number {
	const move = getComputedStyle(card).getPropertyValue('--wfd-motion-move').trim();
	return (parseFloat(move) || 0) * (move.endsWith('ms') ? 1 : 1000) * 2;
}

// Grows or shrinks one circle of a card from its point. Only the scale of the circle moves, so
// the browser moves it with no new layout and no new paint. When the circle covers the card, it
// becomes a plain layer that fills the card, so a card that grows later stays covered.
export function spread(card: HTMLElement, layer: HTMLElement, on: boolean, duration: number) {
	for (const running of layer.getAnimations()) running.cancel();
	const box = card.getBoundingClientRect();
	const { x, y } = originOf(card);
	const radius = Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y));
	const covered = layer.classList.contains('wfd-ink--full');
	if (!duration || (on && covered) || (!on && !covered && !layer.classList.contains('wfd-ink--circle'))) {
		layer.classList.toggle('wfd-ink--full', on);
		layer.classList.remove('wfd-ink--circle');
		return null;
	}
	layer.classList.remove('wfd-ink--full');
	layer.classList.add('wfd-ink--circle');
	Object.assign(layer.style, {
		left: `${x - radius}px`,
		top: `${y - radius}px`,
		width: `${radius * 2}px`,
		height: `${radius * 2}px`
	});
	const scales = on ? ['scale(0)', 'scale(1)'] : ['scale(1)', 'scale(0)'];
	const motion = layer.animate(
		scales.map((transform) => ({ transform })),
		{ duration, easing: getComputedStyle(card).getPropertyValue('--wfd-ease-out'), fill: 'forwards' }
	);
	motion.onfinish = () => {
		layer.classList.remove('wfd-ink--circle');
		layer.classList.toggle('wfd-ink--full', on);
		layer.removeAttribute('style');
		motion.cancel();
	};
	return motion;
}
