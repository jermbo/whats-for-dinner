<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { Alarm } from '../../cook/alarm';
	import { cookFraction, type CookProgress } from '../../cook/cook-pages';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { shiftClock } from '../../occasion/clock';
	import { nextUp, planOf, urgencyOf, type PlanDish } from '../../occasion/cook-plan';
	import type { DaySession, SavedCook } from '../../occasion/day-session';
	import type { Occasion } from '../../occasion/occasions';
	import type { RecipeEntry } from '../../recipes/types';
	import { cover } from '../cover';
	import CookMode from '../cook/CookMode.svelte';
	import type { CookTimers } from '../cook/cook-timers.svelte';
	import { keepScreenOn } from '../keep-screen-on';
	import Button from '../parts/Button.svelte';
	import DayChips, { type DayChip, type DayKey } from './DayChips.svelte';
	import DayGetOut from './DayGetOut.svelte';
	import DayHeader from './DayHeader.svelte';
	import DayNotice from './DayNotice.svelte';
	import { DayClock } from './day-clock.svelte';
	import Schedule from './Schedule.svelte';
	import type { TimerInfo } from './TimerBadge.svelte';
	import Timeline from './Timeline.svelte';

	// The day of an occasion: your dishes in the sequence of their starts, and Cook Mode for each
	// dish that you opened. A dish that you opened stays open behind the screen, with its page, its
	// counter, and its timers, so a swap between dishes loses nothing. A timer shows on its dish, and
	// you stop it inside the dish. The session is saved on this device, so "Exit", or a restart of
	// Obsidian, loses nothing: the occasion screen has "Resume cook day".
	type Props = { kitchen: Kitchen; occasion: Occasion; onclose: () => void };
	let { kitchen, occasion, onclose }: Props = $props();

	const { path } = $derived(occasion);
	const entryOf = (recipe: string | null): RecipeEntry | null =>
		recipe ? (kitchen.recipes.find((entry) => entry.path === recipe) ?? null) : null;

	const plan = $derived(planOf(occasion, entryOf));
	const nameOf = (index: number) => plan.find((one) => one.index === index)?.name ?? '';
	const keyOf = (index: number) => plan.find((one) => one.index === index)?.key;
	// The colours and the alarm are for the day itself. Before it, the screen is a plan to look at.
	const live = $derived(occasion.date === kitchen.today);

	// The saved session, read one time. A dish that is gone from the note, or has its mark, is dropped.
	const session = untrack(() => kitchen.readDaySession(occasion));
	const openOnes = untrack(() =>
		(session?.order ?? []).flatMap((key) => {
			const one = plan.find((dish) => dish.key === key);
			return one?.entry && !one.dish.ready ? [one] : [];
		})
	);
	// What Cook Mode reads when its dish starts. A dish that you finish starts new the next time.
	const restores: Record<string, SavedCook> = {};
	for (const one of openOnes) if (session?.cooks[one.key]) restores[one.key] = session.cooks[one.key];

	let started = $state<number[]>(openOnes.map((one) => one.index));
	const startView = (): DayKey => {
		const view = session?.view ?? 'schedule';
		if (view === 'timeline' || view === 'get-out') return view;
		const one = openOnes.find((dish) => `dish:${dish.key}` === view);
		return one ? one.index : 'schedule';
	};
	let active = $state<DayKey>(startView());
	// What each dish that is open reports, by the place of the dish in the note.
	const timersOf = $state<Record<number, CookTimers>>({});
	const progressOf = $state<Record<number, CookProgress>>({});
	// What Cook Mode keeps for each open dish, by the key of the dish. This is what the session saves.
	const kept = $state<Record<string, SavedCook>>({ ...restores });
	let ticked = $state<Record<string, boolean>>({ ...session?.ticked });

	const clock = new DayClock();
	const alarm = new Alarm();

	// A short wait after the last change, so that a tap on a check does not write at once. "Exit"
	// and a restart write at once.
	const WAIT_MS = 800;
	let latest: DaySession | null = null;
	let wait: ReturnType<typeof setTimeout> | undefined;
	function flush() {
		clearTimeout(wait);
		if (latest) kitchen.writeDaySession(path, latest);
	}
	onDestroy(() => {
		flush();
		alarm.close();
	});

	$effect(() => {
		const order = started.flatMap((index) => keyOf(index) ?? []);
		const view = typeof active === 'number' ? `dish:${keyOf(active) ?? ''}` : active;
		latest = {
			v: 1,
			savedAt: Date.now(),
			view,
			order,
			cooks: Object.fromEntries(order.flatMap((key) => (kept[key] ? [[key, $state.snapshot(kept[key])]] : []))),
			ticked: $state.snapshot(ticked)
		};
		clearTimeout(wait);
		wait = setTimeout(flush, WAIT_MS);
	});

	// The screen stays on, so that the alarm of a start can ring.
	$effect(() => {
		if (kitchen.settings.keepScreenOn) return keepScreenOn();
	});

	const urgency = (one: PlanDish) =>
		live && !one.dish.ready && !started.includes(one.index) ? urgencyOf(one.start, clock.minutes) : 'later';

	const timerInfo = (index: number): TimerInfo[] => {
		const set = timersOf[index];
		return set ? set.all.map((timer) => ({ rung: timer.rung, left: set.secondsLeft(timer), total: timer.seconds })) : [];
	};

	const chips = $derived<DayChip[]>([
		...(['schedule', 'timeline', 'get-out'] as const).map((key) => ({
			key,
			label: key === 'schedule' ? 'Schedule' : key === 'timeline' ? 'Timeline' : 'Get out',
			start: null,
			urgency: 'later' as const,
			cooking: false,
			fraction: 0,
			timers: []
		})),
		...plan
			.filter((one) => one.entry && !one.dish.ready)
			.map((one) => ({
				key: one.index,
				label: one.name,
				start: one.start,
				urgency: urgency(one),
				cooking: started.includes(one.index),
				fraction: progressOf[one.index] ? cookFraction(progressOf[one.index]) : 0,
				timers: timerInfo(one.index)
			}))
	]);

	function show(key: DayKey) {
		active = key;
		if (typeof key === 'number' && !started.includes(key)) started = [...started, key];
	}

	// The dish is finished: its session is over, and a new start of the dish starts new.
	function closeDish(index: number) {
		const key = keyOf(index);
		started = started.filter((one) => one !== index);
		delete timersOf[index];
		delete progressOf[index];
		if (key) {
			delete kept[key];
			delete restores[key];
		}
		active = 'schedule';
	}

	const done = $derived(plan.filter((one) => one.dish.ready).length);
	const next = $derived(nextUp(plan, started, clock.minutes));
	// Fixed starts stay where they are: the serve time moves only the starts that it decided.
	const runLate = () => occasion.serve && void kitchen.occasion.setServe(path, shiftClock(occasion.serve, 15));

	// A dish that is due when the screen opens is late, and the colour tells it. The alarm rings only
	// for a start that comes while the screen is open.
	let handled = $state<number[]>(
		untrack(() => plan.filter((one) => live && urgency(one) === 'due').map((one) => one.index))
	);
	let due = $state<number[]>([]);
	const newlyDue = $derived(
		plan.filter((one) => urgency(one) === 'due' && one.start !== null && !handled.includes(one.index))
	);

	$effect(() => {
		if (!live || !newlyDue.length) return;
		untrack(() => {
			handled = [...handled, ...newlyDue.map((one) => one.index)];
			due = newlyDue.map((one) => one.index);
			alarm.ring(kitchen.settings);
			kitchen.notify(`Time to start ${newlyDue.map((one) => one.name).join(', ')}.`);
		});
	});

	function openDue() {
		const first = plan.find((one) => due.includes(one.index) && one.entry);
		quiet();
		if (first) show(first.index);
	}

	function quiet() {
		alarm.quiet();
		due = [];
	}

	// "Exit" keeps the session. A timer rings only while this screen is open, so a running timer gets
	// a notice, so that it does not surprise you.
	const running = $derived(
		started.reduce((sum, index) => sum + timerInfo(index).filter((one) => !one.rung).length, 0)
	);
	function exit(source: EventTarget | null | undefined) {
		// Write now, so that the occasion screen finds the session when it opens.
		flush();
		if (running) {
			kitchen.notify(
				`${running === 1 ? '1 timer keeps' : `${running} timers keep`} its time. It rings only while Cook day is open.`
			);
		}
		if (source instanceof HTMLElement) cover(source, 'bg', onclose);
		else onclose();
	}
</script>

<!-- A page can make sound only after a touch, so the first touch gives the alarm its sound. -->
<article class="wfd-day" onpointerdowncapture={() => alarm.ready()}>
	<div class="wfd-day__bar">
		<span class="wfd-label">Cook day</span>
		<Button kind="link" onclick={(event) => exit(event.currentTarget)}>Exit</Button>
	</div>

	<DayHeader
		{occasion}
		today={kitchen.today}
		now={clock.minutes}
		{live}
		{done}
		total={plan.length}
		{next}
		compact={typeof active === 'number'}
		onlate={runLate}
	/>

	{#if due.length}
		<DayNotice danger>
			Time to start {due.map(nameOf).join(', ')}
			{#snippet actions()}
				<Button onclick={openDue}>Open</Button>
				<Button onclick={quiet}>OK</Button>
			{/snippet}
		</DayNotice>
	{/if}

	<DayChips {chips} {active} onpick={show} />

	<div class="wfd-day__stage">
		<div class="wfd-day__panel" hidden={active !== 'schedule'}>
			<div class="wfd-day__card">
				<Schedule
					{plan}
					{started}
					progressOf={(index) => progressOf[index]}
					timersOf={timerInfo}
					urgencyOf={urgency}
					onopen={show}
					onready={(index, ready) => kitchen.occasion.setReady(path, index, ready)}
				/>
			</div>
		</div>

		<div class="wfd-day__panel" hidden={active !== 'timeline'}>
			<div class="wfd-day__card">
				<Timeline
					{plan}
					serve={occasion.serve}
					now={clock.minutes}
					{live}
					{started}
					urgencyOf={urgency}
					onopen={show}
				/>
			</div>
		</div>

		<div class="wfd-day__panel" hidden={active !== 'get-out'}>
			<div class="wfd-day__card"><DayGetOut {plan} bind:ticked /></div>
		</div>

		{#each started as index (index)}
			{@const one = plan.find((dish) => dish.index === index)}
			{#if one?.entry}
				<div class="wfd-day__panel" hidden={active !== index}>
					<CookMode
						{kitchen}
						entry={one.entry}
						scale={one.dish.scale}
						dish={{ occasion: path, index }}
						restore={restores[one.key] ?? null}
						onsave={(saved) => (kept[one.key] = saved)}
						onleave={() => (active = 'schedule')}
						onclose={() => closeDish(index)}
						ontimers={(set) => (timersOf[index] = set)}
						onprogress={(progress) => (progressOf[index] = progress)}
					/>
				</div>
			{/if}
		{/each}
	</div>
</article>

<style>
	/* Cook day has the dark frame of Cook Mode, so that the two read as one. */
	.wfd-day {
		display: flex;
		flex-direction: column;
		gap: var(--wfd-space-stack);
		block-size: 100%;
		padding: var(--wfd-space-page) var(--wfd-space-page) 0;
		overflow-x: clip;
		background: var(--wfd-color-frame);
		color: var(--wfd-color-on-frame);
		container-type: inline-size;
	}

	:global(.view-content.wfd:has(> .wfd-day)) {
		background: var(--wfd-color-frame);
	}

	.wfd-day__bar {
		display: flex;
		flex: none;
		gap: var(--wfd-space-section);
		align-items: center;
		justify-content: space-between;
	}

	/* The stage has the height that is left. Cook Mode keeps its two buttons at the foot of it. */
	.wfd-day__stage {
		flex: 1;
		min-block-size: 0;
	}

	.wfd-day__panel {
		block-size: 100%;
		min-block-size: 0;
		overflow-y: auto;

		&[hidden] {
			display: none;
		}

		/* Cook Mode has the padding of the frame already, so here it gives its side back. */
		& > :global(.wfd-cook) {
			margin-inline: calc(-1 * var(--wfd-space-page));
			padding-block-start: 0;
		}
	}

	/* Cook Mode keeps room for its buttons. The views need the same room at their foot. */
	.wfd-day__card {
		margin-block-end: calc(max(var(--safe-area-inset-bottom, 0px), var(--wfd-space-page)) + var(--wfd-space-bar));
		padding: var(--wfd-space-inset);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
		color: var(--wfd-color-text);
	}
</style>
