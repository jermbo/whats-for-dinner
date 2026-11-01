<script lang="ts">
	import { fly } from 'svelte/transition';
	import { pickFood } from '../../cook/pick-food';
	import { lastNote } from '../../cook/record';
	import { readSteps } from '../../cook/steps';
	import {
		cookGotOutCount,
		cookPageCount,
		cookSlideFrom,
		cookTimerClock
	} from '../../cook/cook-pages';
	import type { CookedDish } from '../../kitchen/cook-actions';
	import type { CookResult } from '../../kitchen/types';
	import type { RecipeEntry } from '../../recipes/types';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { showName } from '../../match/names';
	import { cover } from '../cover';
	import { keepScreenOn } from '../keep-screen-on';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import { tokenTime } from '../motion';
	import { CookTimers } from './cook-timers.svelte';
	import CookFinish from './CookFinish.svelte';
	import GetOut from './GetOut.svelte';
	import StepPhoto from './StepPhoto.svelte';

	// A dish of an occasion has a scale, such as 2, and the end of the meal marks it in its note.
	type Props = {
		kitchen: Kitchen;
		entry: RecipeEntry;
		scale?: number;
		dish?: CookedDish | null;
		onclose: () => void;
	};
	let { kitchen, entry, scale = 1, dish = null, onclose }: Props = $props();

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
	const duration = $derived(tokenTime('change'));
	function go(to: number) {
		from = cookSlideFrom(page, to);
		page = Math.max(0, Math.min(last, to));
		noteOpen = false;
		asking = false;
	}

	// The ingredients that are on the counter, and the food item of each line. They stay here, so
	// that they stay when "Get out" closes for a step.
	const ingredients = $derived(entry.match.ingredients);
	let onCounter = $state<boolean[]>([]);
	const gotOut = $derived(cookGotOutCount(onCounter));
	// The selection starts once, with the pantry as it is when Cook Mode opens.
	let picked = $state(
		(() => entry.match.ingredients.map((match) => pickFood(match)?.path ?? null))()
	);
	let checked = $state<boolean[]>([]);

	const timers = new CookTimers(
		(timer) => kitchen.notify(`${showName(entry.recipe.title)}, step ${timer.step}: the time is up.`),
		() => kitchen.settings
	);
	const timer = $derived(timers.all.find((one) => one.step === page));
	const others = $derived(timers.all.filter((one) => one.step !== page));

	// The screen stays on while you cook, if the settings say so.
	$effect(() => {
		if (kitchen.settings.keepScreenOn) return keepScreenOn();
	});

	let saving = $state(false);

	// A timer stops when Cook Mode closes, so a running timer asks first. A timer that rang waits
	// for your "OK", so it counts too.
	let asking = $state(false);
	const question = $derived(
		timers.all.length === 1
			? '1 timer is running. Exit and stop it?'
			: `${timers.all.length} timers are running. Exit and stop them?`
	);

	// Cook Mode closes with a circle of paper from the button, as "Cook" opened it with a dark one.
	const closeFrom = (source: EventTarget | null | undefined) =>
		source instanceof HTMLElement ? cover(source, 'bg', onclose) : onclose();

	function leave(event: MouseEvent) {
		if (timers.all.length) asking = true;
		else closeFrom(event.currentTarget);
	}

	let nav = $state<HTMLElement>();
	async function finish(result: CookResult) {
		if (!(await kitchen.cook.finishCooking(entry.path, result, dish))) return;
		kitchen.notify('The pantry is correct again.');
		closeFrom(nav?.querySelector('button[type="submit"]'));
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
						<span class="wfd-display">
							{one.rung ? 'Time is up' : cookTimerClock(timers.secondsLeft(one))}
						</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#key page}
		<div class="wfd-cook__card" in:fly={{ x: from, duration }}>
			<div class="wfd-cook__side">
				<p class="wfd-cook__recipe wfd-label">
					{showName(entry.recipe.title)}
					<!-- You know how to make two pies: the amounts of the steps stay as the recipe has them. -->
					{#if scale !== 1}<span class="wfd-cook__scale wfd-number">×{scale}</span>{/if}
				</p>
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
					<GetOut {entry} {duration} bind:onCounter bind:picked bind:checked />
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
									{timer.rung ? 'Time is up' : cookTimerClock(timers.secondsLeft(timer))}
								{:else}
									{cookTimerClock(step.seconds ?? 0)}
								{/if}
							</span>
							{#if timer}
								<Button onclick={() => timers.stop(timer)}>{timer.rung ? 'OK' : 'Stop'}</Button>
							{:else}
								<Button kind="main" onclick={() => timers.start(page, step.seconds ?? 0)}>Start</Button>
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
					<CookFinish id="{uid}-finish" {entry} {picked} {scale} ondone={finish} bind:busy={saving} />
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
	<nav class="wfd-cook__nav" aria-labelledby="{uid}-nav" bind:this={nav}>
		<HiddenName id="{uid}-nav" text="Steps" />
		{#if asking}
			<p class="wfd-cook__question" role="alert">{question}</p>
			<Button kind="danger" onclick={(event) => closeFrom(event.currentTarget)}>Exit</Button>
			<Button kind="olive" onclick={() => (asking = false)}>Keep cooking</Button>
		{:else}
			<!-- On "Get out", the thumb is on "Back" already, so it is a way out too. -->
			<Button onclick={(event) => (page === 0 ? leave(event) : go(page - 1))}>← Back</Button>
			{#if page < last}
				<Button kind="olive" onclick={() => go(page + 1)}>
					{page === last - 1 ? 'Finish' : page === 0 ? 'Step 1' : 'Next'}
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
			calc(max(var(--safe-area-inset-bottom, 0px), var(--wfd-space-page)) + var(--wfd-space-bar));
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

	/* The piece of the step that you go to fills from the left, so the bar tells the move too. */
	.wfd-cook__piece--now {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: var(--wfd-color-primary);
			transform-origin: left;
			animation: wfd-cook-fill var(--wfd-card-motion) backwards;
		}
	}

	@keyframes wfd-cook-fill {
		from {
			scale: 0 1;
		}
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
			outline-offset: var(--wfd-focus-offset);
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

	.wfd-cook__scale {
		margin-inline-start: var(--wfd-space-group);
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-name);
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
			outline-offset: var(--wfd-focus-inset);
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
