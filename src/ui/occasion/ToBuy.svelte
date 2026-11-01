<script lang="ts">
	import type { ShoppingRow } from '../../shop/shopping-list';
	import GroupHead from '../parts/GroupHead.svelte';
	import ListLine from '../parts/ListLine.svelte';
	import OnTheList from '../pantry/OnTheList.svelte';

	type Props = {
		rows: ShoppingRow[];
		// From 7 days before the date, the rows are on the list with no tap.
		listed: boolean;
		isOnList: (key: string) => boolean;
		onadd: (key: string) => void;
	};
	let { rows, listed, isOnList, onadd }: Props = $props();
</script>

<!-- What your dishes need and the pantry does not have. Before the week of the day, one tap puts a row on the list early. -->
<section class="wfd-to-buy">
	<GroupHead title="To buy" note={rows.length ? String(rows.length) : ''} />
	{#if rows.length}
		<ul class="wfd-to-buy__list">
			{#each rows as row (row.key)}
				<li class="wfd-to-buy__row">
					<ListLine name={row.name} number={row.amount || undefined} />
					<OnTheList onList={listed || isOnList(row.key)} onadd={() => onadd(row.key)} />
				</li>
			{/each}
		</ul>
	{:else}
		<p class="wfd-to-buy__none">All in the pantry</p>
	{/if}
</section>

<style>
	.wfd-to-buy {
		display: grid;
		gap: var(--wfd-space-group);
	}

	.wfd-to-buy__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-to-buy__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
	}

	.wfd-to-buy__row :global(.wfd-on-list) {
		padding-block-start: 0;
	}

	.wfd-to-buy__none {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}
</style>
