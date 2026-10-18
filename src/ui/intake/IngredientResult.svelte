<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import type { IngredientLine } from '../../intake/line';
	import type { FoodNote } from '../../note';

	type Props = { line: IngredientLine; foods: FoodNote[] };
	let { line, foods }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 150);
	// Two food items get no link: Cook Mode selects one on the day.
	const food = $derived(foods.map((one) => one.item.name).join(' or '));
</script>

<!-- What the plugin read in the line: "200 g · Flour". -->
<p class="wfd-result" aria-live="polite">
	{#key food}
		<span in:fade={{ duration }}>
			{#if line.amount}<span class="wfd-number">{line.amount.text}</span> ·{/if}
			{food}
		</span>
	{/key}
</p>

<style>
	.wfd-result {
		margin: 0;
		padding-inline: 4px;
		color: var(--wfd-ink);
		font-size: 14px;
		font-weight: 600;
	}
</style>
