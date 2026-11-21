<script lang="ts">
	import { allIngredients } from '../../match/match';
	import { showName } from '../../match/names';
	import type { PlanDish } from '../../occasion/cook-plan';
	import Tick from '../parts/Tick.svelte';

	// One counter list for all of your dishes: what to put on the counter, by dish. A tick here is a
	// help for the morning. It is not the counter of Cook Mode, and it changes nothing in the pantry.
	type Props = { plan: PlanDish[]; ticked?: Record<string, boolean> };
	let { plan, ticked = $bindable({}) }: Props = $props();

	const dishes = $derived(
		plan.flatMap((one) =>
			one.entry && !one.dish.ready ? [{ one, rows: allIngredients(one.entry.recipe) }] : []
		)
	);
	// A tick is kept by the key of its dish, so it stays with the dish when a line moves in the note.
	const key = (dish: string, row: number) => `${dish}:${row}`;
	const total = $derived(dishes.reduce((sum, { rows }) => sum + rows.length, 0));
	const count = $derived(
		dishes.reduce(
			(sum, { one, rows }) => sum + rows.filter((_, row) => ticked[key(one.key, row)]).length,
			0
		)
	);
</script>

<div class="wfd-out">
	<p class="wfd-out__count wfd-label">{count} of {total} on the counter</p>

	{#each dishes as { one, rows } (one.index)}
		<section class="wfd-out__dish">
			<h3 class="wfd-out__name wfd-display">
				{one.name}
				{#if one.dish.scale !== 1}<span class="wfd-number">×{one.dish.scale}</span>{/if}
			</h3>
			<ul class="wfd-out__rows">
				{#each rows as ingredient, row (row)}
					<li>
						<button
							class="wfd-out__row"
							type="button"
							aria-pressed={!!ticked[key(one.key, row)]}
							onclick={() => (ticked[key(one.key, row)] = !ticked[key(one.key, row)])}
						>
							<Tick on={!!ticked[key(one.key, row)]} />
							<span class="wfd-out__amount wfd-number">{ingredient.amount?.text ?? ''}</span>
							<span class="wfd-out__food">{showName(ingredient.name)}</span>
						</button>
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<p class="wfd-out__none">No dish waits for its food.</p>
	{/each}
</div>

<style>
	.wfd-out {
		display: grid;
		gap: var(--wfd-space-stack);
	}

	.wfd-out__count {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-out__dish {
		display: grid;
		gap: var(--wfd-space-group);
	}

	.wfd-out__name {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: baseline;
		margin: 0;
		padding-block-end: var(--wfd-space-group);
		border-block-end: var(--wfd-border-thin) dashed var(--wfd-color-text-faint);
		font-size: var(--wfd-font-size-title);
	}

	.wfd-out__rows {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	button.wfd-out__row {
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		text-align: start;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}
	}

	.wfd-out__amount {
		flex: none;
		min-inline-size: 4.5ch;
		text-align: end;
	}

	.wfd-out__food {
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.wfd-out__none {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}
</style>
