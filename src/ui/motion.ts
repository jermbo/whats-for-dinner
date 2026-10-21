// A motion of a script reads the motion tokens of the element that it moves, as a style block
// does. So a change of a token changes each motion, and with less motion each time is 0.

type Duration = 'press' | 'change' | 'move';

export function timeOf(node: Element, duration: Duration): number {
	const value = getComputedStyle(node).getPropertyValue(`--wfd-motion-${duration}`).trim();
	return (parseFloat(value) || 0) * (value.endsWith('ms') ? 1 : 1000);
}

export function easeOf(node: Element): string {
	return getComputedStyle(node).getPropertyValue('--wfd-ease-out').trim() || 'ease-out';
}
