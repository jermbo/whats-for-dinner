import { timeOf } from './motion';
import './press.css';

// The press of a button: a small circle that grows from the finger and fades. One listener on the
// kitchen tab gives it to each button, so a local button of a screen needs no code of its own.
//
// The circle is not in the button. A button can have its own background and its own position, and
// a rule of a screen is stronger than a rule here. So the circle is in a layer over the button, in
// the tab, with the corners of the button, and it scrolls with the content.
export function listenForPress(tab: HTMLElement): () => void {
	const show = (button: HTMLButtonElement, x: number, y: number) => {
		if (button.disabled || !timeOf(tab, 'move')) return;
		const box = button.getBoundingClientRect();
		const area = tab.getBoundingClientRect();
		const style = getComputedStyle(button);
		const layer = document.createElement('div');
		layer.className = 'wfd-press';
		Object.assign(layer.style, {
			top: `${box.top - area.top + tab.scrollTop}px`,
			left: `${box.left - area.left + tab.scrollLeft}px`,
			width: `${box.width}px`,
			height: `${box.height}px`,
			borderRadius: style.borderRadius,
			color: style.color
		});
		// The circle ends where it covers the corner that is farthest from the finger. Only its
		// scale moves, so the browser moves it with no new paint.
		const far = Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y));
		const circle = document.createElement('span');
		circle.className = 'wfd-press__circle';
		Object.assign(circle.style, {
			left: `${x - far}px`,
			top: `${y - far}px`,
			width: `${far * 2}px`,
			height: `${far * 2}px`
		});
		layer.append(circle);
		tab.append(layer);
		layer.addEventListener('animationend', () => layer.remove());
	};

	const buttonOf = (target: EventTarget | null) =>
		target instanceof Element ? target.closest('button') : null;

	// A finger that lands on a button can start a scroll. So the circle of a touch waits a press,
	// and a finger that moves first, or a scroll of the browser, cancels it. A finger that lifts
	// before the wait shows it at once.
	let waiting: { show: () => void; x: number; y: number; timer: number } | null = null;
	const stopWaiting = () => {
		if (waiting) clearTimeout(waiting.timer);
		waiting = null;
	};
	const SLOP = 8;

	const onpointerdown = (event: PointerEvent) => {
		stopWaiting();
		const button = buttonOf(event.target);
		if (!button) return;
		const box = button.getBoundingClientRect();
		const go = () => show(button, event.clientX - box.left, event.clientY - box.top);
		if (event.pointerType === 'mouse') return go();
		const timer = window.setTimeout(() => (stopWaiting(), go()), timeOf(tab, 'press'));
		waiting = { show: go, x: event.clientX, y: event.clientY, timer };
	};

	const onpointermove = (event: PointerEvent) => {
		if (waiting && Math.hypot(event.clientX - waiting.x, event.clientY - waiting.y) > SLOP) {
			stopWaiting();
		}
	};

	const onpointerup = () => {
		const go = waiting?.show;
		stopWaiting();
		go?.();
	};

	// A key press has no point, so the circle starts at the middle.
	const onkeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		const button = buttonOf(event.target);
		if (!button) return;
		show(button, button.offsetWidth / 2, button.offsetHeight / 2);
	};

	tab.addEventListener('pointerdown', onpointerdown);
	tab.addEventListener('pointermove', onpointermove);
	tab.addEventListener('pointerup', onpointerup);
	tab.addEventListener('pointercancel', stopWaiting);
	tab.addEventListener('keydown', onkeydown);
	return () => {
		stopWaiting();
		tab.removeEventListener('pointerdown', onpointerdown);
		tab.removeEventListener('pointermove', onpointermove);
		tab.removeEventListener('pointerup', onpointerup);
		tab.removeEventListener('pointercancel', stopWaiting);
		tab.removeEventListener('keydown', onkeydown);
	};
}
