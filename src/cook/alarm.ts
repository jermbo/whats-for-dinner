// The alarm of a timer: a short sound, again and again, until you stop it. A page can make sound
// only after a touch, so the alarm gets its sound at the tap that starts a timer.

export type Sound = 'beeps' | 'chime' | 'off';
export type AlarmOptions = {
	sound: Sound;
	// From 1 (quiet) to 10 (loud).
	volume: number;
	vibrate: boolean;
};

// A note starts `at` seconds into a cycle. The pitch is in hertz, and the length is in seconds.
type Note = { at: number; pitch: number; length: number };
// A sound that fades is soft, as a bell. A sound that does not fade is hard, as a kitchen timer.
type Tone = { wave: OscillatorType; fades: boolean; notes: Note[] };

const TONES: Record<Exclude<Sound, 'off'>, Tone> = {
	// Three short beeps. A small speaker is loud at this pitch.
	beeps: {
		wave: 'triangle',
		fades: false,
		notes: [0, 0.22, 0.44].map((at) => ({ at, pitch: 1760, length: 0.14 }))
	},
	// Two notes of a bell. The second note is lower.
	chime: {
		wave: 'sine',
		fades: true,
		notes: [
			{ at: 0, pitch: 1319, length: 0.7 },
			{ at: 0.35, pitch: 1047, length: 0.9 }
		]
	}
};

// The time from one cycle to the next, in milliseconds.
const CYCLE = 1300;
// An alarm that nobody stops is quiet after one minute.
const CYCLES = 46;

function play(audio: AudioContext, out: AudioNode, tone: Tone, note: Note, loud: number) {
	const sound = audio.createOscillator();
	const volume = audio.createGain();
	const start = audio.currentTime + note.at;
	const end = start + note.length;

	sound.type = tone.wave;
	sound.frequency.value = note.pitch;
	// A note that starts or stops at full volume makes a click.
	volume.gain.setValueAtTime(0, start);
	volume.gain.linearRampToValueAtTime(loud, start + 0.01);
	if (tone.fades) {
		volume.gain.exponentialRampToValueAtTime(0.001, end);
	} else {
		volume.gain.setValueAtTime(loud, end - 0.02);
		volume.gain.linearRampToValueAtTime(0, end);
	}
	sound.connect(volume).connect(out);
	sound.start(start);
	sound.stop(end);
}

export class Alarm {
	private audio: AudioContext | null = null;
	// All notes go through this point, so that one cut makes the alarm quiet.
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
	ring(options: AlarmOptions) {
		this.left = CYCLES;
		if (this.repeat !== undefined) return;

		const cycle = () => (this.left-- > 0 ? this.once(options) : this.quiet());
		cycle();
		this.repeat = setInterval(cycle, CYCLE);
	}

	// One cycle of the alarm. The settings use it to let you hear a sound.
	once({ sound, volume, vibrate }: AlarmOptions) {
		if (vibrate) navigator.vibrate?.([200, 100, 200]);
		if (sound === 'off') return;

		this.ready();
		const { audio } = this;
		if (!audio) return;
		if (!this.out) {
			this.out = audio.createGain();
			this.out.connect(audio.destination);
		}
		const loud = (Math.min(10, Math.max(1, volume)) / 10) * 0.9;
		for (const note of TONES[sound].notes) play(audio, this.out, TONES[sound], note, loud);
	}

	quiet() {
		if (this.repeat !== undefined) navigator.vibrate?.(0);
		clearInterval(this.repeat);
		this.repeat = undefined;
		this.out?.disconnect();
		this.out = null;
	}

	close() {
		this.quiet();
		void this.audio?.close().catch(() => {});
		this.audio = null;
	}
}
