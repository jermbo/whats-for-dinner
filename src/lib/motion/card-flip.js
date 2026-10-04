// A meal card turns over, and its back grows to a sheet on the screen. "Turn back" does the
// reverse. The component of the sheet tells when.
import { gsap } from './gsap';

/** The corner of a card, for the start of the grow and the end of the shrink. */
const CARD_RADIUS = '12px';

/**
 * The transform that puts the full sheet exactly on a box, from the center.
 * @param {HTMLElement} sheet
 * @param {DOMRect} box
 */
function onto(sheet, box) {
	const full = sheet.getBoundingClientRect();
	return {
		x: box.left + box.width / 2 - (full.left + full.width / 2),
		y: box.top + box.height / 2 - (full.top + full.height / 2),
		scaleX: box.width / full.width,
		scaleY: box.height / full.height
	};
}

/**
 * The box of the card with no turn, also when the card is on its edge now.
 * @param {HTMLElement} element
 */
function boxOf(element) {
	const turn = gsap.getProperty(element, 'rotationY');
	gsap.set(element, { rotationY: 0 });
	const box = element.getBoundingClientRect();
	gsap.set(element, { rotationY: turn });
	return box;
}

/**
 * The card turns to its edge. Then the sheet opens, and grows from the place of the card to
 * its full size.
 * @param {HTMLElement} card
 * @param {HTMLDialogElement} sheet
 * @param {HTMLElement} inner The content of the sheet. It comes in last.
 */
export async function flipOpen(card, sheet, inner) {
	const box = boxOf(card);
	await gsap.to(card, {
		rotationY: 90,
		transformPerspective: 900,
		duration: 0.2,
		ease: 'power2.in'
	});

	gsap.set(sheet, { clearProps: 'transform,borderRadius' });
	gsap.set(inner, { opacity: 0, y: 16 });
	sheet.showModal();
	const radius = getComputedStyle(sheet).borderRadius;

	await gsap.fromTo(
		sheet,
		{ ...onto(sheet, box), rotationY: -90, transformPerspective: 1400, borderRadius: CARD_RADIUS },
		{
			x: 0,
			y: 0,
			scaleX: 1,
			scaleY: 1,
			rotationY: 0,
			borderRadius: radius,
			duration: 0.5,
			ease: 'power3.out'
		}
	);
	gsap.set(sheet, { clearProps: 'borderRadius' });
	gsap.to(inner, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
}

/**
 * The sheet goes back onto the card, and turns to its edge. The sheet stays open: close it
 * after this.
 * @param {HTMLElement} card
 * @param {HTMLDialogElement} sheet
 * @param {HTMLElement} inner
 */
export async function flipShut(card, sheet, inner) {
	const box = boxOf(card);
	await gsap.to(inner, { opacity: 0, duration: 0.15 });
	await gsap.to(sheet, {
		...onto(sheet, box),
		rotationY: -90,
		transformPerspective: 1400,
		borderRadius: CARD_RADIUS,
		duration: 0.32,
		ease: 'power2.in'
	});
}

/**
 * The card turns from its edge back to its front.
 * @param {HTMLElement} card
 * @param {boolean} instant With no motion.
 */
export function turnToFront(card, instant) {
	return gsap.to(card, {
		rotationY: 0,
		duration: instant ? 0 : 0.35,
		ease: 'back.out(1.7)',
		onComplete: () => gsap.set(card, { clearProps: 'transform' })
	});
}
