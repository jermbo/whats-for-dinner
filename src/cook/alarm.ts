// The alarm of a timer: three beeps, again and again, until you stop it. A page can make sound
// only after a touch, so the alarm gets its sound at the tap that starts a timer.

// The pitch of a beep, in hertz. A small speaker is loud at this pitch.
const PITCH = 1760;
const LOUD = 0.6;
// The length of one beep, and the start of each beep in a cycle, in seconds.
const BEEP = 0.14;
const BEEPS = [0, 0.22, 0.44];
// The time from one cycle to the next, in milliseconds.
const CYCLE = 1300;
// An alarm that nobody stops is quiet after one minute.
const CYCLES = 46;

function beep(audio: AudioContext, out: AudioNode, at: number) {
	const tone = audio.createOscillator();
	const volume = audio.createGain();
	tone.type = 'triangle';
	tone.frequency.value = PITCH;
	// A beep that starts or stops at full volume makes a click.
	volume.gain.setValueAtTime(0, at);
	volume.gain.linearRampToValueAtTime(LOUD, at + 0.01);
	volume.gain.setValueAtTime(LOUD, at + BEEP - 0.02);
	volume.gain.linearRampToValueAtTime(0, at + BEEP);
	tone.connect(volume).connect(out);
	tone.start(at);
	tone.stop(at + BEEP);
}

export class Alarm {
	private audio: AudioContext | null = null;
	// All beeps go through this point, so that one cut makes the alarm quiet.
	private out: GainNode | null = null;
	private repeat: ReturnType<typeof setInterval> | undefined;
	private left = 0;

	// Call this in a tap. From then on, the device lets the page make sound.
	ready() {
		try {
			this.audio ??= new AudioContext();
			if (this.audio.state !== 'running') void this.audio.resume().catch(() => {});
		} catch {
			// The device gives no sound to a page. The notice and the flash stay.
		}
	}

	// A second timer that ends during the alarm gives the alarm its full minute again.
	ring() {
		this.left = CYCLES;
		if (this.repeat !== undefined) return;

		this.ready();
		const { audio } = this;
		if (audio) {
			this.out = audio.createGain();
			this.out.connect(audio.destination);
		}

		const cycle = () => {
			if (this.left-- <= 0) return this.quiet();
			navigator.vibrate?.([200, 100, 200]);
			if (audio && this.out) for (const at of BEEPS) beep(audio, this.out, audio.currentTime + at);
		};
		cycle();
		this.repeat = setInterval(cycle, CYCLE);
	}

	quiet() {
		if (this.repeat === undefined) return;
		clearInterval(this.repeat);
		this.repeat = undefined;
		this.out?.disconnect();
		this.out = null;
		navigator.vibrate?.(0);
	}

	close() {
		this.quiet();
		void this.audio?.close().catch(() => {});
		this.audio = null;
	}
}
