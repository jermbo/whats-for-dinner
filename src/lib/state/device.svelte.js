import { setVibration } from '$lib/input/vibrate';
import { askForLessMotion } from '$lib/motion/less-motion.svelte';
import { usePreferences } from './preferences.svelte';

/**
 * Gives the device preferences to the tools of the device. A gesture or a motion is not a
 * component, so it cannot read the preferences itself.
 * Call it during the setup of the root layout, after "providePreferences".
 */
export function useDevicePreferences() {
	const preferences = usePreferences();

	$effect(() => setVibration(preferences.values.vibration));
	$effect(() => askForLessMotion(preferences.values.lessMotion));
}
