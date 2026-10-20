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
		// Food that is out: a dashed bin of tags, with no card.
		out?: boolean;
		// The position of the bin, so that the bins come in one after the other.
		at: number;
		children: Snippet;
	};
	let { title, count, past = 0, soon = 0, low = 0, out = false, at, children }: Props = $props();
	const headId = $props.id();
</script>

<!-- One place of the pantry. Its head tells what needs you before you read its lines. -->
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
	/* The card holds the group, so the rules between its lines are soft, and the bars are thin. */
	.wfd-bin {
		--wfd-row-rule: var(--wfd-track);
		--wfd-pbar-size: 6px;

		break-inside: avoid;
		margin-block-end: 16px;
		padding: 16px 18px 8px;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-card);
		animation: wfd-bin-in 0.35s ease-out backwards;
		animation-delay: calc(var(--at) * 60ms);
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
		gap: 6px 10px;
		align-items: center;
		padding-block-end: 10px;
		border-block-end: 2px solid var(--wfd-ink);
	}

	.wfd-bin__title {
		margin: 0;
		font-size: 22px;
	}

	.wfd-bin__count {
		color: var(--wfd-ink-3);
		font-size: 22px;
	}

	.wfd-bin__stickers {
		display: flex;
		gap: 6px;
		margin-inline-start: auto;
	}

	.wfd-bin__lines > :global(:last-child .wfd-line) {
		border-block-end: 0;
	}

	/* An open card sits on the paper, so that it stands out of the bin. */
	.wfd-bin__lines :global(.wfd-pantry__open) {
		margin-inline: -10px;
		padding: 10px;
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-paper);
	}

	/* Food that is out has no amount and no bar, so it is a set of tags with no card. */
	.wfd-bin--out {
		border: 2px dashed var(--wfd-ink-3);
		background: none;
	}

	.wfd-bin--out .wfd-bin__lines {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding-block: 12px 8px;
	}

	.wfd-bin--out .wfd-bin__lines :global(.wfd-pantry__open) {
		flex-basis: 100%;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-bin {
			animation: none;
		}
	}
</style>
