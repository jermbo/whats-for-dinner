<script lang="ts">
	import type { Snippet } from 'svelte';
	import Panel from '../parts/Panel.svelte';

	type Props = { title: string; count: number; children: Snippet };
	let { title, count, children }: Props = $props();
	const headId = $props.id();
</script>

<!-- One group of the list, as a bin of the Pantry: a white card with its title and its count. -->
<section class="wfd-shop-bin" aria-labelledby={headId}>
	<Panel kind="surface" data-glide-bg>
		<header class="wfd-shop-bin__head">
			<h3 class="wfd-shop-bin__title wfd-display" id={headId}>{title}</h3>
			<span class="wfd-shop-bin__count wfd-number">{count}</span>
		</header>
		<ul class="wfd-shop-bin__rows">{@render children()}</ul>
	</Panel>
</section>

<style>
	.wfd-shop-bin {
		--wfd-row-rule: var(--wfd-color-track);
	}

	.wfd-shop-bin__head {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		padding-block-end: var(--wfd-space-inset);
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
	}

	.wfd-shop-bin__title {
		margin: 0;
		font-size: var(--wfd-font-size-title);
	}

	.wfd-shop-bin__count {
		color: var(--wfd-color-text-faint);
		font-size: var(--wfd-font-size-title);
	}

	.wfd-shop-bin__rows {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		margin: 0;
		padding: 0;
		list-style: none;

		& > :global(li + li) {
			border-block-start: var(--wfd-border-thin) solid var(--wfd-row-rule);
		}
	}
</style>
