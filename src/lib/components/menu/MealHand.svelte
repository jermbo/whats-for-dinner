<script>
	import { tick, untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { entryName } from '$lib/data/menu';
	import { getMeta, setMeta } from '$lib/db/meta';
	import { throwCard } from '$lib/input/throw-card';
	import { gsap } from '$lib/motion/gsap';
	import { pose } from '$lib/motion/pile';
	import { status } from '$lib/status.svelte';
	import { shuffled } from '$lib/util/collections';
	import MealSheet from './MealSheet.svelte';
	import MenuCard from './MenuCard.svelte';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	/** The time of a card that flies out of the hand, in seconds. */
	const THROW_S = 0.35;
	/** The time between two cards that drop back on the pile after a shuffle, in seconds. */
	const DROP_GAP_S = 0.06;
	/** The note that this device showed the hint of the hand. */
	const HINT_KEY = 'handHintSeen';

	/**
	 * The meals on the menu as a pile of cards in your hand. Only the top card is in view.
	 * A meal that is not ready has a flag on its card.
	 * Throw the top card away, and it goes under the pile: the next meal is on top.
	 * Pull it down, and the pile shuffles: the cards turn face down, split to the left and the
	 * right, and drop back on the pile in a new order, with a ready meal on top.
	 * Buttons do the same for the keyboard.
	 * Turn a card, and its back opens on the full screen.
	 * The first time, the top card shows that it can move: see "hint".
	 * @type {{
	 *   entries: MenuEntry[],
	 *   kitchen: import('$lib/kitchen.svelte').Kitchen,
	 *   lastSessions: Map<string, import('$lib/types').CookSession>,
	 *   oncook: (entry: MenuEntry) => void,
	 *   onprep: (entry: MenuEntry) => unknown
	 * }}
	 */
	let { entries, kitchen, lastSessions, oncook, onprep } = $props();

	/**
	 * The IDs from the top of the pile down. A meal that is not in it comes on top: a meal that
	 * becomes ready comes into the hand where you can see it.
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

	/** @param {MenuEntry} entry */
	function place(entry) {
		const index = order.indexOf(entry.item.id);
		return index;
	}

	const cards = $derived(entries.toSorted((a, b) => place(a) - place(b)));
	const top = $derived(cards[0]);
	const number = $derived(top ? entries.indexOf(top) + 1 : 0);

	/** @param {MenuEntry[]} list */
	const ids = (list) => list.map((entry) => entry.item.id);

	/** @param {number} ms */
	const wait = (ms) => new Promise((done) => setTimeout(done, ms));

	/**
	 * One time only on a device: the top card goes to the side and comes back, and its turn
	 * button turns. This shows that you can throw the card and turn it.
	 * A finger on the card stops the hint.
	 * @param {HTMLElement} node
	 */
	async function hint(node) {
		if (cards.length < 2 || (await getMeta(HINT_KEY)) || busy) return;
		await setMeta(HINT_KEY, true);

		const timeline = gsap
			.timeline()
			.to(node, { x: -64, rotation: -5, duration: 0.4, ease: 'power2.out' })
			.to(node, { ...pose(0), duration: 0.8, ease: 'elastic.out(1, 0.55)' });
		const turn = node.querySelector('.meal-card__turn');
		if (turn) {
			timeline.to(
				turn,
				{ rotation: 360, duration: 0.7, ease: 'back.out(1.6)', clearProps: 'transform' },
				'-=0.4'
			);
		}
	}

	/**
	 * Deals a new card into the hand: it comes up from below. The bottom card comes first.
	 * @param {HTMLElement} node
	 * @param {number} at
	 */
	function deal(node, at) {
		dealt.add(node);
		if (prefersReducedMotion.current) {
			gsap.set(node, pose(at));
			return;
		}
		dealing.add(node);
		gsap.fromTo(
			node,
			{ y: 220, rotation: at % 2 ? 10 : -10, opacity: 0 },
			{
				...pose(at),
				duration: 0.7,
				delay: 0.15 + (cards.length - 1 - at) * 0.08,
				ease: 'back.out(1.2)',
				// A shuffle or a finger can stop the deal. Then the card is free to move too.
				onComplete: () => {
					dealing.delete(node);
					if (at === 0) hint(node);
				},
				onInterrupt: () => dealing.delete(node)
			}
		);
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
			if (!dealt.has(node)) {
				deal(node, at);
			} else if (prefersReducedMotion.current) {
				gsap.set(node, pose(at));
			} else if (!dealing.has(node)) {
				gsap.to(node, {
					...pose(at),
					duration: 0.5,
					delay: drop ? (count - 1 - at) * DROP_GAP_S : 0,
					ease: 'back.out(1.4)',
					overwrite: 'auto'
				});
			}
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

		if (!prefersReducedMotion.current) {
			const distance = Math.max(innerWidth, innerHeight);
			await gsap.to(node, {
				x: `+=${direction.x * distance}`,
				y: `+=${direction.y * distance}`,
				rotation: `+=${direction.x * 30}`,
				duration: THROW_S,
				ease: 'power1.in',
				overwrite: 'auto'
			});
		}

		// The effect moves the card back from where it went, to its new place under the pile.
		// With one card, the place is the same, and the card comes back to the top.
		const [first, ...rest] = cards;
		order = ids([...rest, first]);
		busy = false;
		await tick();
		announce();
	}

	/** The cards split to the left and to the right. */
	function split() {
		const timeline = gsap.timeline();
		cards.forEach((entry, at) => {
			const node = nodes[entry.item.id];
			if (!node) return;
			const side = at % 2 === 0 ? -1 : 1;
			timeline.to(
				node,
				{
					x: side * node.offsetWidth * 0.55,
					y: -12 - at * 3,
					rotation: side * (8 + at),
					scale: 0.9,
					opacity: 1,
					duration: 0.32,
					ease: 'power2.out',
					overwrite: 'auto'
				},
				at * 0.03
			);
		});
		return timeline;
	}

	/** A new order with a different meal on top. */
	async function shuffle() {
		if (busy || cards.length < 2) return;
		busy = true;
		pull = 0;
		navigator.vibrate?.([8, 40, 8]);

		// The meal on top must be one that you can cook now, if there is one.
		const [first, ...rest] = cards;
		const ready = rest.filter((entry) => entry.state === 'ready');
		const pool = ready.length > 0 ? ready : rest;
		const pick = pool[Math.floor(Math.random() * pool.length)];
		const next = [pick, ...shuffled([first, ...rest.filter((entry) => entry !== pick)])];

		if (prefersReducedMotion.current) {
			order = ids(next);
		} else {
			down = true;
			await wait(300);
			await split();
			// The cards are face down, so the eye does not see the change of order.
			// All cards drop back, also a card that has the same place as before.
			order = ids(next);
			await tick();
			settle(true);
			await wait((cards.length * DROP_GAP_S + 0.5) * 1000);
			down = false;
		}

		busy = false;
		status.say(`How about ${entryName(pick)}?`);
	}

	/** @type {import('$lib/input/throw-card').ThrowHandlers} */
	const handlers = {
		onpull: (progress) => (pull = progress),
		onthrow: next,
		onshuffle: shuffle,
		onstay(node) {
			pull = 0;
			gsap.to(node, { ...pose(0), duration: 0.7, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' });
		}
	};
</script>

<section class="hand" aria-labelledby="hand-title">
	<div class="hand__head">
		<h2 id="hand-title">Your meals</h2>
		<p class="hand__count muted">{number} of {entries.length}</p>
	</div>

	<div class="hand__pile">
		{#each cards as entry, at (entry.item.id)}
			<div
				class={['hand__card', at === 0 && 'hand__card--top']}
				style:z-index={cards.length - at}
				inert={at !== 0}
				{@attach register(entry.item.id)}
				{@attach at === 0 && !busy ? throwCard(handlers) : null}
			>
				<MenuCard
					{entry}
					{kitchen}
					facedown={down}
					onturn={(card) => sheet?.open(entry.item.id, card)}
					{oncook}
				/>
			</div>
		{/each}
	</div>

	<p class="visually-hidden" aria-live="polite">{spoken}</p>

	<p class={['hand__hint', pull >= 1 && 'hand__hint--ready']} aria-hidden="true">
		{pull >= 1
			? 'Release to shuffle'
			: 'Throw the card for the next meal. Pull it down to shuffle.'}
	</p>

	<div class="hand__actions">
		<button
			class="button hand__action"
			type="button"
			onclick={shuffle}
			disabled={entries.length < 2}
		>
			<Icon name="shuffle" />
			Shuffle
		</button>
		<button
			class="button button--primary hand__action"
			type="button"
			onclick={() => next(top && nodes[top.item.id], { x: -1, y: -0.15 })}
			disabled={entries.length < 2}
		>
			Next meal
			<Icon name="next" />
		</button>
	</div>

	<MealSheet bind:this={sheet} {entries} {kitchen} {lastSessions} {oncook} {onprep} />
</section>

<style>
	.hand {
		/* The pile goes to the edges of the main area, so that a thrown card can fly out of it. */
		--bleed: var(--gutter);

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		margin-inline: calc(-1 * var(--bleed));
		padding-inline: var(--bleed);
		overflow-x: clip;
	}

	.hand__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		inline-size: 100%;
	}

	.hand__count {
		font-variant-numeric: tabular-nums;
	}

	/* All cards lie in one cell. The pile is as tall as the tallest card, plus its edges. */
	/*
	 * Each card has a z-index for its place in the pile. "isolation" keeps those numbers in the
	 * pile: without it, a card is above the navigation and the message of the last action.
	 */
	.hand__pile {
		display: grid;
		inline-size: min(100%, 22rem);
		padding-block-end: var(--space-8);
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

	.hand__hint {
		margin-block-start: calc(-1 * var(--space-4));
		color: var(--color-muted);
		font-size: 0.85rem;
		text-align: center;
		transition:
			color 0.2s,
			scale 0.3s var(--ease-spring);

		&.hand__hint--ready {
			color: var(--color-accent-strong);
			font-weight: 600;
			scale: 1.1;
		}
	}

	.hand__actions {
		display: flex;
		gap: var(--space-3);
	}

	.hand__action {
		gap: var(--space-2);
	}
</style>
