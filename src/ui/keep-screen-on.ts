// The screen stays on while you cook or shop. It gives the function that lets the screen go off
// again, so that an effect can return it.
export function keepScreenOn(): () => void {
	let lock: WakeLockSentinel | undefined;
	const keepOn = async () => {
		try {
			lock = await navigator.wakeLock?.request('screen');
		} catch {
			// The device can refuse, for example when the battery is low.
		}
	};
	// The device releases the lock when the app is not in view.
	const again = () => document.visibilityState === 'visible' && void keepOn();

	void keepOn();
	document.addEventListener('visibilitychange', again);
	return () => {
		document.removeEventListener('visibilitychange', again);
		void lock?.release();
	};
}
