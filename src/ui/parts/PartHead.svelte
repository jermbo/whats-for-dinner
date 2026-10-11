<script lang="ts">
	import type { Snippet } from 'svelte';

	// The side is the answer of the part, such as "2 use soon" or "3/9 in the cart".
	let { title, side }: { title: string; side?: Snippet } = $props();
</script>

<header class="wfd-head">
	<h2 class="wfd-head__title wfd-display">{title}</h2>
	{#if side}
		<div class="wfd-head__side">{@render side()}</div>
	{/if}
</header>

<style>
	.wfd-head {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
		align-items: end;
		justify-content: space-between;
		padding-block-end: 8px;
		border-block-end: var(--wfd-rule-4) solid var(--wfd-ink);
	}

	.wfd-head__title {
		margin: 0;
		color: var(--wfd-ink);
		font-size: 44px;
		line-height: 0.86;
	}

	.wfd-head__side {
		--wfd-count-size: 30px;

		display: flex;
		gap: 14px;
		align-items: baseline;
	}
</style>
