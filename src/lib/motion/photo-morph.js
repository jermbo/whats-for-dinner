const NAME = 'recipe-photo';

/**
 * Connects a tap on a recipe to the page that opens.
 * When a link in this element is followed, the photo in this element gets the name that the
 * photo at the top of the recipe page has. The page transition then grows one into the other.
 * The name is given at the tap, because only one element on a page can have it.
 * @param {HTMLElement} node
 */
export function photoMorph(node) {
	/** @param {MouseEvent} event */
	function mark(event) {
		if (!(event.target instanceof Element) || !event.target.closest('a')) return;

		for (const old of document.querySelectorAll('[data-recipe-photo]')) {
			if (old instanceof HTMLElement) old.style.viewTransitionName = '';
		}

		const photo = node.querySelector('[data-recipe-photo]');
		if (photo instanceof HTMLElement) photo.style.viewTransitionName = NAME;
	}

	node.addEventListener('click', mark, true);

	return {
		destroy() {
			node.removeEventListener('click', mark, true);
		}
	};
}
