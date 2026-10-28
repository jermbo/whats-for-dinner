// The room for the bar of Obsidian. On a phone, Obsidian shows its bar over the lower edge of the
// tab, so a button there cannot be tapped. The kitchen measures how much of the tab the bar covers,
// and each screen adds that room to its end.
//
// Obsidian gives no value for the bar, and its look changed between versions. So the kitchen
// measures the bar itself, and a new bar needs no change here.
export function listenForBarRoom(tab: HTMLElement): () => void {
	const doc = tab.ownerDocument;
	const win = doc.defaultView ?? window;

	const measure = () => {
		// Obsidian moves its bar away during a scroll. The room stays, so that the screen does not jump.
		if (doc.body.classList.contains('is-hidden-nav')) return;
		const bar = doc.querySelector<HTMLElement>('.mobile-navbar');
		const covered = bar ? tab.getBoundingClientRect().bottom - bar.getBoundingClientRect().top : 0;
		tab.style.setProperty('--wfd-space-bar', `${Math.max(0, Math.ceil(covered))}px`);
	};

	const sizes = new ResizeObserver(measure);
	sizes.observe(tab);
	const bar = doc.querySelector('.mobile-navbar');
	if (bar) sizes.observe(bar);
	win.addEventListener('resize', measure);
	measure();

	return () => {
		sizes.disconnect();
		win.removeEventListener('resize', measure);
	};
}
