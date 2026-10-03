/**
 * The side column of the split that has this element, when the column is next to the main
 * column. In a narrow main area the split has one column, and the result is null.
 * CSS knows the width of the main area: see ".split" in styles/layout.css. The script asks CSS,
 * so that the two cannot disagree.
 * @param {Element} element
 * @returns {HTMLElement | null}
 */
export function sideColumn(element) {
	const side = element.closest('.split')?.querySelector(':scope > .split__side');
	if (!(side instanceof HTMLElement)) return null;
	return getComputedStyle(side).display === 'contents' ? null : side;
}
