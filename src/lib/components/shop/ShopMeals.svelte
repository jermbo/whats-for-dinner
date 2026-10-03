<script>
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	/**
	 * The meals on the menu, in one row: a "shelf" of the layout. Each meal shows how many of its
	 * items are not in the cart, or "Ready" when you have them all. A tap on a meal shows only
	 * the items of that meal. A second tap shows all items again.
	 * @type {{
	 *   meals: import('$lib/data/shopping').ShopMeal[],
	 *   selected: string,
	 *   onselect: (recipeId: string) => void
	 * }}
	 */
	let { meals, selected, onselect } = $props();
</script>

<ul class="shelf" aria-label="Meals on the menu">
	{#each meals as meal (meal.item.id)}
		{@const ready = meal.toBuy === 0}
		{@const pressed = selected === meal.recipe.id}
		<li class="shop-meal">
			<RecipePhoto recipe={meal.recipe} variant="thumb" />

			<!-- The button covers the full meal. -->
			<button
				class="shop-meal__button"
				type="button"
				aria-pressed={pressed}
				onclick={() => onselect(pressed ? '' : meal.recipe.id)}
			>
				<span class="shop-meal__name">{meal.recipe.name}</span>
				<span class={['shop-meal__state', ready && 'shop-meal__state--ready']}>
					{#if ready}
						<Icon name="check" /> Ready
					{:else}
						{meal.toBuy} to buy
					{/if}
				</span>
			</button>
		</li>
	{/each}
</ul>

<style>
	.shop-meal {
		position: relative;
		display: grid;
		flex: none;
		gap: var(--space-1);
		inline-size: 4.5rem;
		transition:
			scale 0.25s var(--ease-spring),
			translate 0.3s var(--ease-out);

		&:active {
			scale: 0.95;
		}

		/* Only for a mouse: on a touch screen, a hover stays after the tap. */
		@media (hover: hover) {
			&:hover {
				translate: 0 -0.15rem;
			}
		}

		& :global(.recipe-photo) {
			inline-size: 100%;
			box-shadow: var(--shadow);
			outline: 3px solid transparent;
			outline-offset: 2px;
			transition: outline-color 0.15s;
		}

		/* The meal whose items the list shows: a dark ring, and a bold name. */
		&:has([aria-pressed='true']) {
			& :global(.recipe-photo) {
				outline-color: var(--color-strong);
			}

			& .shop-meal__name {
				font-weight: 700;
			}
		}

		&:has(:focus-visible) :global(.recipe-photo) {
			outline-color: var(--color-accent-strong);
		}
	}

	.shop-meal__button {
		display: grid;
		min-inline-size: 0;
		padding: 0;
		font-size: 0.75rem;
		line-height: 1.25;
		text-align: start;
		background: none;
		border: 0;
		cursor: pointer;

		&::after {
			position: absolute;
			inset: 0;
			content: '';
		}

		/* The ring of the photo shows the focus. */
		&:focus-visible {
			outline: none;
		}
	}

	/* The name has one line. */
	.shop-meal__name {
		overflow: hidden;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.shop-meal__state {
		display: flex;
		align-items: center;
		gap: 0.125rem;
		color: var(--color-muted);
		white-space: nowrap;

		&.shop-meal__state--ready {
			font-weight: 600;
			color: var(--color-accent-strong);
		}

		& :global(.icon) {
			inline-size: 0.875rem;
			block-size: 0.875rem;
			stroke-width: 2.5;
		}
	}
</style>
