/**
 * Makes a text field as tall as its text, in a browser that cannot do this with CSS
 * ("field-sizing: content").
 * @param {HTMLTextAreaElement} node
 */
export function fitHeight(node) {
	if (CSS.supports('field-sizing', 'content')) return;
	node.style.blockSize = 'auto';
	node.style.blockSize = `${node.scrollHeight + 2}px`;
}
