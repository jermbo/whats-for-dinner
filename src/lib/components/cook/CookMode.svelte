<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { cook, visitCard } from '$lib/data/cooking';
	import { stopTimer } from '$lib/data/timers';
	import { cookCards } from '$lib/domain/cook-cards';
	import { notesByStep } from '$lib/domain/step-notes';
	import { cardSides } from '$lib/input/card-sides';
	import { keepScreenOn } from '$lib/input/wake-lock';
	import { turnPage } from '$lib/motion/transitions';
	import { unlockSound } from '$lib/sound/chime';
	import { useClock } from '$lib/state/clock.svelte';
	import { useKitchen } from '$lib/state/kitchen.svelte';
	import { status } from '$lib/state/status.svelte';
	import { useTimerBell } from '$lib/state/timer-bell.svelte';
	import CookFinishedCard from './CookFinishedCard.svelte';
	import CookFoot from './CookFoot.svelte';
	import CookHead from './CookHead.svelte';
	import CookIngredientsCard from './CookIngredientsCard.svelte';
	import CookProgress from './CookProgress.svelte';
	import CookStepCard from './CookStepCard.svelte';
	import TimerChips from './TimerChips.svelte';

	/**
	 * Cook mode: a recipe as a row of cards, one card on the screen at a time. The owner cooks
	 * with wet hands, so the text is large and one tap goes to the next card.
	 * It is a modal dialog: it covers the navigation and keeps the focus. The screen stays on.
	 * The cook session records each card that the owner opens. So the app keeps the place of
	 * the owner, and the insights get the real time of each step.
	 * @type {{
	 *   id: string,
	 *   session?: import('$lib/types').CookSession,
	 *   recipe?: import('$lib/types').Recipe,
	 *   cooks: import('$lib/types').CookSession[]
	 * }}
	 *   id: the ID of the cook session. cooks: all cook sessions of the recipe.
	 */
	let { id, session, recipe, cooks } = $props();

	const uid = $props.id();

	const kitchen = useKitchen();
	const { ingredientsById, pantryByIngredient } = $derived(kitchen);
	const clock = useClock();

	const notes = $derived(notesByStep(cooks));

	const cards = $derived(recipe ? cookCards(recipe) : []);
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
		if (placed || !session || cards.length === 0) return;
		const last = session.visits.at(-1)?.card;
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

	useTimerBell(
		() => session?.timers ?? [],
		() => clock.now
	);

	/** The owner leaves Cook mode. The cook session stays open, so the meal shows "Continue". */
	function leave() {
		// Back to the page that opened Cook mode: the Today screen or the page of the recipe.
		// A tab that opened Cook mode directly has no page before it.
		if (history.length > 1) history.back();
		else goto(resolve('/'));
	}

	async function finish() {
		const current = session;
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
	<title>{recipe ? `Cook: ${recipe.name}` : 'Cook'} · Larder</title>
</svelte:head>

<dialog
	class="cook"
	bind:this={dialog}
	aria-labelledby="{uid}-title"
	oncancel={cancel}
	onkeydown={keys}
	onpointerdown={unlockSound}
>
	{#if placed && session && recipe && card && (!session.cookedAt || finishing)}
		{@const current = session}
		<div class="cook__inner">
			<CookHead name={recipe.name} place={label} titleId="{uid}-title" onleave={leave} />

			<CookProgress keys={cards.map((item) => item.key)} {index} />

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
								{recipe}
								session={current}
								{ingredientsById}
								{pantryByIngredient}
							/>
						{:else if card.kind === 'step'}
							<CookStepCard
								{recipe}
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

			<CookFoot
				first={index === 0}
				last={card.kind === 'finished'}
				{finishing}
				onback={() => show(index - 1)}
				onnext={() => show(index + 1)}
				onfinish={finish}
			/>
		</div>
	{:else if waited}
		<div class="cook__empty stack">
			<h1 id="{uid}-title">Cook mode</h1>
			{#if session?.cookedAt}
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
