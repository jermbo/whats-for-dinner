import { vibrate } from '$lib/input/vibrate';
import { chime } from '$lib/sound/chime';
import { usePreferences } from './preferences.svelte';

/** A timer that ended this long ago, or less, makes its sound. An older one is only "Done". */
const RING_WINDOW_MS = 3000;

/**
 * Makes the sound of a timer at the moment when it ends, one time for each timer.
 * Call it during component setup.
 * @param {() => import('$lib/types').CookTimer[]} timers A function that reads the timers.
 * @param {() => number} now A function that reads the time of now, in milliseconds.
 */
export function useTimerBell(timers, now) {
	/**
	 * The IDs of the timers that made their sound. It is a plain object, because the screen
	 * does not show it.
	 * @type {Record<string, true>}
	 */
	const rung = {};
	const preferences = usePreferences();

	$effect(() => {
		const time = now();
		for (const timer of timers()) {
			const end = Date.parse(timer.endsAt);
			if (end > time || rung[timer.id]) continue;
			rung[timer.id] = true;
			if (time - end > RING_WINDOW_MS) continue;
			if (preferences.values.timerSound) chime();
			vibrate([200, 100, 200]);
		}
	});
}
