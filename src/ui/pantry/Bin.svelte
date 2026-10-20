<script lang="ts">
	import type { Snippet } from 'svelte';
	import Panel from '../parts/Panel.svelte';
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
	<Panel kind={out ? 'empty' : 'surface'}>
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
	</Panel>
</section>

<style>
	/* The card holds the group, so the rules between its lines are soft, and the bars are thin. */
	.wfd-bin {
		--wfd-row-rule: var(--wfd-color-track);
		--wfd-pbar-size: 6px;

		break-inside: avoid;
		margin-block-end: var(--wfd-space-section);
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
		padding-block-end: var(--wfd-space-inset);
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
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
		gap: var(--wfd-space-group);
		margin-inline-start: auto;
	}

	.wfd-bin__lines > :global(:last-child .wfd-line) {
		border-block-end: 0;
	}

	/* An open card sits on the paper, so that it stands out of the bin. */
	.wfd-bin__lines :global(.wfd-pantry__open) {
		margin-inline: calc(-1 * var(--wfd-space-inset));
		padding: var(--wfd-space-inset);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-bg);
	}

	/* Food that is out has no amount and no bar, so it is a set of tags with no card. */

	.wfd-bin--out .wfd-bin__lines {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		padding-block: var(--wfd-space-inset) var(--wfd-space-group);
	}

	.wfd-bin--out .wfd-bin__lines :global(.wfd-pantry__open) {
		flex-basis: 100%;
	}
</style>
