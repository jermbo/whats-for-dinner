<script>
	import { untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { swipeCard } from '$lib/input/swipe-card';
	import { dealIdea, keepIdea, placeIdea, settleIdea, skipIdea } from '$lib/motion/dealer';
	import { lessMotion } from '$lib/motion/less-motion.svelte';
	import IdeaCard from './IdeaCard.svelte';

	/** @typedef {import('$lib/domain/use-up').UseUpIdea} UseUpIdea */

	/**
	 * The dealer: one recipe that can go on the menu, as a card, the best first.
	 * Swipe the card to the right, or use "Keep": the card goes up, to the next place of the menu
	 * at the top of the screen. Swipe it to the left, or use "Not this": the card goes out, and the next
	 * idea comes. After the last idea, the first one comes again.
	 * Each button is on the side of its swipe. While the card is far to one side, the button of
	 * that side has a ring.
	 * The children are the controls below the card.
	 * @type {{
	 *   title: string,
	 *   deck: UseUpIdea[],
	 *   selected: Set<string>,
	 *   facts: (recipe: import('$lib/types').Recipe) => string,
	 *   empty: string,
	 *   onadd: (recipe: import('$lib/types').Recipe) => Promise<unknown>,
	 *   children?: import('svelte').Snippet
	 * }}
	 *   facts: the small line of a card, such as "New · 20 min".
	 */
	let { title, deck, selected, facts, empty, onadd, children } = $props();

	const uid = $props.id();

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

	/** A person who asks for reduced motion sees only the new card. */
	function deal() {
		if (!card) return;
		if (lessMotion.current) placeIdea(card);
		else dealIdea(card);
	}

	// A card comes in: the first one, the one after a card that went out, and the one after a
	// change of the filters.
	$effect(() => {
		void currentId;
		if (!busy) untrack(deal);
	});

	/** "Not this": the card goes out, and the next idea comes. */
	async function skip() {
		if (busy || !current) return;
		busy = true;
		const { id } = current.recipe;
		if (card && !lessMotion.current) await skipIdea(card);

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
	 * "Keep": the card goes out, and the recipe goes on the menu.
	 * @param {boolean} [swiped] The owner swiped the card. The button was not used.
	 */
	async function add(swiped = false) {
		if (busy || !current) return;
		busy = true;
		const { recipe } = current;
		if (card && !lessMotion.current) await keepIdea(card, swiped);

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
		onstay: settleIdea
	};
</script>

<section class="dealer" aria-labelledby="{uid}-title">
	<div class="cluster cluster--between">
		<h2 id="{uid}-title">{title}</h2>
		{#if current}
			<p class="dealer__place muted">{place} of {deck.length}</p>
		{/if}
	</div>

	{#if current}
		<div class="dealer__card" bind:this={card} {@attach busy ? null : swipeCard(handlers)}>
			<IdeaCard idea={current} {selected} facts={facts(current.recipe)}>
				<div class="dealer__actions">
					<button
						class={['button', 'dealer__action', lean === -1 && 'dealer__action--lean']}
						type="button"
						onclick={skip}
					>
						<Icon name="back" />
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
						Keep
						<Icon name="next" />
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
		/* The section goes to the edges of its column, so that a card can go out to the side. */
		--bleed: var(--gutter);

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

	/* "Not this" is at the left and "Keep" is at the right, as the swipes. */
	.dealer__actions {
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: var(--space-3);
	}

	.dealer__action {
		gap: var(--space-2);
		padding-inline: var(--space-3);

		& :global(.icon) {
			inline-size: 1.25rem;
			block-size: 1.25rem;
		}

		/* The card is far to the side of this button: a release does its action. */
		&.dealer__action--lean {
			outline: 3px solid var(--ink);
			outline-offset: 2px;
			scale: 1.04;
		}
	}
</style>
