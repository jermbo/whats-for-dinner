<script lang="ts">
	import type { Snippet } from 'svelte';
	import Chip from './Chip.svelte';

	type Props = { title: string; meta: string; tags?: string[]; children: Snippet };
	let { title, meta, tags = [], children }: Props = $props();
</script>

<!-- A card that opens: the summary is always in view, and the body shows after a tap. -->
<details class="card">
	<summary class="card__summary">
		<h3 class="card__title">{title}</h3>
		<span class="card__meta">{meta}</span>
		{#if tags.length}
			<span class="card__tags">
				{#each tags as tag}
					<Chip label={tag} />
				{/each}
			</span>
		{/if}
	</summary>

	<div class="card__body">
		{@render children()}
	</div>
</details>

<style>
	.card {
		border: var(--border-width) solid var(--background-modifier-border);
		border-radius: var(--radius-m);
		background: var(--background-secondary);
	}

	.card__summary {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--size-2-2) var(--size-4-3);
		align-items: center;
		min-block-size: 44px;
		padding: var(--size-4-3) var(--size-4-4);
		border-radius: var(--radius-m);
		list-style: none;
		cursor: pointer;

		/* The grid removes the marker of the browser, so the card draws its own. */
		&::-webkit-details-marker {
			display: none;
		}

		&::after {
			content: '';
			grid-area: 1 / 2;
			inline-size: var(--size-4-2);
			block-size: var(--size-4-2);
			border-inline-end: 2px solid var(--text-muted);
			border-block-end: 2px solid var(--text-muted);
			rotate: 45deg;
			transition: rotate 0.2s ease-out;
		}

		&:focus-visible {
			outline: 2px solid var(--interactive-accent);
			outline-offset: 2px;
		}

		@media (hover: hover) {
			&:hover {
				background: var(--background-modifier-hover);
			}
		}
	}

	.card[open] > .card__summary::after {
		rotate: 225deg;
	}

	.card__title,
	.card__meta,
	.card__tags {
		grid-column: 1;
	}

	.card__title {
		margin: 0;
		font-size: var(--font-ui-medium);
		font-weight: var(--font-semibold);
	}

	.card__meta {
		color: var(--text-muted);
		font-size: var(--font-ui-small);
	}

	.card__tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-2-2);
	}

	.card__body {
		padding: 0 var(--size-4-4) var(--size-4-3);
	}

	.card[open] > .card__body {
		animation: reveal 0.2s ease-out;
	}

	@keyframes reveal {
		from {
			opacity: 0;
			translate: 0 calc(-1 * var(--size-4-2));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card__summary::after {
			transition: none;
		}

		.card[open] > .card__body {
			animation: none;
		}
	}
</style>
