import { onDestroy } from 'svelte';
import { Alarm, type AlarmOptions } from '../../cook/alarm';
import { cookSecondsLeft } from '../../cook/cook-pages';

export type Timer = { step: number; end: number; rung: boolean };

// A clock that shows seconds must tick more often than each second, or it skips a number.
const TICK_MS = 250;

// The timers of Cook Mode. A timer continues when you go to a different step. A timer that rang
// waits for your "OK", and the alarm is quiet when no timer waits. Make it while the component
// starts, because it has an effect.
export class CookTimers {
	all = $state<Timer[]>([]);
	now = $state(Date.now());
	private readonly alarm = new Alarm();

	constructor(
		private readonly onring: (timer: Timer) => void,
		private readonly sound: () => AlarmOptions
	) {
		$effect(() => {
			if (!this.all.length) return;
			const tick = setInterval(() => {
				this.now = Date.now();
				for (const one of this.all) if (!one.rung && one.end <= this.now) this.ring(one);
			}, TICK_MS);
			return () => clearInterval(tick);
		});
		onDestroy(() => this.alarm.close());
	}

	secondsLeft(timer: Timer) {
		return cookSecondsLeft(timer.end, this.now);
	}

	start(step: number, seconds: number) {
		// This tap is what lets the alarm make sound later.
		this.alarm.ready();
		this.now = Date.now();
		this.all.push({ step, end: this.now + seconds * 1000, rung: false });
	}

	stop(timer: Timer) {
		this.all = this.all.filter((other) => other.step !== timer.step);
		if (!this.all.some((other) => other.rung)) this.alarm.quiet();
	}

	private ring(timer: Timer) {
		timer.rung = true;
		this.onring(timer);
		this.alarm.ring(this.sound());
	}
}
