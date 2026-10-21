<script lang="ts">
	import { onDestroy } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, fly } from 'svelte/transition';
	import { Alarm } from '../../cook/alarm';
	import { getOutGroups, type GetOutGroup } from '../../cook/get-out';
	import { optionsOf, pickFood } from '../../cook/pick-food';
	import { lastNote } from '../../cook/record';
	import { readSteps } from '../../cook/steps';
	import {
		cookGotOutCount,
		cookGotOutOf,
		cookPageCount,
		cookSecondsLeft,
		cookSlideFrom,
		cookTimerClock
	} from '../../cook/cook-pages';
	import type { CookResult } from '../../kitchen/types';
	import type { RecipeEntry } from '../../recipes/types';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { showName } from '../../match/names';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import CookFinish from './CookFinish.svelte';
	import StepPhoto from './StepPhoto.svelte';

	type Props = { kitchen: Kitchen; entry: RecipeEntry; onclose: () => void };
	let { kitchen, entry, onclose }: Props = $props();

	const uid = $props.id();

	const steps = $derived(readSteps(entry.recipe));
	const yourNote = $derived(lastNote(entry.recipe.instructions));
	// The note shows as one line. A tap opens it, and a new page closes it.
	let noteOpen = $state(false);
	// Page 0 is "Get out". Then there is one page for each step. The last page is the finish.
	const last = $derived(cookPageCount(steps.length));
	let page = $state(0);
	const step = $derived(steps[page - 1]);

	// A page comes in from the side to which you go.
	let from = $state(24);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	function go(to: number) {
		from = cookSlideFrom(page, to);
		page = Math.max(0, Math.min(last, to));
		noteOpen = false;
		asking = false;
	}

	// The ingredients that are on the counter. You mark them before you start.
	const ingredients = $derived(entry.match.ingredients);
	let onCounter = $state<boolean[]>([]);
	const gotOut = $derived(cookGotOutCount(onCounter));
	// The list has the groups of the recipe, each with its own count.
	const getOut = $derived(getOutGroups(entry.recipe, ingredients));
	const gotOf = (group: GetOutGroup) => cookGotOutOf(group, onCounter);

	// A line that fits two food items has one selected, and the last page takes the food out of it.
	// Until you tap, the line asks "Which one?".
	const options = $derived(ingredients.map(optionsOf));
	// The selection starts once, with the pantry as it is when Cook Mode opens.
	let picked = $state(
		(() => entry.match.ingredients.map((match) => pickFood(match)?.path ?? null))()
	);
	let checked = $state<boolean[]>([]);
	function pick(at: number, path: string) {
		picked[at] = path;
		checked[at] = true;
		onCounter[at] = true;
	}

	// --- Timers. A timer continues when you go to a different step. ---

	type Timer = { step: number; end: number; rung: boolean };
	let timers = $state<Timer[]>([]);
	let now = $state(Date.now());
	const timer = $derived(timers.find((one) => one.step === page));
	const others = $derived(timers.filter((one) => one.step !== page));

	const secondsLeft = (one: Timer) => cookSecondsLeft(one.end, now);
	const clock = cookTimerClock;

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

	// A timer stops when Cook Mode closes, so a running timer asks first. A timer that rang waits
	// for your "OK", so it counts too.
	let asking = $state(false);
	const question = $derived(
		timers.length === 1
			? '1 timer is running. Exit and stop it?'
			: `${timers.length} timers are running. Exit and stop them?`
	);

	function leave() {
		if (timers.length) asking = true;
		else onclose();
	}

	async function finish(result: CookResult) {
		if (!(await kitchen.cook.finishCooking(entry.path, result))) return;
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
		<Button kind="link" onclick={leave}>Exit</Button>
	</header>

	{#if others.length}
		<HiddenName id="{uid}-timers" text="Timers of other steps" />
		<ul class="wfd-cook__timers" aria-labelledby="{uid}-timers">
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
					<div class="wfd-cook__groups">
						{#each getOut as group}
							<section>
								{#if group.title}
									<GroupHead title={group.title} note={gotOf(group)} />
								{/if}
								<ul class="wfd-cook__list">
									{#each group.rows as { at, match: { ingredient, status } }}
										<li class="wfd-cook__row">
											<label class="wfd-cook__item" class:wfd-cook__item--got={onCounter[at]}>
												<input type="checkbox" bind:checked={onCounter[at]} />
												<span class="wfd-cook__name">{showName(ingredient.name)}</span>
												{#if status === 'missing'}
													<Sticker label="None" kind="dashed" />
												{:else if status === 'short'}
													<Sticker label="Low" kind="amber" />
												{:else if status === 'unknown'}
													<Sticker label="Check" />
												{/if}
												<span class="wfd-cook__amount wfd-number">
													{ingredient.amount?.text ?? ''}
												</span>
											</label>
											{#if options[at].length > 1}
												<div
													class="wfd-cook__pick"
													role="group"
													aria-label="The food item for {showName(ingredient.name)}"
												>
													{#each options[at] as option (option.path)}
														<button
															class="wfd-cook__option"
															class:wfd-cook__option--on={picked[at] === option.path}
															type="button"
															aria-pressed={picked[at] === option.path}
															onclick={() => pick(at, option.path)}
														>
															{option.item.name}
														</button>
													{/each}
													{#if !checked[at]}
														<span out:fade={{ duration }}>
															<Sticker label="Which one?" kind="olive" />
														</span>
													{/if}
												</div>
											{/if}
										</li>
									{/each}
								</ul>
							</section>
						{/each}
					</div>
					{#if !steps.length}
						<p class="wfd-cook__hint">This recipe has no steps.</p>
					{/if}
				{:else if step}
					<p class="wfd-cook__text">{step.text}</p>

					{#if step.ingredients.length}
						<HiddenName id="{uid}-needs" text="Ingredients of this step" />
						<ul class="wfd-cook__needs" aria-labelledby="{uid}-needs">
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

					<StepPhoto
						{step}
						urlOf={(name) => kitchen.photoUrl(name, entry.path)}
						ontake={(photo) => kitchen.cook.addStepPhoto(entry.path, page, photo)}
						onbest={(name) => kitchen.cook.setBestPhoto(entry.path, page, name)}
					/>
				{:else}
					<CookFinish id="{uid}-finish" {entry} {picked} ondone={finish} bind:busy={saving} />
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
	<nav class="wfd-cook__nav" aria-labelledby="{uid}-nav">
		<HiddenName id="{uid}-nav" text="Steps" />
		{#if asking}
			<p class="wfd-cook__question" role="alert">{question}</p>
			<Button kind="danger" onclick={onclose}>Exit</Button>
			<Button kind="olive" onclick={() => (asking = false)}>Keep cooking</Button>
		{:else}
			<!-- On "Get out", the thumb is on "Back" already, so it is a way out too. -->
			<Button onclick={() => (page === 0 ? leave() : go(page - 1))}>← Back</Button>
			{#if page < last}
				<Button kind="olive" onclick={() => go(page + 1)}>
					{page === last - 1 ? 'Finish' : page === 0 ? 'Step 1' : 'Next'} →
				</Button>
			{:else}
				<Button kind="olive" type="submit" form="{uid}-finish" disabled={saving}>
					{saving ? 'One moment' : 'Update the pantry'}
				</Button>
			{/if}
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
		gap: var(--wfd-space-stack);
		block-size: 100%;
		padding: var(--wfd-space-page) var(--wfd-space-page)
			max(var(--safe-area-inset-bottom, 0px), var(--wfd-space-page));
		overflow-x: clip;
		background: var(--wfd-color-frame);
		container-type: inline-size;
	}

	/* On a tab that is too low for the card, the tab scrolls. The frame stays dark there. */
	:global(.view-content.wfd:has(> .wfd-cook)) {
		background: var(--wfd-color-frame);
	}

	.wfd-cook__bar {
		display: flex;
		color: var(--wfd-color-on-frame);
		flex: none;
		gap: var(--wfd-space-section);
		align-items: center;
	}

	.wfd-cook__pieces {
		display: flex;
		flex: 1;
		gap: var(--wfd-space-tight);
	}

	.wfd-cook__piece {
		flex: 1;
		block-size: 6px;
		background: var(--wfd-color-frame-muted);
		transition: background-color var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-cook__piece--done {
		background: var(--wfd-color-on-frame);
	}

	.wfd-cook__piece--now {
		background: var(--wfd-color-primary);
	}

	.wfd-cook__timers {
		display: flex;
		flex: none;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	button.wfd-cook__other {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: baseline;
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-on-frame);
		border-radius: var(--wfd-radius-button);
		background: none;
		box-shadow: none;
		color: var(--wfd-color-on-frame);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid currentcolor;
			outline-offset: 2px;
		}
	}

	button.wfd-cook__other--rung {
		border-color: var(--wfd-color-danger);
		background: var(--wfd-color-danger);
		color: var(--wfd-color-on-danger);
	}

	/* The title and the note keep their place. Only the work between them scrolls. */
	.wfd-cook__card {
		position: relative;
		display: grid;
		flex: 1 0 15rem;
		grid-template-rows: auto minmax(0, 1fr) auto;
		grid-template-columns: minmax(0, 1fr);
		overflow: hidden;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
		color: var(--wfd-color-text);
	}

	/* On a phone, the title and its count are one row, so that the list gets the height. */
	.wfd-cook__side {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-section);
		align-items: baseline;
		justify-content: space-between;
		padding: var(--wfd-space-inset) var(--wfd-space-inset) 0;
	}

	.wfd-cook__recipe {
		flex-basis: 100%;
		margin: 0;
		overflow: hidden;
		color: var(--wfd-color-text-muted);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.wfd-cook__title {
		margin: 0;
		color: var(--wfd-color-text);
		font-size: clamp(2rem, 10cqi, 4.5rem);
		font-weight: 800;
		line-height: var(--wfd-line-height-display);
	}

	.wfd-cook__title--count {
		font-size: clamp(3rem, 15cqi, 5.5rem);
	}

	.wfd-cook__of {
		color: var(--wfd-color-text-faint);
		font-size: 0.45em;
	}

	/*
	 * An ink rule shows at an edge when there is more of the page past that edge. The first two
	 * layers move with the page, and they hide the rule when the page is at its end.
	 */
	.wfd-cook__main {
		display: grid;
		gap: var(--wfd-space-section);
		align-content: start;
		min-block-size: 0;
		padding: var(--wfd-space-inset) var(--wfd-space-inset) var(--wfd-space-inset);
		overflow-y: auto;
		overscroll-behavior: contain;
		background:
			linear-gradient(var(--wfd-color-surface), var(--wfd-color-surface)) top / 100% 3px no-repeat local,
			linear-gradient(var(--wfd-color-surface), var(--wfd-color-surface)) bottom / 100% 3px no-repeat local,
			linear-gradient(var(--wfd-color-border), var(--wfd-color-border)) top / 100% 2px no-repeat scroll,
			linear-gradient(var(--wfd-color-border), var(--wfd-color-border)) bottom / 100% 2px no-repeat scroll;
	}

	/* The space between two groups is here, and not above the head of each group. */
	.wfd-cook__groups {
		display: grid;
		gap: var(--wfd-space-section);
	}

	.wfd-cook__groups :global(.wfd-group) {
		margin-block-start: 0;
	}

	.wfd-cook__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-cook__item {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		gap: var(--wfd-space-section);
		align-items: center;
		min-block-size: 58px;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
		cursor: pointer;
		transition: color var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-cook__row {
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);

		& .wfd-cook__item {
			border-block-end: 0;
		}
	}

	/* The options of a line that fits two food items. The selected one is ink. */
	.wfd-cook__pick {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		align-items: center;
		padding-block-end: var(--wfd-space-inset);
		padding-inline-start: calc(var(--checkbox-size) + var(--wfd-space-section));
	}

	button.wfd-cook__option {
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 600;
		cursor: pointer;
		transition: background-color var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	button.wfd-cook__option--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	.wfd-cook__item--got {
		color: var(--wfd-color-text-faint);
	}

	.wfd-cook__name {
		font-size: var(--wfd-font-size-name);
		font-weight: 500;
	}

	.wfd-cook__amount {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-cook__hint {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	/* Large type: you read the step from a distance, with your hands in the food. */
	.wfd-cook__text {
		margin: 0;
		font-size: clamp(1.6rem, 6.5cqi, 2.75rem);
		font-weight: 600;
		line-height: var(--wfd-line-height-display);
	}

	.wfd-cook__needs {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-cook__need {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: baseline;
		padding: var(--wfd-space-group) var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-sticker);
		font-size: var(--wfd-font-size-text);
		font-weight: 500;
	}

	.wfd-cook__timer {
		display: flex;
		gap: var(--wfd-space-section);
		align-items: center;
		justify-content: space-between;
		padding-block: var(--wfd-space-inset);
		border-block: var(--wfd-border-rule) solid var(--wfd-color-border);
	}

	.wfd-cook__timer--rung {
		border-color: var(--wfd-color-danger);
		color: var(--wfd-color-danger);
		animation: blink calc(4 * var(--wfd-motion-change)) steps(2, jump-none) infinite;
	}

	.wfd-cook__clock {
		font-size: clamp(2.6rem, 14cqi, 4.5rem);
		font-variant-numeric: tabular-nums;
		line-height: var(--wfd-line-height-single);
	}

	/* The note is one line, so that a long note does not take the card. A tap shows all of it. */
	button.wfd-cook__note {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: baseline;
		justify-content: start;
		inline-size: 100%;
		block-size: auto;
		max-block-size: 48px;
		padding: var(--wfd-space-inset) var(--wfd-space-inset);
		overflow: hidden;
		border: 0;
		border-radius: 0;
		background: var(--wfd-color-primary);
		box-shadow: none;
		color: var(--wfd-color-on-primary);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 600;
		line-height: var(--wfd-line-height-text);
		text-align: start;
		cursor: pointer;
		transition: max-block-size var(--wfd-motion-change) var(--wfd-ease-out);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-on-primary);
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
		gap: var(--wfd-space-stack);
	}

	.wfd-cook__question {
		grid-column: 1 / -1;
		margin: 0;
		font-size: var(--wfd-font-size-name);
		font-weight: 700;
		text-align: center;
	}

	.wfd-cook__nav :global(button.wfd-button) {
		block-size: 72px;
		font-size: var(--wfd-font-size-name);
	}

	/* On a wide tab, the title is at the left and the work is at the right. */
	@container (inline-size > 46rem) {
		.wfd-cook__card {
			grid-template-rows: minmax(0, 1fr) auto;
			grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
		}

		.wfd-cook__side {
			display: grid;
			gap: var(--wfd-space-group);
			align-content: start;
			justify-content: stretch;
			padding: calc(2 * var(--wfd-space-section));
			border-inline-end: var(--wfd-border) solid var(--wfd-color-border);
		}

		.wfd-cook__recipe {
			white-space: normal;
		}

		.wfd-cook__main {
			padding: calc(2 * var(--wfd-space-section));
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
</style>
