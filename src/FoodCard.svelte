<script lang="ts">
	import Card from './Card.svelte';
	import Chip from './Chip.svelte';
	import { daysBetween, showDate } from './dates';
	import { SOON_DAYS } from './match/match';
	import { makeStock } from './pantry/food-item';
	import { firstUseBy, totalOf } from './pantry/total';
	import type { FoodItem, Stock } from './pantry/types';

	type Props = {
		item: FoodItem;
		today: string;
		// The places that the pantry has, as proposals.
		places: string[];
		onsave: (stocks: Stock[]) => void;
		onopen: () => void;
	};
	let { item, today, places, onsave, onopen }: Props = $props();

	const uid = $props.id();
	const useBy = $derived(firstUseBy(item.stocks));

	const meta = $derived.by(() => {
		if (!item.stocks.length) return 'None in the pantry';
		const count = new Set(item.stocks.map((stock) => stock.place)).size;
		return [
			totalOf(item.stocks),
			`${count} ${count === 1 ? 'place' : 'places'}`,
			useBy && `use by ${showDate(useBy)}`
		]
			.filter(Boolean)
			.join(' · ');
	});

	const warning = $derived.by(() => {
		if (!useBy) return [];
		const days = daysBetween(today, useBy);
		return days < 0 ? ['Past its date'] : days <= SOON_DAYS ? ['Use soon'] : [];
	});

	// The rows while you change them. The text of each field is as you type it.
	let rows = $state<{ place: string; amount: string; useBy: string }[] | null>(null);

	function change() {
		rows = item.stocks.map((stock) => ({
			place: stock.place,
			amount: stock.amountText,
			useBy: stock.useBy ?? ''
		}));
	}

	function save(event: SubmitEvent) {
		event.preventDefault();
		// A row with no place goes out of the note.
		const kept = (rows ?? []).filter((row) => row.place.trim());
		onsave(kept.map((row) => makeStock(row.place, row.amount, row.useBy)));
		rows = null;
	}
</script>

<Card title={item.name} {meta} tags={warning}>
	{#if rows}
		<form class="food__form" onsubmit={save}>
			{#each rows as row, at}
				<fieldset class="food__row">
					<legend class="food__legend">Place {at + 1}</legend>
					<input
						type="text"
						aria-label="Place"
						placeholder="Place"
						list="{uid}-places"
						bind:value={row.place}
					/>
					<input type="text" aria-label="Amount" placeholder="Amount" bind:value={row.amount} />
					<input type="date" aria-label="Use by" bind:value={row.useBy} />
					<button
						class="food__button"
						type="button"
						aria-label="Remove place {at + 1}"
						onclick={() => rows?.splice(at, 1)}
					>
						Remove
					</button>
				</fieldset>
			{/each}

			<div class="food__actions">
				<button
					class="food__button"
					type="button"
					onclick={() => rows?.push({ place: '', amount: '', useBy: '' })}
				>
					Add a place
				</button>
				<button class="food__button" type="button" onclick={() => (rows = null)}>Cancel</button>
				<button class="food__button mod-cta" type="submit">Save</button>
			</div>

			<datalist id="{uid}-places">
				{#each places as option}
					<option value={option}></option>
				{/each}
			</datalist>
		</form>
	{:else}
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
			<p class="food__chips">
				<span class="food__label">Brands</span>
				{#each item.brands as brand}
					<Chip label={brand} />
				{/each}
			</p>
		{/if}
		{#if item.aliases.length}
			<p class="food__chips">
				<span class="food__label">Other names</span>
				{#each item.aliases as alias}
					<Chip label={alias} />
				{/each}
			</p>
		{/if}

		<div class="food__actions">
			<button class="food__button" type="button" onclick={onopen}>Open note</button>
			<button class="food__button" type="button" onclick={change}>Change</button>
		</div>
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

	.food__chips {
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

	.food__form {
		display: grid;
		gap: var(--size-4-3);
	}

	.food__row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 7rem), 1fr));
		gap: var(--size-4-2);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.food__row :global(input) {
		inline-size: 100%;
		min-block-size: 44px;
	}

	.food__legend {
		padding: 0;
		color: var(--text-muted);
		font-size: var(--font-ui-smaller);
	}

	.food__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-4-2);
		justify-content: end;
		margin-block-start: var(--size-4-3);
	}

	.food__button {
		min-block-size: 44px;
	}
</style>
