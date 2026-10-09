<script>
	import { pantryScale } from '$lib/domain/pantry-scale';
	import { collapse } from '$lib/motion/transitions';

	/**
	 * @typedef {{
	 *   item: import('$lib/types').PantryItem,
	 *   ingredient: import('$lib/types').Ingredient
	 * }} Fill
	 */

	/**
	 * "Pantry fills": one small gauge for each food of the trip that is in the pantry now. When
	 * the owner puts an item away, its gauge comes in and grows from empty, so the eye sees the
	 * food go from the receipt into the pantry.
	 * @type {{ fills: Fill[] }}
	 *   fills: the pantry items of the trip that are put away, in the sequence of the receipt.
	 */
	let { fills } = $props();

	const uid = $props.id();
</script>

<section class="stack stack--tight" aria-labelledby="{uid}-title">
	<h2 class="section-title" id="{uid}-title">Pantry fills</h2>

	{#if fills.length === 0}
		<p class="muted">Each item that you put away shows here.</p>
	{:else}
		<ul class="fills">
			{#each fills as { item, ingredient } (item.id)}
				{@const scale = pantryScale(item, ingredient)}
				<li class="fills__row" transition:collapse>
					<span class="fills__name">{ingredient.name}</span>
					<span class="fills__track" aria-hidden="true">
						<span class="fills__fill" style:--level={scale.toFraction(scale.value)}></span>
					</span>
					<span class="fills__value">{scale.text(scale.value)}</span>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.fills {
		display: grid;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.fills__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) auto;
		align-items: center;
		gap: var(--space-3);
		font-size: 0.9375rem;
	}

	.fills__name {
		overflow: hidden;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.fills__track {
		block-size: var(--gauge-height);
		background: var(--paper-deep);
	}

	/* The fill grows from empty when the row comes in, and to its new level after that. */
	.fills__fill {
		display: block;
		block-size: 100%;
		inline-size: calc(var(--level) * 100%);
		background: var(--ink);
		transition: inline-size 0.7s var(--ease-out);

		@starting-style {
			inline-size: 0;
		}
	}

	.fills__value {
		min-inline-size: 3.5rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		text-align: end;
	}
</style>
