<script>
	import { pop } from '$lib/motion/transitions';

	/**
	 * The progress of a trip: "3/9 in the cart", and one segment for each item of the list.
	 * A segment fills with each tap. When all items are in the cart, the bar is olive: done.
	 * @type {{ taken: number, total: number }}
	 *   taken: the items in the cart. total: the items in the cart and on the list.
	 */
	let { taken, total } = $props();

	const done = $derived(total > 0 && taken === total);
</script>

<div class={['cart-progress', done && 'cart-progress--done']}>
	<p class="cart-progress__text">
		<span class="count">
			<span aria-hidden="true">
				{#key taken}<span class="cart-progress__taken" in:pop>{taken}</span>{/key}<span
					class="count__total">/{total}</span
				>
			</span>
			<span class="visually-hidden">{taken} of {total}</span>
		</span>
		<span class="label">in the cart</span>
	</p>

	<div class="cart-progress__bar" aria-hidden="true">
		{#each { length: total }, index (index)}
			<span class={['cart-progress__part', index < taken && 'cart-progress__part--in']}></span>
		{/each}
	</div>
</div>

<style>
	.cart-progress {
		display: grid;
		gap: var(--space-2);
	}

	.cart-progress__text {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
	}

	/* A transform needs a box. */
	.cart-progress__taken {
		display: inline-block;
		transform-origin: bottom center;
	}

	.cart-progress__bar {
		display: flex;
		gap: 2px;
		transition: gap 0.4s var(--ease-out);
	}

	.cart-progress__part {
		flex: 1;
		block-size: var(--rule-8);
		background: var(--paper-deep);
		transition: background-color 0.3s var(--ease-out);
	}

	.cart-progress__part--in {
		background: var(--ink);
	}

	/* All in the cart: the segments join to one olive bar with an ink rule. */
	.cart-progress--done .cart-progress__bar {
		gap: 0;
		outline: 2px solid var(--ink);
		outline-offset: -2px;
	}

	.cart-progress--done .cart-progress__part {
		background: var(--olive);
	}
</style>
