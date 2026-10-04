/** False when the owner turned the vibration off on this device. */
let on = true;

/** @param {boolean} value */
export function setVibration(value) {
	on = value;
}

/**
 * A vibration of the phone, on the devices that can do it.
 * @param {number | number[]} pattern The time in milliseconds, or the times of a pattern:
 *   on, off, on.
 */
export function vibrate(pattern) {
	if (on) navigator.vibrate?.(pattern);
}
