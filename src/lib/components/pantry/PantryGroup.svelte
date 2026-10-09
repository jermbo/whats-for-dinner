<script>
	import PantryGauge from './PantryGauge.svelte';

	/**
	 * @typedef {import('$lib/domain/pantry-view').PantryGroup} Group
	 * @typedef {import('$lib/domain/pantry-view').PantryRow} PantryRow
	 */

	/**
	 * One group of the pantry: a title with a small note at its right, and a gauge for each item.
	 * @type {{ group: Group, fresh?: string, onmore: (row: PantryRow) => void }}
	 *   fresh: the ID of the item that the owner added a moment ago.
	 */
	let { group, fresh = '', onmore } = $props();

	const uid = $props.id();
</script>

<section class="stack stack--tight" aria-labelledby="{uid}-title">
	<div class="pantry-group__head" data-regroup="title-{group.key}">
		<h2 class="pantry-group__title" id="{uid}-title">{group.label}</h2>
		{#if group.note}
			<p class="pantry-group__note">{group.note}</p>
		{/if}
	</div>

	<ul class="gauges">
		{#each group.rows as row (row.item.id)}
			<PantryGauge
				item={row.item}
				ingredient={row.ingredient}
				left={row.left}
				fresh={row.item.id === fresh}
				onmore={() => onmore(row)}
			/>
		{/each}
	</ul>
</section>

<style>
	/* As a section title: Anton, with a heavy rule under it. The note shares the line. */
	.pantry-group__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block-end: var(--space-1);
		border-block-end: var(--rule-4) solid var(--ink);
	}

	.pantry-group__title {
		font-size: 1.5rem;
	}

	.pantry-group__note {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--ink-soft);
	}
</style>
