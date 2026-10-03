// The sound of a timer that ends. The browser makes the sound itself, so the app has no
// sound file and needs no connection.

/** @type {AudioContext | undefined} */
let context;

/** The start of each tone, in seconds, and its pitch, in hertz. */
const TONES = [
	[0, 880],
	[0.22, 880],
	[0.44, 1175]
];
const TONE_S = 0.16;

/**
 * Lets the page make a sound later. A browser gives sound only to a page that the owner
 * touched, so call this in a tap.
 */
export function unlockSound() {
	try {
		context ??= new AudioContext();
		if (context.state === 'suspended') context.resume();
	} catch {
		// A browser with no sound. The timer still shows "Done".
	}
}

/** Three short tones. Nothing occurs when the page has no sound: see "unlockSound". */
export function chime() {
	if (!context || context.state !== 'running') return;

	for (const [start, pitch] of TONES) {
		const at = context.currentTime + start;
		const tone = context.createOscillator();
		const volume = context.createGain();
		tone.frequency.value = pitch;
		// A soft start and a soft end: a tone that starts at full volume makes a click.
		volume.gain.setValueAtTime(0, at);
		volume.gain.linearRampToValueAtTime(0.5, at + 0.02);
		volume.gain.linearRampToValueAtTime(0, at + TONE_S);
		tone.connect(volume).connect(context.destination);
		tone.start(at);
		tone.stop(at + TONE_S);
	}
}
