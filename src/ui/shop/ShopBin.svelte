<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { title: string; count: number; children: Snippet };
	let { title, count, children }: Props = $props();
	const headId = $props.id();
</script>

<!-- One group of the list, as a group of the Larder labels: a title over a heavy rule. -->
<section class="wfd-shop-bin" aria-labelledby={headId}>
	<header class="wfd-shop-bin__head">
		<h3 class="wfd-shop-bin__title wfd-display" id={headId}>{title}</h3>
		<span class="wfd-shop-bin__count wfd-number">{count}</span>
	</header>
	<ul class="wfd-shop-bin__rows">{@render children()}</ul>
</section>

<style>
	.wfd-shop-bin__head {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: baseline;
		justify-content: space-between;
		padding-block-end: var(--wfd-space-tight);
		border-block-end: var(--wfd-border-rule) solid var(--wfd-color-border);
	}

	.wfd-shop-bin__title {
		margin: 0;
		font-size: var(--wfd-font-size-title);
		font-weight: 800;
	}

	.wfd-shop-bin__count {
		color: var(--wfd-color-text-faint);
		font-size: var(--wfd-font-size-title);
	}

	/* A wide bin has its rows in columns, so that a long list does not leave the width empty. */
	.wfd-shop-bin__rows {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		column-gap: var(--wfd-space-section);
		margin: 0;
		padding: 0;
		list-style: none;

		& > :global(li) {
			border-block-end: var(--wfd-border-thin) solid var(--wfd-color-track);
		}
	}
</style>
