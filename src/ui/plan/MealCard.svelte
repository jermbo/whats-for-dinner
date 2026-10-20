<script lang="ts">
	import type { Meal } from '../../plan/types';
	import Button from '../parts/Button.svelte';
	import Count from '../parts/Count.svelte';
	import Panel from '../parts/Panel.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import PrepNote from '../recipes/PrepNote.svelte';

	type Props = {
		meal: Meal;
		// The meal is a meal of today. Only a meal of today has "Cook".
		today: boolean;
		ontoday: (on: boolean) => void;
		onprep: (done: boolean) => void;
		onremove: () => void;
		oncook: () => void;
	};
	let { meal, today, ontoday, onprep, onremove, oncook }: Props = $props();

	const { path, entry, prepDone } = $derived(meal);
	// Preparation that waits comes before "Cook": the main button is the one that you need next.
	const ready = $derived(!entry?.prep || prepDone);
</script>

<Panel>
	<article class="wfd-meal">
		<div class="wfd-meal__top">
			<h3 class="wfd-meal__name wfd-display">{entry?.recipe.title ?? path}</h3>
			{#if entry}
				<Count have={entry.match.inPantry} of={entry.match.ingredients.length} />
			{/if}
		</div>
		<div class="wfd-meal__facts">
			{#if entry}
				{@const toBuy = entry.match.ingredients.length - entry.match.inPantry}
				{@const toCheck = entry.match.ingredients.filter((one) => one.status === 'unknown').length}
				<span class="wfd-label">
					{toBuy ? `${toBuy} to buy` : 'All in the pantry'}{toCheck ? ` · ${toCheck} to check` : ''}
				</span>
				{#if entry.match.useSoon.length}
					<Sticker label="Uses {entry.match.useSoon.join(' · ')}" kind="tomato" />
				{/if}
			{:else}
				<span class="wfd-label">The note of this recipe is gone</span>
			{/if}
		</div>
		{#if entry?.prep}
			<PrepNote text={entry.prep} done={prepDone} onchange={onprep} />
		{/if}
		<div class="wfd-meal__actions">
			{#if today && entry}
				<Button onclick={() => ontoday(false)}>Not today</Button>
				<Button kind={ready ? 'main' : 'quiet'} onclick={oncook}>Cook →</Button>
			{:else}
				<Button onclick={onremove}>Remove</Button>
				{#if entry}
					<Button kind="main" onclick={() => ontoday(true)}>Today</Button>
				{/if}
			{/if}
		</div>
	</article>
</Panel>

<style>
	.wfd-meal {
		display: grid;
		gap: var(--wfd-space-stack);
		align-content: space-between;
		block-size: 100%;
	}

	.wfd-meal__top {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: start;
		justify-content: space-between;
	}

	.wfd-meal__name {
		margin: 0;
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-name);
	}

	.wfd-meal__facts {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		align-items: center;
		padding-block-end: var(--wfd-space-inset);
		border-block-end: var(--wfd-border) solid var(--wfd-color-border);
		color: var(--wfd-color-text-muted);
	}

	.wfd-meal__actions {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		gap: var(--wfd-space-stack);
	}
</style>
