<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { readSteps } from './cook/steps';
	import CookFinish from './CookFinish.svelte';
	import IngredientList from './IngredientList.svelte';
	import type { CookResult, Kitchen, RecipeEntry } from './kitchen-state.svelte';
	import { showName } from './match/names';
	import type { Ingredient } from './recipemd/types';

	type Props = { kitchen: Kitchen; entry: RecipeEntry; onclose: () => void };
	let { kitchen, entry, onclose }: Props = $props();

	const steps = $derived(readSteps(entry.recipe));
	// Page 0 is the ingredients. Then there is one page for each step. The last page is the finish.
	const last = $derived(steps.length + 1);
	let page = $state(0);
	const step = $derived(steps[page - 1]);
	const label = $derived(
		page === 0 ? 'Ingredients' : step ? `Step ${page} of ${steps.length}` : 'Finish'
	);

	// A page comes in from the side to which you go.
	let from = $state(24);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	function go(to: number) {
		from = to > page ? 24 : -24;
		page = Math.max(0, Math.min(last, to));
	}

	const statuses = $derived(
		new Map(entry.match.ingredients.map((one) => [one.ingredient, one.status]))
	);
	const statusOf = (ingredient: Ingredient) => statuses.get(ingredient);

	// --- Timers. A timer continues when you go to a different step. ---

	type Timer = { step: number; end: number; rung: boolean };
	let timers = $state<Timer[]>([]);
	let now = $state(Date.now());
	const timer = $derived(timers.find((one) => one.step === page));
	const others = $derived(timers.filter((one) => one.step !== page));

	const secondsLeft = (one: Timer) => Math.max(0, Math.ceil((one.end - now) / 1000));
	const clock = (seconds: number) =>
		`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

	function start(seconds: number) {
		now = Date.now();
		timers.push({ step: page, end: now + seconds * 1000, rung: false });
	}
	function stop(one: Timer) {
		timers = timers.filter((other) => other.step !== one.step);
	}

	function ring(one: Timer) {
		one.rung = true;
		kitchen.notify(`${entry.recipe.title}, step ${one.step}: the time is up.`);
		navigator.vibrate?.([300, 150, 300]);
		try {
			const audio = new AudioContext();
			const tone = audio.createOscillator();
			const volume = audio.createGain();
			volume.gain.value = 0.2;
			tone.frequency.value = 880;
			tone.connect(volume).connect(audio.destination);
			tone.start();
			tone.stop(audio.currentTime + 0.8);
		} catch {
			// Some devices give no sound to a page that you did not touch. The notice is sufficient.
		}
	}

	$effect(() => {
		if (!timers.length) return;
		const tick = setInterval(() => {
			now = Date.now();
			for (const one of timers) if (!one.rung && one.end <= now) ring(one);
		}, 250);
		return () => clearInterval(tick);
	});

	// --- The screen stays on while you cook. ---

	$effect(() => {
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

	async function finish(result: CookResult) {
		await kitchen.finishCooking(entry.path, result);
		kitchen.notify('The pantry is correct again.');
		onclose();
	}
</script>

<article class="cook">
	<header class="cook__top">
		<div class="cook__where">
			<h2 class="cook__title">{entry.recipe.title}</h2>
			<p class="cook__page" aria-live="polite">{label}</p>
		</div>
		<button class="cook__button" type="button" onclick={onclose}>Close</button>
		<div class="cook__progress" style:--done={page / last}></div>
	</header>

	{#if others.length}
		<ul class="cook__timers" aria-label="Timers of other steps">
			{#each others as one (one.step)}
				<li>
					<button
						class="cook__button"
						class:cook__button--rung={one.rung}
						type="button"
						onclick={() => go(one.step)}
					>
						Step {one.step} · {one.rung ? 'time is up' : clock(secondsLeft(one))}
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#key page}
		<div class="cook__main" in:fly={{ x: from, duration }}>
			{#if page === 0}
				<IngredientList
					ingredients={entry.recipe.ingredients}
					groups={entry.recipe.groups}
					{statusOf}
				/>
				{#if !steps.length}
					<p class="cook__hint">This recipe has no steps.</p>
				{/if}
			{:else if step}
				<p class="cook__text">{step.text}</p>

				{#if step.ingredients.length}
					<ul class="cook__ingredients" aria-label="Ingredients of this step">
						{#each step.ingredients as ingredient}
							<li class="cook__ingredient">
								{[ingredient.amount?.text, showName(ingredient.name)].filter(Boolean).join(' ')}
							</li>
						{/each}
					</ul>
				{/if}

				{#if timer}
					<div class="cook__timer" class:cook__timer--rung={timer.rung} role="timer">
						<span class="cook__clock">
							{timer.rung ? 'Time is up' : clock(secondsLeft(timer))}
						</span>
						<button class="cook__button" type="button" onclick={() => stop(timer)}>
							{timer.rung ? 'OK' : 'Stop'}
						</button>
					</div>
				{:else if step.seconds}
					{@const seconds = step.seconds}
					<button class="cook__button cook__button--timer" type="button" onclick={() => start(seconds)}>
						Start timer · {clock(seconds)}
					</button>
				{/if}
			{:else}
				<CookFinish {entry} ondone={finish} />
			{/if}
		</div>
	{/key}

	<nav class="cook__nav" aria-label="Steps">
		<button class="cook__step" type="button" disabled={page === 0} onclick={() => go(page - 1)}>
			Back
		</button>
		{#if page < last}
			<button class="cook__step mod-cta" type="button" onclick={() => go(page + 1)}>
				{page === last - 1 ? 'Finish' : 'Next'}
			</button>
		{/if}
	</nav>
</article>

<style>
	.cook {
		display: grid;
		grid-template-rows: auto auto 1fr auto;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--size-4-4);
		min-block-size: 100%;
		container-type: inline-size;
	}

	.cook__top {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--size-4-2) var(--size-4-3);
		align-items: center;
	}

	.cook__title {
		margin: 0;
		font-size: var(--font-ui-medium);
	}

	.cook__page {
		margin: 0;
		color: var(--text-muted);
		font-size: var(--font-ui-small);
	}

	.cook__progress {
		grid-column: 1 / -1;
		block-size: var(--size-2-2);
		border-radius: var(--radius-s);
		background: linear-gradient(var(--interactive-accent) 0 0) no-repeat
			var(--background-modifier-border);
		background-size: calc(var(--done) * 100%) 100%;
		transition: background-size 0.2s ease-out;
	}

	.cook__timers {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-4-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cook__main {
		display: grid;
		gap: var(--size-4-4);
		align-content: start;
	}

	/* Large type: you read the step from a distance, with your hands in the food. */
	.cook__text {
		margin: 0;
		font-size: clamp(1.4rem, 6cqi, 2.4rem);
		line-height: 1.3;
	}

	.cook__hint {
		margin: 0;
		color: var(--text-muted);
	}

	.cook__ingredients {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-4-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cook__ingredient {
		padding: var(--size-4-2) var(--size-4-3);
		border-radius: var(--radius-m);
		background: var(--background-secondary);
		font-size: var(--font-ui-medium);
	}

	.cook__timer {
		display: flex;
		gap: var(--size-4-4);
		align-items: center;
		justify-content: space-between;
		padding: var(--size-4-3) var(--size-4-4);
		border: var(--border-width) solid var(--interactive-accent);
		border-radius: var(--radius-m);
	}

	.cook__timer--rung {
		border-color: var(--text-error);
		animation: pulse 0.8s ease-in-out infinite alternate;
	}

	.cook__clock {
		font-size: 2rem;
		font-variant-numeric: tabular-nums;
	}

	.cook__button {
		min-block-size: 44px;
	}

	.cook__button--timer {
		justify-self: start;
		min-block-size: 56px;
		font-size: var(--font-ui-medium);
	}

	.cook__button--rung {
		color: var(--text-error);
	}

	/* The two buttons are large and stay at the bottom, so that a knuckle can hit them. */
	.cook__nav {
		position: sticky;
		inset-block-end: 0;
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: var(--size-4-3);
		padding-block: var(--size-4-3);
		background: var(--background-primary);
	}

	.cook__step {
		min-block-size: 64px;
		font-size: var(--font-ui-large);
	}

	@keyframes pulse {
		to {
			background: var(--background-modifier-error);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cook__progress {
			transition: none;
		}

		.cook__timer--rung {
			animation: none;
		}
	}
</style>
