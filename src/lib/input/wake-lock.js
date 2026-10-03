/**
 * Keeps the screen of the phone on. A phone turns its screen off after a short time, and in
 * Cook mode the hands of the owner are not free to unlock it.
 * The browser releases the lock when the page goes out of view, so the lock is asked for
 * again when the page comes back. A browser that has no such lock does nothing.
 * @returns {() => void} A function that lets the screen turn off again.
 */
export function keepScreenOn() {
	/** @type {WakeLockSentinel | null} */
	let lock = null;
	let stopped = false;

	async function ask() {
		if (stopped || lock || document.visibilityState !== 'visible') return;
		try {
			lock = (await navigator.wakeLock?.request('screen')) ?? null;
			lock?.addEventListener('release', () => (lock = null));
			// The owner can leave while the browser answers.
			if (stopped) lock?.release();
		} catch {
			// The browser refuses the lock, for example when the battery is low. The app goes on.
		}
	}

	ask();
	document.addEventListener('visibilitychange', ask);

	return () => {
		stopped = true;
		document.removeEventListener('visibilitychange', ask);
		lock?.release();
	};
}
