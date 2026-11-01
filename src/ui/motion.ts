// A motion of a script reads the motion tokens of the element that it moves, as a style block
// does. So a change of a token changes each motion, and with less motion each time is 0.

import { prefersReducedMotion } from 'svelte/motion';

type Duration = 'press' | 'change' | 'move';

export function timeOf(node: Element, duration: Duration): number {
	const value = getComputedStyle(node).getPropertyValue(`--wfd-motion-${duration}`).trim();
	return (parseFloat(value) || 0) * (value.endsWith('ms') ? 1 : 1000);
}

export function easeOf(node: Element): string {
	return getComputedStyle(node).getPropertyValue('--wfd-ease-out').trim() || 'ease-out';
}

// A transition of Svelte gets its time before it has its element, so it reads the token of the
// kitchen tab. In a `$derived`, the read of the setting for less motion makes the time follow a
// change of that setting, because the style of the tab does not tell Svelte that it changed.
export function tokenTime(duration: Duration): number {
	void prefersReducedMotion.current;
	const tab = document.querySelector('.wfd');
	return tab ? timeOf(tab, duration) : 0;
}
