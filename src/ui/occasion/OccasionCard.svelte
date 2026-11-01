<script lang="ts">
	import type { Snippet } from 'svelte';
	import { showDate } from '../../dates';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { comingOf, openJobsOf } from '../../occasion/guests';
	import { daysLabel, type Occasion } from '../../occasion/occasions';

	export type Section = 'guests' | 'who' | 'buy' | 'todo';

	// The ink card of an occasion: "Next up" in the list, and the top of the screen of the occasion,
	// so the two read as one thing. In the list the card is one button. On the screen each number
	// is a button that goes to its section, and the side has "⋯".
	type Props = {
		kitchen: Kitchen;
		occasion: Occasion;
		label?: string;
		onopen?: () => void;
		onpick?: (section: Section) => void;
		side?: Snippet;
	};
	let { kitchen, occasion, label, onopen, onpick, side }: Props = $props();

	const when = $derived(
		[occasion.date ? showDate(occasion.date) : 'No date', daysLabel(occasion.date, kitchen.today)]
			.filter(Boolean)
			.join(' · ')
	);
	const numbers = $derived([
		{ key: 'guests' as const, n: comingOf(occasion), word: 'coming' },
		{ key: 'who' as const, n: openJobsOf(occasion), word: 'open' },
		{ key: 'buy' as const, n: kitchen.toBuyOf(occasion).length, word: 'to buy' },
		{ key: 'todo' as const, n: occasion.tasks.filter((task) => !task.done).length, word: 'to do' }
	]);
</script>

{#snippet inside(asButtons: boolean)}
	<span class="wfd-occasion-card__top">
		<span class="wfd-label">{label ? `${label} · ${when}` : when}</span>
		{#if side}{@render side()}{/if}
	</span>
	<span class="wfd-occasion-card__name wfd-display">{occasion.name}</span>
	<span class="wfd-occasion-card__numbers">
		{#each numbers as one (one.key)}
			{#if asButtons}
				<button class="wfd-occasion-card__number" type="button" onclick={() => onpick?.(one.key)}>
					<b class="wfd-number">{one.n}</b>{one.word}
				</button>
			{:else}
				<span class="wfd-occasion-card__number"><b class="wfd-number">{one.n}</b>{one.word}</span>
			{/if}
		{/each}
	</span>
{/snippet}

{#if onopen}
	<button class="wfd-occasion-card wfd-occasion-card--open" type="button" onclick={onopen}>
		{@render inside(false)}
	</button>
{:else}
	<div class="wfd-occasion-card">{@render inside(true)}</div>
{/if}

<style>
	/* The ink of the kitchen: each piece inside reads on it. */
	.wfd-occasion-card {
		--wfd-color-text: var(--wfd-color-on-selected);
		--wfd-color-text-muted: var(--wfd-color-on-selected);
		--wfd-color-border: var(--wfd-color-on-selected);
		--wfd-color-control: transparent;
		--wfd-color-focus: var(--wfd-color-on-selected);

		display: grid;
		gap: var(--wfd-space-group);
		inline-size: 100%;
		box-sizing: border-box;
		padding: var(--wfd-space-section) var(--wfd-space-section) var(--wfd-space-inset);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
		text-align: start;
	}

	button.wfd-occasion-card--open {
		block-size: auto;
		border: 0;
		box-shadow: none;
		font-family: inherit;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}
	}

	.wfd-occasion-card__top {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		justify-content: space-between;
		min-block-size: var(--wfd-control-min);
	}

	.wfd-occasion-card__name {
		font-size: var(--wfd-font-size-head);
		overflow-wrap: anywhere;
	}

	.wfd-occasion-card__numbers {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--wfd-space-tight);
	}

	.wfd-occasion-card__number {
		display: grid;
		justify-items: start;
		padding: var(--wfd-space-group);
		font-size: var(--wfd-font-size-small);

		& b {
			font-size: var(--wfd-font-size-title);
		}
	}

	button.wfd-occasion-card__number {
		block-size: auto;
		border: var(--wfd-border) solid transparent;
		border-radius: var(--wfd-radius-button);
		background: none;
		box-shadow: none;
		color: inherit;
		font-family: inherit;
		cursor: pointer;

		&:hover,
		&:focus-visible {
			border-color: var(--wfd-color-on-selected);
			outline: none;
		}
	}
</style>
