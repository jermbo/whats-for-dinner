<script lang="ts">
	import { onDestroy } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { Alarm } from '../../cook/alarm';
	import { lastNote } from '../../cook/record';
	import { readSteps } from '../../cook/steps';
	import type { CookResult, Kitchen, RecipeEntry } from '../../kitchen-state.svelte';
	import { showName } from '../../match/names';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import CookFinish from './CookFinish.svelte';

	type Props = { kitchen: Kitchen; entry: RecipeEntry; onclose: () => void };
	let { kitchen, entry, onclose }: Props = $props();

	const uid = $props.id();

	const steps = $derived(readSteps(entry.recipe));
	const yourNote = $derived(lastNote(entry.recipe.instructions));
	// The note shows as one line. A tap opens it, and a new page closes it.
	let noteOpen = $state(false);
	// Page 0 is "Get out". Then there is one page for each step. The last page is the finish.
	const last = $derived(steps.length + 1);
	let page = $state(0);
	const step = $derived(steps[page - 1]);

	// A page comes in from the side to which you go.
	let from = $state(24);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	function go(to: number) {
		from = to > page ? 24 : -24;
		page = Math.max(0, Math.min(last, to));
		noteOpen = false;
	}

	// The ingredients that are on the counter. You mark them before you start.
	const ingredients = $derived(entry.match.ingredients);
	let onCounter = $state<boolean[]>([]);
	const gotOut = $derived(ingredients.filter((_, at) => onCounter[at]).length);

	// --- Timers. A timer continues when you go to a different step. ---

	type Timer = { step: number; end: number; rung: boolean };
	let timers = $state<Timer[]>([]);
	let now = $state(Date.now());
	const timer = $derived(timers.find((one) => one.step === page));
	const others = $derived(timers.filter((one) => one.step !== page));

	const secondsLeft = (one: Timer) => Math.max(0, Math.ceil((one.end - now) / 1000));
	const clock = (seconds: number) =>
		`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

	const alarm = new Alarm();
	onDestroy(() => alarm.close());

	function start(seconds: number) {
		// This tap is what lets the alarm make sound later.
		alarm.ready();
		now = Date.now();
		timers.push({ step: page, end: now + seconds * 1000, rung: false });
	}
	// The alarm is quiet when no timer waits for your "OK".
	function stop(one: Timer) {
		timers = timers.filter((other) => other.step !== one.step);
		if (!timers.some((other) => other.rung)) alarm.quiet();
	}

	function ring(one: Timer) {
		one.rung = true;
		kitchen.notify(`${entry.recipe.title}, step ${one.step}: the time is up.`);
		alarm.ring(kitchen.settings);
	}

	$effect(() => {
		if (!timers.length) return;
		const tick = setInterval(() => {
			now = Date.now();
			for (const one of timers) if (!one.rung && one.end <= now) ring(one);
		}, 250);
		return () => clearInterval(tick);
	});

	// --- The screen stays on while you cook, if the settings say so. ---

	$effect(() => {
		if (!kitchen.settings.keepScreenOn) return;
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
	});

	let saving = $state(false);

	async function finish(result: CookResult) {
		await kitchen.finishCooking(entry.path, result);
		kitchen.notify('The pantry is correct again.');
		onclose();
	}
</script>

<article class="wfd-cook">
	<header class="wfd-cook__bar">
		<!-- One piece for each page. The page where you are is olive. -->
		<div class="wfd-cook__pieces" aria-hidden="true">
			{#each { length: last + 1 }, at}
				<span
					class="wfd-cook__piece"
					class:wfd-cook__piece--done={at < page}
					class:wfd-cook__piece--now={at === page}
				></span>
			{/each}
		</div>
		<button class="wfd-cook__exit" type="button" onclick={onclose}>Exit</button>
	</header>

	{#if others.length}
		<ul class="wfd-cook__timers" aria-label="Timers of other steps">
			{#each others as one (one.step)}
				<li>
					<button
						class="wfd-cook__other"
						class:wfd-cook__other--rung={one.rung}
						type="button"
						onclick={() => go(one.step)}
					>
						<span class="wfd-label">Step {one.step}</span>
						<span class="wfd-display">{one.rung ? 'Time is up' : clock(secondsLeft(one))}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#key page}
		<div class="wfd-cook__card" in:fly={{ x: from, duration }}>
			<div class="wfd-cook__side">
				<p class="wfd-cook__recipe wfd-label">{entry.recipe.title}</p>
				{#if page === 0}
					<h2 class="wfd-cook__title wfd-display">Get out</h2>
					<Count have={gotOut} of={ingredients.length} label="on the counter" />
				{:else if step}
					<h2 class="wfd-cook__title wfd-cook__title--count wfd-display" aria-live="polite">
						<span class="wfd-cook__number">{page}</span><span class="wfd-cook__of"
							>/{steps.length}</span
						>
					</h2>
				{:else}
					<h2 class="wfd-cook__title wfd-display">Done.</h2>
				{/if}
			</div>

			<div class="wfd-cook__main">
				{#if page === 0}
					<ul class="wfd-cook__list">
						{#each ingredients as { ingredient, status }, at}
							<li>
								<label class="wfd-cook__item" class:wfd-cook__item--got={onCounter[at]}>
									<input type="checkbox" bind:checked={onCounter[at]} />
									<span class="wfd-cook__name">{showName(ingredient.name)}</span>
									{#if status === 'missing'}
										<Sticker label="None" kind="dashed" />
									{:else if status === 'short'}
										<Sticker label="Low" kind="amber" />
									{/if}
									<span class="wfd-cook__amount wfd-number">{ingredient.amount?.text ?? ''}</span>
								</label>
							</li>
						{/each}
					</ul>
					{#if !steps.length}
						<p class="wfd-cook__hint">This recipe has no steps.</p>
					{/if}
				{:else if step}
					<p class="wfd-cook__text">{step.text}</p>

					{#if step.ingredients.length}
						<ul class="wfd-cook__needs" aria-label="Ingredients of this step">
							{#each step.ingredients as ingredient}
								<li class="wfd-cook__need">
									<span class="wfd-number">{ingredient.amount?.text ?? ''}</span>
									{showName(ingredient.name)}
								</li>
							{/each}
						</ul>
					{/if}

					{#if timer || step.seconds}
						<div class="wfd-cook__timer" class:wfd-cook__timer--rung={timer?.rung} role="timer">
							<span class="wfd-cook__clock wfd-number">
								{#if timer}
									{timer.rung ? 'Time is up' : clock(secondsLeft(timer))}
								{:else}
									{clock(step.seconds ?? 0)}
								{/if}
							</span>
							{#if timer}
								<Button onclick={() => stop(timer)}>{timer.rung ? 'OK' : 'Stop'}</Button>
							{:else}
								<Button kind="main" onclick={() => start(step.seconds ?? 0)}>Start</Button>
							{/if}
						</div>
					{/if}
				{:else}
					<CookFinish id="{uid}-finish" {entry} ondone={finish} bind:busy={saving} />
				{/if}
			</div>

			{#if yourNote && page < last}
				<button
					class="wfd-cook__note"
					class:wfd-cook__note--open={noteOpen}
					type="button"
					aria-expanded={noteOpen}
					onclick={() => (noteOpen = !noteOpen)}
				>
					<span class="wfd-label">Your note</span>
					<span class="wfd-cook__note-text">{yourNote}</span>
				</button>
			{/if}
		</div>
	{/key}

	<!-- The two buttons have the same size and the same place on each page. -->
	<nav class="wfd-cook__nav" aria-label="Steps">
		<Button disabled={page === 0} onclick={() => go(page - 1)}>← Back</Button>
		{#if page < last}
			<Button kind="olive" onclick={() => go(page + 1)}>
				{page === last - 1 ? 'Finish' : page === 0 ? 'Step 1' : 'Next'} →
			</Button>
		{:else}
			<Button kind="olive" type="submit" form="{uid}-finish" disabled={saving}>
				{saving ? 'One moment' : 'Update the pantry'}
			</Button>
		{/if}
	</nav>
</article>

<style>
	/*
	 * Cook Mode is a white card in a dark frame, so that the step is the only thing in view. The
	 * frame has the height of the tab: the card takes the space that is left, and a long page
	 * scrolls inside the card. Thus the two buttons do not move.
	 */
	.wfd-cook {
		display: flex;
		flex-direction: column;
		gap: 12px;
		block-size: 100%;
		padding: 12px 12px max(var(--safe-area-inset-bottom, 0px), 12px);
		overflow-x: clip;
		background: var(--wfd-frame);
		container-type: inline-size;
	}

	/* On a tab that is too low for the card, the tab scrolls. The frame stays dark there. */
	:global(.view-content.wfd:has(> .wfd-cook)) {
		background: var(--wfd-frame);
	}

	.wfd-cook__bar {
		display: flex;
		flex: none;
		gap: 16px;
		align-items: center;
	}

	.wfd-cook__pieces {
		display: flex;
		flex: 1;
		gap: 4px;
	}

	.wfd-cook__piece {
		flex: 1;
		block-size: 6px;
		background: #4a463f;
		transition: background-color 0.2s ease-out;
	}

	.wfd-cook__piece--done {
		background: #eceae2;
	}

	.wfd-cook__piece--now {
		background: var(--wfd-olive);
	}

	button.wfd-cook__exit {
		block-size: auto;
		min-block-size: 44px;
		padding: 0 4px;
		border: 0;
		background: none;
		box-shadow: none;
		color: #eceae2;
		font-family: inherit;
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
		}
	}

	.wfd-cook__timers {
		display: flex;
		flex: none;
		flex-wrap: wrap;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	button.wfd-cook__other {
		display: flex;
		gap: 10px;
		align-items: baseline;
		block-size: auto;
		min-block-size: 44px;
		padding: 0 12px;
		border: 2px solid #eceae2;
		border-radius: var(--wfd-radius-button);
		background: none;
		box-shadow: none;
		color: #eceae2;
		font-family: inherit;
		font-size: 16px;
		cursor: pointer;
	}

	button.wfd-cook__other--rung {
		border-color: var(--wfd-tomato);
		background: var(--wfd-tomato);
		color: #fff;
	}

	/* The title and the note keep their place. Only the work between them scrolls. */
	.wfd-cook__card {
		display: grid;
		flex: 1 0 15rem;
		grid-template-rows: auto minmax(0, 1fr) auto;
		grid-template-columns: minmax(0, 1fr);
		overflow: hidden;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-card);
		color: var(--wfd-ink);
	}

	/* On a phone, the title and its count are one row, so that the list gets the height. */
	.wfd-cook__side {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
		align-items: baseline;
		justify-content: space-between;
		padding: 16px 20px 0;
	}

	.wfd-cook__recipe {
		flex-basis: 100%;
		margin: 0;
		overflow: hidden;
		color: var(--wfd-ink-2);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.wfd-cook__title {
		margin: 0;
		color: var(--wfd-ink);
		font-size: clamp(2rem, 10cqi, 4.5rem);
		font-weight: 800;
		line-height: 1.05;
	}

	.wfd-cook__title--count {
		font-size: clamp(3rem, 15cqi, 5.5rem);
	}

	.wfd-cook__of {
		color: var(--wfd-ink-3);
		font-size: 0.45em;
	}

	/*
	 * An ink rule shows at an edge when there is more of the page past that edge. The first two
	 * layers move with the page, and they hide the rule when the page is at its end.
	 */
	.wfd-cook__main {
		display: grid;
		gap: 18px;
		align-content: start;
		min-block-size: 0;
		padding: 16px 20px 20px;
		overflow-y: auto;
		overscroll-behavior: contain;
		background:
			linear-gradient(var(--wfd-card), var(--wfd-card)) top / 100% 3px no-repeat local,
			linear-gradient(var(--wfd-card), var(--wfd-card)) bottom / 100% 3px no-repeat local,
			linear-gradient(var(--wfd-ink), var(--wfd-ink)) top / 100% 2px no-repeat scroll,
			linear-gradient(var(--wfd-ink), var(--wfd-ink)) bottom / 100% 2px no-repeat scroll;
	}

	.wfd-cook__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-cook__item {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		gap: 14px;
		align-items: center;
		min-block-size: 58px;
		border-block-end: 1px solid var(--wfd-line);
		cursor: pointer;
		transition: color 0.2s ease-out;
	}

	.wfd-cook__item--got {
		color: var(--wfd-ink-3);
	}

	.wfd-cook__name {
		font-size: 20px;
		font-weight: 500;
	}

	.wfd-cook__amount {
		font-size: 18px;
	}

	.wfd-cook__hint {
		margin: 0;
		color: var(--wfd-ink-2);
	}

	/* Large type: you read the step from a distance, with your hands in the food. */
	.wfd-cook__text {
		margin: 0;
		font-size: clamp(1.6rem, 6.5cqi, 2.75rem);
		font-weight: 600;
		line-height: 1.2;
	}

	.wfd-cook__needs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-cook__need {
		display: flex;
		gap: 8px;
		align-items: baseline;
		padding: 8px 12px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-sticker);
		font-size: 17px;
		font-weight: 500;
	}

	.wfd-cook__timer {
		display: flex;
		gap: 16px;
		align-items: center;
		justify-content: space-between;
		padding-block: 10px;
		border-block: var(--wfd-rule-4) solid var(--wfd-ink);
	}

	.wfd-cook__timer--rung {
		border-color: var(--wfd-tomato);
		color: var(--wfd-tomato);
		animation: blink 0.8s steps(2, jump-none) infinite;
	}

	.wfd-cook__clock {
		font-size: clamp(2.6rem, 14cqi, 4.5rem);
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	/* The note is one line, so that a long note does not take the card. A tap shows all of it. */
	button.wfd-cook__note {
		display: flex;
		gap: 12px;
		align-items: baseline;
		justify-content: start;
		inline-size: 100%;
		block-size: auto;
		max-block-size: 48px;
		padding: 12px 20px;
		overflow: hidden;
		border: 0;
		border-radius: 0;
		background: var(--wfd-olive);
		box-shadow: none;
		color: var(--wfd-on-olive);
		font-family: inherit;
		font-size: 17px;
		font-weight: 600;
		line-height: 24px;
		text-align: start;
		cursor: pointer;
		transition: max-block-size 0.2s ease-out;

		&:focus-visible {
			outline: 2px solid var(--wfd-on-olive);
			outline-offset: -4px;
		}
	}

	.wfd-cook__note-text {
		min-inline-size: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	button.wfd-cook__note--open {
		max-block-size: 14rem;
		overflow-y: auto;
		overscroll-behavior: contain;

		.wfd-cook__note-text {
			overflow: visible;
			white-space: normal;
		}
	}

	/* The two buttons are large, so that a knuckle can hit them. */
	.wfd-cook__nav {
		display: grid;
		flex: none;
		grid-template-columns: 1fr 2fr;
		gap: 12px;
	}

	.wfd-cook__nav :global(button.wfd-button) {
		block-size: 72px;
		font-size: 19px;
	}

	/* On a wide tab, the title is at the left and the work is at the right. */
	@container (inline-size > 46rem) {
		.wfd-cook__card {
			grid-template-rows: minmax(0, 1fr) auto;
			grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
		}

		.wfd-cook__side {
			display: grid;
			gap: 6px;
			align-content: start;
			justify-content: stretch;
			padding: 32px;
			border-inline-end: 2px solid var(--wfd-ink);
		}

		.wfd-cook__recipe {
			white-space: normal;
		}

		.wfd-cook__main {
			padding: 32px;
		}

		.wfd-cook__note {
			grid-column: 1 / -1;
		}
	}

	@keyframes blink {
		50% {
			opacity: 0.35;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-cook__piece,
		.wfd-cook__item,
		button.wfd-cook__note {
			transition: none;
		}

		.wfd-cook__timer--rung {
			animation: none;
		}
	}
</style>
