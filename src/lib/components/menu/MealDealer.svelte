<script>
	import { untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { SvelteSet } from 'svelte/reactivity';
	import { swipeCard } from '$lib/input/swipe-card';
	import { gsap } from '$lib/motion/gsap';
	import IdeaCard from './IdeaCard.svelte';

	/** @typedef {import('$lib/data/use-up').UseUpIdea} UseUpIdea */

	/** The card in its place. */
	const REST = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

	/**
	 * The dealer: one recipe that can go on the menu, as a card, the best first.
	 * Swipe the card to the right, or use "Add to the menu": the card goes up, to the menu at the
	 * top of the screen. Swipe it to the left, or use "Not this": the card goes out, and the next
	 * idea comes. After the last idea, the first one comes again.
	 * Each button is on the side of its swipe. While the card is far to one side, the button of
	 * that side has a ring.
	 * The children are the controls below the card.
	 * @type {{
	 *   title: string,
	 *   deck: UseUpIdea[],
	 *   selected: Set<string>,
	 *   empty: string,
	 *   onadd: (recipe: import('$lib/types').Recipe) => Promise<unknown>,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { title, deck, selected, empty, onadd, children } = $props();

	/** The recipes that got "Not this" in this round. */
	const skipped = new SvelteSet();
	/** The recipe that goes on the menu now. The dealer does not show it again. */
	let adding = $state('');
	/** True while a card goes out. */
	let busy = $state(false);
	/** The side that the card leans to under the finger. */
	let lean = $state(/** @type {import('$lib/input/swipe-card').Side} */ (0));
	/** What the last action did, for screen readers. The eye sees the card move. */
	let note = $state('');
	/** @type {HTMLElement | undefined} */
	let card = $state();

	const open = $derived(deck.filter((idea) => idea.recipe.id !== adding));
	const current = $derived(open.find((idea) => !skipped.has(idea.recipe.id)) ?? open[0]);
	const place = $derived(current ? deck.indexOf(current) + 1 : 0);
	/** The ID only: the data of the recipe can change, and then no new card must come in. */
	const currentId = $derived(current?.recipe.id ?? '');

	// The menu has the recipe when the recipe is out of the deck.
	$effect(() => {
		if (adding && !deck.some((idea) => idea.recipe.id === adding)) adding = '';
	});

	/** The card comes in from below. */
	function deal() {
		if (!card) return;
		if (prefersReducedMotion.current) {
			gsap.set(card, REST);
			return;
		}
		gsap.fromTo(
			card,
			{ x: 0, y: 40, rotation: 0, scale: 0.94, opacity: 0 },
			{ ...REST, duration: 0.45, ease: 'back.out(1.4)', overwrite: true }
		);
	}

	// A card comes in: the first one, the one after a card that went out, and the one after a
	// change of the filters.
	$effect(() => {
		void currentId;
		if (!busy) untrack(deal);
	});

	/**
	 * The card goes out. A person who asks for reduced motion sees only the change.
	 * @param {gsap.TweenVars} to
	 */
	async function leave(to) {
		if (!card || prefersReducedMotion.current) return;
		await gsap.to(card, { ...to, opacity: 0, ease: 'power1.in', overwrite: true });
	}

	/** "Not this": the card goes out to the left. */
	async function skip() {
		if (busy || !current) return;
		busy = true;
		const { id } = current.recipe;
		await leave({ x: -innerWidth, rotation: -18, duration: 0.25 });

		skipped.add(id);
		note = '';
		if (open.every((idea) => skipped.has(idea.recipe.id))) {
			// The round is over. The card that went out last does not come first.
			skipped.clear();
			if (open.length > 1) skipped.add(id);
			note = 'That was the last idea. The first one comes again.';
		}
		busy = false;
	}

	/**
	 * "Add to the menu": the card goes up to the menu. After a swipe, it goes up from the right.
	 * @param {boolean} [swiped]
	 */
	async function add(swiped = false) {
		if (busy || !current) return;
		busy = true;
		const { recipe } = current;
		await leave({
			x: swiped ? innerWidth * 0.5 : 0,
			y: -280,
			rotation: swiped ? 12 : 0,
			scale: 0.4,
			duration: 0.35
		});

		adding = recipe.id;
		try {
			await onadd(recipe);
			note = `${recipe.name} is on the menu.`;
		} catch (error) {
			adding = '';
			throw error;
		} finally {
			busy = false;
		}
	}

	/** @type {import('$lib/input/swipe-card').SwipeHandlers} */
	const handlers = {
		onswipe: (_node, side) => (side === 1 ? add(true) : skip()),
		onlean: (side) => (lean = side),
		onstay(node) {
			gsap.to(node, { ...REST, duration: 0.6, ease: 'elastic.out(1, 0.6)', overwrite: true });
		}
	};
</script>

<section class="dealer" aria-labelledby="dealer-title">
	<div class="cluster cluster--between">
		<h2 id="dealer-title">{title}</h2>
		{#if current}
			<p class="dealer__place muted">{place} of {deck.length}</p>
		{/if}
	</div>

	{#if current}
		<div class="dealer__card" bind:this={card} {@attach busy ? null : swipeCard(handlers)}>
			<IdeaCard idea={current} {selected}>
				<div class="dealer__actions">
					<button
						class={['button', 'dealer__action', lean === -1 && 'dealer__action--lean']}
						type="button"
						onclick={skip}
					>
						Not this
					</button>
					<button
						class={[
							'button',
							'button--strong',
							'dealer__action',
							lean === 1 && 'dealer__action--lean'
						]}
						type="button"
						onclick={() => add()}
					>
						Add to the menu
					</button>
				</div>
			</IdeaCard>
		</div>

		<p class="visually-hidden" aria-live="polite">
			{note}
			{current.recipe.name}. Idea {place} of {deck.length}.
		</p>
	{:else}
		<p class="muted">{empty}</p>
	{/if}

	{@render children?.()}
</section>

<style>
	.dealer {
		/* The section goes to the edges of the screen, so that a card can go out to the side. */
		--bleed: var(--space-5);

		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-inline: calc(-1 * var(--bleed));
		padding-inline: var(--bleed);
		overflow-x: clip;
	}

	.dealer__place {
		font-variant-numeric: tabular-nums;
	}

	.dealer__card {
		inline-size: 100%;
		max-inline-size: 24rem;
		will-change: transform;
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}

	/* "Not this" is at the left and "Add" is at the right, as the swipes. */
	.dealer__actions {
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: var(--space-3);
	}

	.dealer__action {
		padding-inline: var(--space-3);

		/* The card is far to the side of this button: a release does its action. */
		&.dealer__action--lean {
			outline: 3px solid var(--color-accent-strong);
			outline-offset: 2px;
			scale: 1.04;
		}
	}

	@media (min-width: 60rem) {
		.dealer {
			--bleed: 0rem;
		}
	}
</style>
