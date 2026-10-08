<script>
	import { tick, untrack } from 'svelte';
	import MealCard from '$lib/components/meal/MealCard.svelte';
	import MealCardBack from '$lib/components/meal/MealCardBack.svelte';
	import MealSheet from '$lib/components/meal/MealSheet.svelte';
	import { hintSeen, markHintSeen } from '$lib/data/hints';
	import { entryName } from '$lib/domain/menu';
	import { bottomToTop, inPileOrder, pileIds, shuffledPile, topToBottom } from '$lib/domain/pile';
	import { throwCard } from '$lib/input/throw-card';
	import { vibrate } from '$lib/input/vibrate';
	import {
		dealCard,
		DROP_GAP_S,
		hintCard,
		placeCard,
		settleCard,
		splitPile,
		springBack,
		throwOut
	} from '$lib/motion/hand';
	import { lessMotion } from '$lib/motion/less-motion.svelte';
	import { status } from '$lib/state/status.svelte';
	import { SECOND } from '$lib/util/time';
	import HandActions from './HandActions.svelte';

	/** @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry */

	/** The name of the hint of the hand. This device shows it one time. */
	const HINT = 'hand';

	/**
	 * The meals on the menu as a pile of cards in your hand. Only the top card is in view.
	 * A meal that is not ready has a flag on its card.
	 * Throw the top card away, and it goes under the pile: the next meal is on top.
	 * Pull it down, and the pile shuffles: the cards turn face down, split to the left and the
	 * right, and drop back on the pile in a new order, with a ready meal on top.
	 * Buttons do the same for the keyboard.
	 * Turn a card, and its back opens on the full screen. In a wide area, the back of the top card
	 * is always next to the pile, as a panel of facts.
	 * The first time, the top card shows that it can move: see "hint".
	 * @type {{
	 *   entries: MenuEntry[],
	 *   lastSessions: Map<string, import('$lib/types').CookSession>,
	 *   soon?: import('$lib/domain/use-up').SoonItem[],
	 *   cooking?: Map<string, import('$lib/types').CookSession>,
	 *   toBuy?: Map<string, number>,
	 *   head?: import('svelte').Snippet<[{ number: number, total: number, onnext: () => void }]>,
	 *   onstart: (entry: MenuEntry) => void,
	 *   oncook: (entry: MenuEntry) => void,
	 *   onprep: (entry: MenuEntry) => unknown
	 * }}
	 *   soon: the food to use first, for the line "In the pantry" of each card.
	 *   cooking: the open cook sessions of the meals that the owner is cooking, by menu item ID.
	 *   toBuy: the items that each meal needs and that are not in the cart, by menu item ID.
	 *   head: the top of the screen. It gets the place of the top card, and the action "Next".
	 */
	let { entries, lastSessions, soon, cooking, toBuy, head, onstart, oncook, onprep } = $props();

	/**
	 * The IDs from the top of the pile down.
	 * @type {string[]}
	 */
	let order = $state.raw([]);
	/** True while a card flies or the pile shuffles. Then the top card cannot be dragged. */
	let busy = $state(false);
	/** All cards are face down during a shuffle. */
	let down = $state(false);
	/** How far the top card is pulled down, from 0 to 1. */
	let pull = $state(0);
	/** The meal on top, for screen readers. */
	let spoken = $state('');
	/** @type {MealSheet | undefined} */
	let sheet = $state();

	/**
	 * The card element of each meal. The attachment of each card keeps it current.
	 * It is a plain object, because the screen does not show it.
	 * @type {Record<string, HTMLElement>}
	 */
	const nodes = {};
	/** The cards that were dealt into the hand, and the cards that are still on their way. */
	const dealt = new WeakSet();
	const dealing = new WeakSet();

	const cards = $derived(inPileOrder(entries, order));
	const top = $derived(cards[0]);
	const number = $derived(top ? entries.indexOf(top) + 1 : 0);

	/** @param {number} ms */
	const wait = (ms) => new Promise((done) => setTimeout(done, ms));

	/**
	 * One time only on a device: the top card shows that it can move.
	 * A finger on the card stops the hint.
	 * @param {HTMLElement} node
	 */
	async function hint(node) {
		if (cards.length < 2 || (await hintSeen(HINT)) || busy) return;
		await markHintSeen(HINT);
		hintCard(node);
	}

	/**
	 * Deals a new card into the hand. The top card shows the hint after it.
	 * @param {HTMLElement} node
	 * @param {number} at
	 */
	function deal(node, at) {
		dealt.add(node);
		if (lessMotion.current) {
			placeCard(node, at);
			return;
		}
		dealing.add(node);
		dealCard(node, at, cards.length, {
			// A shuffle or a finger can stop the deal. Then the card is free to move too.
			onComplete: () => {
				dealing.delete(node);
				if (at === 0) hint(node);
			},
			onInterrupt: () => dealing.delete(node)
		});
	}

	/**
	 * Keeps the element of a card in "nodes", and deals a new card.
	 * @param {string} id
	 * @returns {import('svelte/attachments').Attachment<HTMLElement>}
	 */
	function register(id) {
		return (node) => {
			nodes[id] = node;
			untrack(() => {
				const at = cards.findIndex((entry) => entry.item.id === id);
				if (!dealt.has(node) && at >= 0) deal(node, at);
			});
			return () => {
				if (nodes[id] === node) delete nodes[id];
			};
		};
	}

	/**
	 * Moves each card to the pose of its place. A card that keeps its place also moves, because a
	 * shuffle or a throw can leave it out of its pose.
	 * @param {boolean} [drop] The bottom card first, as after a shuffle.
	 */
	function settle(drop = false) {
		const count = cards.length;
		cards.forEach((entry, at) => {
			const node = nodes[entry.item.id];
			if (!node) return;
			if (!dealt.has(node)) deal(node, at);
			else if (lessMotion.current) placeCard(node, at);
			else if (!dealing.has(node)) settleCard(node, at, drop ? (count - 1 - at) * DROP_GAP_S : 0);
		});
	}

	// A new order or a new list of meals moves the cards. A throw or a shuffle moves the cards
	// itself, so the effect waits until it is over: then it cannot stop a card that flies.
	$effect(() => {
		void cards;
		if (!busy) untrack(() => settle());
	});

	/** Tells screen readers which meal is on top. */
	function announce() {
		if (top) spoken = `${entryName(top)}. Meal ${number} of ${entries.length}.`;
	}

	/**
	 * The top card flies out of the hand, and then goes under the pile.
	 * @param {HTMLElement | undefined} node
	 * @param {{ x: number, y: number }} direction
	 */
	async function next(node, direction) {
		if (!node || cards.length === 0) return;
		busy = true;
		pull = 0;

		if (!lessMotion.current) await throwOut(node, direction);

		// The effect moves the card back from where it went, to its new place under the pile.
		// With one card, the place is the same, and the card comes back to the top.
		order = pileIds(topToBottom(cards));
		busy = false;
		await tick();
		announce();
	}

	/** The button "Next": the top card flies to the left. */
	const throwTop = () => next(top && nodes[top.item.id], { x: -1, y: -0.15 });

	/** The bottom card comes back on top. */
	async function previous() {
		if (busy || cards.length < 2) return;
		order = pileIds(bottomToTop(cards));
		await tick();
		announce();
	}

	/** A new order with a different meal on top. */
	async function shuffle() {
		if (busy || cards.length < 2) return;
		busy = true;
		pull = 0;
		vibrate([8, 40, 8]);

		const pile = shuffledPile(cards);

		if (lessMotion.current) {
			order = pileIds(pile);
		} else {
			down = true;
			await wait(300);
			await splitPile(cards.map((entry) => nodes[entry.item.id]));
			// The cards are face down, so the eye does not see the change of order.
			// All cards drop back, also a card that has the same place as before.
			order = pileIds(pile);
			await tick();
			settle(true);
			await wait((cards.length * DROP_GAP_S + 0.5) * SECOND);
			down = false;
		}

		busy = false;
		status.say(`How about ${entryName(pile[0])}?`);
	}

	/** @type {import('$lib/input/throw-card').ThrowHandlers} */
	const handlers = {
		onpull: (progress) => (pull = progress),
		onthrow: next,
		onshuffle: shuffle,
		onstay(node) {
			pull = 0;
			springBack(node);
		}
	};
</script>

<section class="hand" aria-label="Your meals">
	{@render head?.({
		number,
		total: entries.length,
		onnext: throwTop
	})}

	<div class="hand__stage">
		<div class="hand__pile">
			{#each cards as entry, at (entry.item.id)}
				<div
					class={['hand__card', at === 0 && 'hand__card--top']}
					style:z-index={cards.length - at}
					inert={at !== 0}
					{@attach register(entry.item.id)}
					{@attach at === 0 && !busy ? throwCard(handlers) : null}
				>
					<MealCard
						{entry}
						{soon}
						session={cooking?.get(entry.item.id)}
						toBuy={toBuy?.get(entry.item.id)}
						facedown={down}
						onturn={(card) => sheet?.open(entry.item.id, card)}
						{onstart}
						{oncook}
						{onprep}
					/>
				</div>
			{/each}
		</div>

		<!-- A wide area: the facts of the top card are always in view. -->
		{#if top}
			<aside class="hand__facts" aria-label="Cook facts: {entryName(top)}">
				<MealCardBack entry={top} last={lastSessions.get(top.recipe.id)} open={true} {onprep} />
			</aside>
		{/if}
	</div>

	<p class="visually-hidden" aria-live="polite">{spoken}</p>

	<!-- Shown only while the card is pulled down. -->
	<p class={['hand__pull label', pull > 0 && 'hand__pull--shown']} aria-hidden="true">
		{pull >= 1 ? 'Release to shuffle' : 'Pull down to shuffle'}
	</p>

	<HandActions
		{number}
		total={entries.length}
		onback={previous}
		onnext={throwTop}
		onshuffle={shuffle}
	/>

	<MealSheet bind:this={sheet} {entries} {lastSessions} {oncook} {onprep} />
</section>

<style>
	.hand {
		/* The pile goes to the edges of the main area, so that a thrown card can fly out of it. */
		--bleed: var(--gutter);

		container: hand / inline-size;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-inline: calc(-1 * var(--bleed));
		padding-inline: var(--bleed);
		overflow-x: clip;
	}

	/* The pile, and the facts panel next to it in a wide area. */
	.hand__stage {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: var(--space-6);
	}

	/*
	 * All cards lie in one cell. The pile is as tall as the tallest card, plus its edges.
	 * Each card has a z-index for its place in the pile. "isolation" keeps those numbers in the
	 * pile: without it, a card is above the navigation and the message of the last action.
	 */
	.hand__pile {
		display: grid;
		flex: none;
		inline-size: min(100%, 20rem);
		padding-block: var(--space-4) var(--space-8);
		isolation: isolate;
	}

	.hand__card {
		display: grid;
		grid-area: 1 / 1;
		/* The cards are hidden until the script deals them into the hand. */
		opacity: 0;
		will-change: transform;
		touch-action: none;

		&.hand__card--top {
			cursor: grab;

			&:active {
				cursor: grabbing;
			}
		}
	}

	/*
	 * The facts panel: white, with a frame of ink inside, as the back of a card. It has one
	 * size for each meal. A meal with many steps scrolls in the panel, and the screen does not
	 * move when the next meal comes.
	 */
	.hand__facts {
		container: facts / inline-size;
		display: none;
		flex: 1 1 0;
		min-inline-size: 0;
		max-inline-size: 46rem;
		block-size: 34rem;
		margin-block-start: var(--space-4);
		padding: var(--space-2);
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--card);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		scrollbar-width: thin;
	}

	.hand__pull {
		align-self: center;
		margin-block-start: calc(-1 * var(--space-6));
		opacity: 0;
		transition: opacity 0.15s;

		&.hand__pull--shown {
			opacity: 1;
		}
	}

	@container hand (min-width: 36rem) {
		.hand__stage {
			justify-content: flex-start;
		}

		.hand__pile {
			inline-size: 17rem;
		}

		.hand__facts {
			display: block;
		}

		.hand__pull {
			display: none;
		}
	}

	/*
	 * A wide main area that is tall enough: the hand fills the height of the screen, and nothing
	 * scrolls. The pile gets the height that the title and the buttons leave, and its width
	 * follows its height. The photo of each card takes the height that is left. The facts panel
	 * has the same height as the pile. The same condition is in the Today page.
	 * "Tall enough" is the title, the smallest stage, and the buttons: a screen that is less tall
	 * keeps the pile of a fixed width, and the page scrolls.
	 */
	@container main (min-width: 50rem) {
		@media (min-height: 52rem) {
			.hand {
				flex: 1 1 0;
			}

			/*
			 * The stage has a size that its content does not change: the pile reads its height.
			 * So the stage cannot ask its cards how tall they are, and it has a smallest height: the
			 * tallest card with the edges of the pile. Offers from the pantry below the hand take
			 * the height that is left, and without this limit the pile gets too narrow for a card.
			 */
			.hand__stage {
				container-type: size;
				flex: 1 1 0;
				align-items: stretch;
				min-block-size: 32rem;
			}

			.hand__pile {
				align-self: stretch;
				inline-size: min(36rem, 64cqh);
			}

			.hand__facts {
				block-size: auto;
				margin-block-end: var(--space-8);
			}

			.hand__pile :global(.pack__media) {
				flex: 1 1 0;
				min-block-size: 6rem;
			}

			.hand__pile :global(.pack__media .recipe-photo--card) {
				position: absolute;
				inset: 0;
				block-size: 100%;
				aspect-ratio: auto;
			}
		}
	}
</style>
