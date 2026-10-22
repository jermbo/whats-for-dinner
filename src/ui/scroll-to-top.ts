// An open card moves to the top of the screen, under the head of the part, with 12 px between.
// The card has its full size at once, so one measure is enough, and the browser does the smooth
// scroll itself. The measure is at once, in the change that opens the card: after it, the things
// around the card glide, and a thing that glides is not at its new place yet.

const GAP = 12;

function scrollerOf(node: HTMLElement): HTMLElement | null {
	for (let at = node.parentElement; at; at = at.parentElement) {
		const { overflowY } = getComputedStyle(at);
		if (overflowY === 'auto' || overflowY === 'scroll') return at;
	}
	return null;
}

export function scrollToTop(card: HTMLElement) {
	const scroller = scrollerOf(card);
	if (!scroller) return;
	const head = scroller.querySelector<HTMLElement>('.wfd-top');
	const under = head ? head.getBoundingClientRect().bottom : scroller.getBoundingClientRect().top;
	const instant = matchMedia('(prefers-reduced-motion: reduce)').matches;
	scroller.scrollBy({
		top: card.getBoundingClientRect().top - (under + GAP),
		behavior: instant ? 'auto' : 'smooth'
	});
}
