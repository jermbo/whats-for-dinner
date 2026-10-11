<script lang="ts">
	import Card from './Card.svelte';
	import Chip from './Chip.svelte';
	import { firstUseBy, totalOf } from './pantry/total';
	import type { FoodItem } from './pantry/types';

	let { item }: { item: FoodItem } = $props();

	// "13 Oct", with the year only when it is not this year.
	function showDate(date: string) {
		const day = new Date(`${date}T00:00`);
		const year = day.getFullYear() === new Date().getFullYear() ? undefined : 'numeric';
		return day.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year });
	}

	const meta = $derived.by(() => {
		if (!item.stocks.length) return 'None in the pantry';
		const places = new Set(item.stocks.map((stock) => stock.place)).size;
		const useBy = firstUseBy(item.stocks);
		return [
			totalOf(item.stocks),
			`${places} ${places === 1 ? 'place' : 'places'}`,
			useBy && `use by ${showDate(useBy)}`
		]
			.filter(Boolean)
			.join(' · ');
	});
</script>

<Card title={item.name} {meta}>
	{#if item.stocks.length}
		<table class="food__stocks">
			<thead>
				<tr>
					<th class="food__column" scope="col">Place</th>
					<th class="food__column" scope="col">Amount</th>
					<th class="food__column" scope="col">Use by</th>
				</tr>
			</thead>
			<tbody>
				{#each item.stocks as stock}
					<tr>
						<td class="food__cell">{stock.place}</td>
						<td class="food__cell food__cell--number">{stock.amountText}</td>
						<td class="food__cell">{stock.useBy ? showDate(stock.useBy) : ''}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	{#if item.brands.length}
		<p class="food__brands">
			<span class="food__label">Brands</span>
			{#each item.brands as brand}
				<Chip label={brand} />
			{/each}
		</p>
	{/if}
</Card>

<style>
	.food__stocks {
		inline-size: 100%;
		border-collapse: collapse;
	}

	.food__column {
		padding-block: var(--size-2-2);
		color: var(--text-muted);
		font-size: var(--font-ui-smaller);
		font-weight: var(--font-normal);
		text-align: start;
	}

	.food__cell {
		padding-block: var(--size-2-3);
		border-block-start: var(--border-width) solid var(--background-modifier-border);
	}

	.food__cell--number {
		font-variant-numeric: tabular-nums;
	}

	.food__brands {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-2-2);
		align-items: center;
		margin-block: var(--size-4-3) 0;
	}

	.food__label {
		margin-inline-end: var(--size-2-2);
		color: var(--text-muted);
		font-size: var(--font-ui-smaller);
	}
</style>
