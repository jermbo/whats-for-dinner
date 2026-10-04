/**
 * The time of now, which moves while a component uses it. A timer shows the difference
 * between its end time and this time.
 * Call it during component setup.
 * @param {number} [interval] The time between two moves, in milliseconds.
 * @returns {{ readonly now: number }}
 */
export function useClock(interval = 1000) {
	let now = $state(Date.now());

	$effect(() => {
		const tick = () => (now = Date.now());
		const timer = setInterval(tick, interval);
		// A browser stops the timers of a page that is not in view. The clock is correct again
		// at the moment when the page comes back.
		document.addEventListener('visibilitychange', tick);
		return () => {
			clearInterval(timer);
			document.removeEventListener('visibilitychange', tick);
		};
	});

	return {
		get now() {
			return now;
		}
	};
}
