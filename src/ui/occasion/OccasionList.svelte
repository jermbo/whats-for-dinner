<script lang="ts">
	import { slide } from 'svelte/transition';
	import { daysBetween, showDate } from '../../dates';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { comingOf } from '../../occasion/guests';
	import { nextUp, occasionRows, type Only, type Sort } from '../../occasion/occasion-browse';
	import { isPast } from '../../occasion/occasions';
	import { coverThen } from '../cover';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import GroupHead from '../parts/GroupHead.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import OccasionCard from './OccasionCard.svelte';
	import { tokenTime } from '../motion';

	let { kitchen }: { kitchen: Kitchen } = $props();
	const headId = $props.id();
	const duration = $derived(tokenTime('change'));

	let only = $state<Only>('upcoming');
	let sort = $state<Sort>('near');

	const filters: { value: Only; label: string }[] = [
		{ value: 'upcoming', label: 'Upcoming' },
		{ value: 'past', label: 'Past' },
		{ value: 'all', label: 'All' }
	];
	const sorts: { value: Sort; label: string }[] = [
		{ value: 'near', label: 'Nearest first' },
		{ value: 'new', label: 'Newest first' },
		{ value: 'name', label: 'A to Z' }
	];

	// An occasion is rare, so you usually look at only the next one. It is the ink card, and it is
	// not a row again.
	const next = $derived(nextUp(kitchen.occasions, kitchen.today));
	const rows = $derived(occasionRows(kitchen.occasions, kitchen.today, only, sort, next?.path ?? null));
	const groupTitle = $derived(filters.find((one) => one.value === only)?.label ?? '');
	const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
</script>

<section class="wfd-occasions" aria-labelledby={headId}>
	<PartHead id={headId} title="Occasions" />
	<Button
		kind="olive"
		mark="+"
		onclick={(event) => coverThen(event, 'bg', () => kitchen.openPage({ is: 'new-occasion' }))}
	>
		New occasion
	</Button>

	{#if next}
		<OccasionCard {kitchen} occasion={next} label="Next up" onopen={() => kitchen.showOccasion(next.path)} />
	{/if}

	<div class="wfd-occasions__chips" role="group" aria-label="Filter and sequence">
		{#each filters as one (one.value)}
			<Chip label={one.label} on={only === one.value} onclick={() => (only = one.value)} />
		{/each}
		<span class="wfd-occasions__rule" aria-hidden="true"></span>
		{#each sorts as one (one.value)}
			<Chip label={one.label} on={sort === one.value} onclick={() => (sort = one.value)} />
		{/each}
	</div>

	<GroupHead title={groupTitle} note={String(rows.length)} />
	{#if rows.length}
		<ul class="wfd-occasions__rows">
			{#each rows as occasion (occasion.path)}
				{@const past = isPast(occasion, kitchen.today)}
				<li transition:slide={{ duration }}>
					<button
						class="wfd-occasions__row"
						class:wfd-occasions__row--past={past}
						type="button"
						onclick={() => kitchen.showOccasion(occasion.path)}
					>
						<span class="wfd-occasions__name">{occasion.name}</span>
						<span class="wfd-occasions__meta">
							{occasion.date ? showDate(occasion.date) : 'No date'} · {plural(occasion.dishes.length, 'dish')}
							· {comingOf(occasion)} coming
						</span>
						{#if occasion.date && !past}
							<span class="wfd-occasions__days wfd-number">{daysBetween(kitchen.today, occasion.date)}</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="wfd-occasions__none">No occasion here</p>
	{/if}
</section>

<style>
	.wfd-occasions {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
	}

	/* One row: the filters, a rule, and the sequences. The row scrolls to the side. */
	.wfd-occasions__chips {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.wfd-occasions__rule {
		flex: none;
		inline-size: var(--wfd-border);
		block-size: var(--wfd-space-section);
		background: var(--wfd-color-border);
	}

	.wfd-occasions__rows {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	button.wfd-occasions__row {
		display: grid;
		grid-template:
			'name days' auto
			'meta days' auto / minmax(0, 1fr) auto;
		column-gap: var(--wfd-space-stack);
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: var(--wfd-space-group) 0;
		border: 0;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}
	}

	.wfd-occasions__row--past {
		color: var(--wfd-color-text-muted);
	}

	.wfd-occasions__name {
		grid-area: name;
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.wfd-occasions__meta {
		grid-area: meta;
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-occasions__days {
		grid-area: days;
		align-self: center;
		font-size: var(--wfd-font-size-title);
	}

	.wfd-occasions__none {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}
</style>
