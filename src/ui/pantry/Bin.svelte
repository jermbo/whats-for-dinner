<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sticker from '../parts/Sticker.svelte';

	type Props = {
		title: string;
		count: number;
		// The lines past their date, soon, and low. A zero shows no sticker.
		past?: number;
		soon?: number;
		low?: number;
		// Food that is out: a bin of dashed tags, under a dashed rule.
		out?: boolean;
		// The position of the bin, so that the bins come in one after the other.
		at: number;
		children: Snippet;
	};
	let { title, count, past = 0, soon = 0, low = 0, out = false, at, children }: Props = $props();
	const headId = $props.id();
</script>

<!--
	One place of the pantry. Its head tells what needs you before you read its lines. A rule across
	the width shows where the place starts, as the bins of the Shop list, so it needs no card.
-->
<section class="wfd-bin" class:wfd-bin--out={out} style:--at={at} aria-labelledby={headId}>
	<header class="wfd-bin__head">
		<h3 class="wfd-bin__title wfd-display" id={headId}>{title}</h3>
		<span class="wfd-bin__count wfd-number">{count}</span>
		<span class="wfd-bin__stickers">
			{#if past}<Sticker label="{past} past" kind="tomato" />{/if}
			{#if soon}<Sticker label="{soon} soon" />{/if}
			{#if low}<Sticker label="{low} low" kind="amber" />{/if}
		</span>
	</header>
	<div class="wfd-bin__lines">{@render children()}</div>
</section>

<style>
	/* The heavy rule holds the group, so the rules between its lines are soft, and the bars are thin. */
	.wfd-bin {
		--wfd-row-rule: var(--wfd-color-track);
		--wfd-pbar-size: 6px;

		animation: wfd-bin-in var(--wfd-row-motion) backwards;
		animation-delay: calc(var(--at) * var(--wfd-motion-press) / 2);
	}

	@keyframes wfd-bin-in {
		from {
			opacity: 0;
			translate: 0 12px;
		}
	}

	.wfd-bin__head {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group) var(--wfd-space-stack);
		align-items: center;
		padding-block-end: var(--wfd-space-group);
		border-block-end: var(--wfd-border-rule) solid var(--wfd-color-border);
	}

	.wfd-bin__title {
		margin: 0;
		font-size: var(--wfd-font-size-title);
	}

	.wfd-bin__count {
		color: var(--wfd-color-text-faint);
		font-size: var(--wfd-font-size-title);
	}

	.wfd-bin__stickers {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
	}

	/*
	 * The lines fill the width in columns, so that a long place does not leave the width empty. Each
	 * bin has the same columns, so the lines of all bins line up. A line of the Pantry has no photo,
	 * so its columns are narrower than the rows of the Shop.
	 */
	.wfd-bin__lines {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
		column-gap: calc(2 * var(--wfd-space-section));
	}

	/* An open card needs the width for its bar and its buttons, so it takes the full row. */
	.wfd-bin__lines > :global(:has(.wfd-pantry__open)),
	.wfd-bin__lines > :global(.wfd-pantry__open) {
		grid-column: 1 / -1;
	}

	/* The bin has no card, so an open card sits on the surface colour to stand out of the paper. */
	.wfd-bin__lines :global(.wfd-pantry__open) {
		margin-block: var(--wfd-space-group);
		padding: var(--wfd-space-inset);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
	}

	/* Food that is out has no amount and no bar, so it is a set of tags under a dashed rule. */
	.wfd-bin--out .wfd-bin__head {
		border-block-end-style: dashed;
		border-block-end-color: var(--wfd-color-text-faint);
	}

	.wfd-bin--out .wfd-bin__lines {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		padding-block-start: var(--wfd-space-inset);
	}

	.wfd-bin--out .wfd-bin__lines :global(.wfd-pantry__open) {
		flex-basis: 100%;
	}
</style>
