<script>
	import { nextPackages, setPackages } from '$lib/data/cart';
	import { plural } from '$lib/util/format';

	/**
	 * Sets the number of packages of an item in the cart. The button shows the number that a tap
	 * sets: "2×" sets two packages. After the largest number, it goes back to one.
	 * @type {{ purchase: import('$lib/types').Purchase }}
	 */
	let { purchase } = $props();

	const next = $derived(nextPackages(purchase.packages));
</script>

<button
	class="button button--round packages-button"
	type="button"
	onclick={() => setPackages(purchase, next)}
>
	<span aria-hidden="true">{next}×</span>
	<span class="visually-hidden">Set {plural(next, 'package')} of {purchase.name}</span>
</button>

<style>
	.packages-button {
		flex: none;
		font-size: 1rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
</style>
