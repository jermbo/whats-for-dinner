import { minutesNow } from '../../occasion/clock';

// The hour on the device, as minutes from midnight. It changes while the screen is open, so the
// colours and the alarm of "Cook day" follow the day. Make it while the component starts, because
// it has an effect.
const TICK_MS = 15_000;

export class DayClock {
	minutes = $state(minutesNow());

	constructor() {
		$effect(() => {
			const tick = setInterval(() => (this.minutes = minutesNow()), TICK_MS);
			return () => clearInterval(tick);
		});
	}
}
