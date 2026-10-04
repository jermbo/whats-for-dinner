<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { useClock } from '$lib/clock.svelte';
	import { cookCards } from '$lib/data/cook-cards';
	import { cook, visitCard } from '$lib/data/cooking';
	import { notesByStep } from '$lib/data/step-notes';
	import { stopTimer } from '$lib/data/timers';
	import { db } from '$lib/db/db';
	import { cardSides } from '$lib/input/card-sides';
	import { keepScreenOn } from '$lib/input/wake-lock';
	import { live } from '$lib/live.svelte';
	import { turnPage } from '$lib/motion/transitions';
	import { chime, unlockSound } from '$lib/sound/chime';
	import { status } from '$lib/status.svelte';
	import { indexBy } from '$lib/util/collections';
	import CookFinishedCard from './CookFinishedCard.svelte';
	import CookIngredientsCard from './CookIngredientsCard.svelte';
	import CookStepCard from './CookStepCard.svelte';
	import TimerChips from './TimerChips.svelte';

	/** A timer that ended this long ago, or less, makes its sound. An older one is only "Done". */
	const RING_WINDOW_MS = 3000;

	/**
	 * Cook mode: a recipe as a row of cards, one card on the screen at a time. The owner cooks
	 * with wet hands, so the text is large and one tap goes to the next card.
	 * It is a modal dialog: it covers the navigation and keeps the focus. The screen stays on.
	 * The cook session records each card that the owner opens. So the app keeps the place of
	 * the owner, and the insights get the real time of each step.
	 * @type {{ id: string }} The ID of the cook session.
	 */
	let { id } = $props();

	const uid = $props.id();

	const session = live(() => db.sessions.get(id), undefined);
	const recipe = live(async () => {
		const current = await db.sessions.get(id);
		return current && db.recipes.get(current.recipeId);
	}, undefined);
	/** All cook sessions of the recipe. Their notes show on the steps. */
	const cooks = live(async () => {
		const current = await db.sessions.get(id);
		return current ? db.sessions.where('recipeId').equals(current.recipeId).toArray() : [];
	}, []);
	const ingredients = live(() => db.ingredients.toArray(), []);
	const pantry = live(() => db.pantry.toArray(), []);
	const clock = useClock();

	const ingredientsById = $derived(indexBy(ingredients.current, 'id'));
	const pantryByIngredient = $derived(indexBy(pantry.current, 'ingredientId'));
	const notes = $derived(notesByStep(cooks.current));

	const cards = $derived(recipe.current ? cookCards(recipe.current) : []);
	/** The number of each step, by its ID. */
	const numbers = $derived(
		new Map(cards.flatMap((card) => (card.kind === 'step' ? [[card.key, card.number]] : [])))
	);
	const total = $derived(numbers.size);

	let index = $state(0);
	/** 1: the owner goes to the next card. -1: the owner goes back. */
	let direction = $state(1);
	/** True after "Cooked", until the next page opens. */
	let finishing = $state(false);
	const card = $derived(cards[Math.min(index, cards.length - 1)]);

	const label = $derived.by(() => {
		if (!card) return '';
		if (card.kind === 'ingredients') return 'Ingredients';
		return card.kind === 'step' ? `Step ${card.number} of ${total}` : 'Finished';
	});

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();

	$effect(() => {
		if (dialog && !dialog.open) dialog.showModal();
	});

	onMount(() => keepScreenOn());

	/**
	 * The database needs a moment to give the cook session. The message "not on this device"
	 * shows only after that moment, so that it does not flash when Cook mode opens.
	 */
	let waited = $state(false);
	onMount(() => {
		const timer = setTimeout(() => (waited = true), 800);
		return () => clearTimeout(timer);
	});

	/**
	 * The owner comes back to the card of the last visit. This occurs one time, and the cards
	 * show only after it: Cook mode does not open on the first card and then jump.
	 */
	let placed = $state(false);
	$effect(() => {
		if (placed || !session.current || cards.length === 0) return;
		const last = session.current.visits.at(-1)?.card;
		const place = Math.max(
			0,
			cards.findIndex((item) => item.key === last)
		);
		index = place;
		placed = true;
		visitCard(id, cards[place].key);
	});

	/** @param {number} target */
	function show(target) {
		if (target < 0 || target >= cards.length || target === index) return;
		direction = target > index ? 1 : -1;
		index = target;
		visitCard(id, cards[target].key);
	}

	/** @param {string} key */
	const open = (key) => show(cards.findIndex((item) => item.key === key));

	/**
	 * The IDs of the timers that made their sound. It is a plain object, because the screen
	 * does not show it.
	 * @type {Record<string, true>}
	 */
	const rung = {};
	$effect(() => {
		const now = clock.now;
		for (const timer of session.current?.timers ?? []) {
			const end = Date.parse(timer.endsAt);
			if (end > now || rung[timer.id]) continue;
			rung[timer.id] = true;
			if (now - end > RING_WINDOW_MS) continue;
			chime();
			navigator.vibrate?.([200, 100, 200]);
		}
	});

	/** The owner leaves Cook mode. The cook session stays open, so the meal shows "Continue". */
	function leave() {
		// Back to the page that opened Cook mode: the Today screen or the page of the recipe.
		// A tab that opened Cook mode directly has no page before it.
		if (history.length > 1) history.back();
		else goto(resolve('/'));
	}

	async function finish() {
		const current = session.current;
		if (!current || finishing) return;
		finishing = true;
		try {
			const sessionId = await cook(current.menuItem);
			goto(resolve('/sessions/[id]', { id: sessionId }));
		} catch (error) {
			finishing = false;
			status.say(error instanceof Error ? error.message : 'The app cannot save this meal.');
		}
	}

	/** @param {Event} event */
	function cancel(event) {
		// The Escape key leaves Cook mode in the same way as the button.
		event.preventDefault();
		if (event.target === dialog) leave();
	}

	/** @param {KeyboardEvent} event */
	function keys(event) {
		// In a text field, the arrow keys move the cursor. In a dialog on the card, such as the
		// photos of a step, they move between its buttons.
		const target = event.target;
		if (!(target instanceof Element) || target.closest('input, textarea, [data-controls]')) return;
		if (event.key === 'ArrowRight') show(index + 1);
		if (event.key === 'ArrowLeft') show(index - 1);
	}
</script>

<svelte:head>
	<title>{recipe.current ? `Cook: ${recipe.current.name}` : 'Cook'} · Larder</title>
</svelte:head>

<dialog
	class="cook"
	bind:this={dialog}
	aria-labelledby="{uid}-title"
	oncancel={cancel}
	onkeydown={keys}
	onpointerdown={unlockSound}
>
	{#if placed && session.current && recipe.current && card && (!session.current.cookedAt || finishing)}
		{@const current = session.current}
		<div class="cook__inner">
			<header class="cook__head">
				<button class="cook__leave" type="button" onclick={leave}>
					<Icon name="close" />
					<span class="visually-hidden">Leave Cook mode. The app keeps your place.</span>
				</button>
				<div class="cook__title">
					<h1 class="cook__name" id="{uid}-title">{recipe.current.name}</h1>
					<p class="cook__place" aria-live="polite">{label}</p>
				</div>
			</header>

			<div class="cook__progress" aria-hidden="true">
				{#each cards as item, at (item.key)}
					<span
						class={[
							'cook__mark',
							at < index && 'cook__mark--done',
							at === index && 'cook__mark--current'
						]}
					></span>
				{/each}
			</div>

			<TimerChips
				timers={current.timers}
				{numbers}
				now={clock.now}
				onopen={open}
				ondone={(timer) => stopTimer(id, timer.id)}
			/>

			<div
				class="cook__body"
				{@attach cardSides({ onnext: () => show(index + 1), onback: () => show(index - 1) })}
			>
				{#key card.key}
					<div
						class="cook__card"
						in:turnPage={{ direction }}
						out:turnPage={{ direction, leave: true }}
					>
						{#if card.kind === 'ingredients'}
							<CookIngredientsCard
								recipe={recipe.current}
								session={current}
								{ingredientsById}
								{pantryByIngredient}
							/>
						{:else if card.kind === 'step'}
							<CookStepCard
								recipe={recipe.current}
								step={card.step}
								number={card.number}
								session={current}
								notes={notes.get(card.key) ?? []}
								{ingredientsById}
								now={clock.now}
							/>
						{:else}
							<CookFinishedCard session={current} />
						{/if}
					</div>
				{/key}
			</div>

			<p class="cook__status" role="status">{status.message}</p>

			<footer class="cook__foot">
				<button
					class="button cook__step"
					type="button"
					disabled={index === 0}
					onclick={() => show(index - 1)}
				>
					<Icon name="back" />
					Back
				</button>
				{#if card.kind === 'finished'}
					<button
						class="button button--strong cook__step cook__step--main"
						type="button"
						disabled={finishing}
						onclick={finish}
					>
						<Icon name="check" />
						Cooked
					</button>
				{:else}
					<button
						class="button button--primary cook__step cook__step--main"
						type="button"
						onclick={() => show(index + 1)}
					>
						Next
						<Icon name="next" />
					</button>
				{/if}
			</footer>
		</div>
	{:else if waited}
		<div class="cook__empty stack">
			<h1 id="{uid}-title">Cook mode</h1>
			{#if session.current?.cookedAt}
				<p>This meal is cooked.</p>
				<a class="button button--primary" href={resolve('/sessions/[id]', { id })}>
					Open the cook session
				</a>
			{:else}
				<p class="muted">This cook session is not on this device.</p>
			{/if}
			<a class="button" href={resolve('/')}>Go to Today</a>
		</div>
	{/if}
</dialog>

<style>
	/*
	 * Phone: the full screen. A wider main area: a large card in the middle of the screen.
	 * The selector has two classes, so that it is stronger than the styles of "dialog".
	 */
	.cook.cook {
		inline-size: 100%;
		max-inline-size: none;
		block-size: 100dvh;
		max-block-size: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background: var(--card);
		border: 0;
		border-radius: 0;
		box-shadow: none;

		&::backdrop {
			background: color-mix(in srgb, var(--ink) 60%, transparent);
		}
	}

	/* A column. The card gets the height that the other parts leave. */
	.cook__inner {
		position: relative;
		display: flex;
		flex-direction: column;
		block-size: 100%;
	}

	.cook__head {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: max(var(--space-3), env(safe-area-inset-top)) var(--space-5) var(--space-3);
	}

	.cook__leave {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		padding: 0;
		color: var(--paper);
		background: var(--ink);
		border: 0;
		border-radius: var(--radius-control);
		cursor: pointer;
		transition: scale 0.2s var(--ease-out);

		&:active {
			scale: 0.9;
		}
	}

	.cook__title {
		min-inline-size: 0;
	}

	.cook__name {
		overflow: hidden;
		font-size: 1.5rem;
		line-height: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cook__place {
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	/* One mark for each card. The marks of the cards before this one are ink. This one is olive. */
	.cook__progress {
		display: flex;
		gap: var(--space-1);
		padding-inline: var(--space-5);
	}

	.cook__mark {
		flex: 1;
		block-size: 0.5rem;
		background: var(--paper-deep);
		transition: background-color 0.3s;
	}

	.cook__mark--done {
		background: var(--ink);
	}

	.cook__mark--current {
		background: var(--olive);
		box-shadow: inset 0 0 0 2px var(--ink);
	}

	/* The old card and the new card are in one cell while one goes out and one comes in. */
	.cook__body {
		display: grid;
		flex: 1;
		min-block-size: 0;
		overflow: hidden;
	}

	/* The card scrolls up and down. A move to the side is a swipe: see input/card-sides.js. */
	.cook__card {
		grid-area: 1 / 1;
		min-block-size: 0;
		padding: var(--space-5);
		overflow-y: auto;
		overscroll-behavior: contain;
		touch-action: pan-y;
	}

	/* The two buttons are large and in reach of the thumb. "Next" is the wide one. */
	.cook__foot {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: var(--space-3);
		padding: var(--space-3) var(--space-5) max(var(--space-4), env(safe-area-inset-bottom));
		border-block-start: var(--rule-4) solid var(--ink);
	}

	.cook__step {
		gap: var(--space-2);
		min-block-size: 3.75rem;
		font-size: 1.1rem;
	}

	.cook__step--main {
		font-size: 1.2rem;
	}

	/*
	 * The message of the last action. The message of the app is behind this dialog, so the
	 * dialog shows it also.
	 */
	.cook__status {
		position: absolute;
		inset-inline: var(--space-4);
		inset-block-end: 6.5rem;
		padding: var(--space-3) var(--space-5);
		font-weight: 700;
		text-align: center;
		color: var(--paper);
		background: var(--ink);
		border-radius: var(--radius-control);
		pointer-events: none;
		transition:
			opacity 0.2s,
			translate 0.35s var(--ease-out);

		&:empty {
			opacity: 0;
			translate: 0 1.5rem;
		}
	}

	.cook__empty {
		padding: var(--space-6);
	}

	@container main (min-width: 38rem) {
		.cook.cook {
			inline-size: min(44rem, 100% - 4rem);
			block-size: min(54rem, 100dvh - 4rem);
			margin: auto;
			border: var(--rule-4) solid var(--ink);
			border-radius: var(--radius);
			box-shadow: var(--shadow);
		}
	}
</style>
