<script>
	import { isUrgent, leftText } from '$lib/domain/use-by';

	/** The most items that the list shows. */
	const MAX = 4;

	/**
	 * The food to use first, as a ruled list: the name, and a badge with the days that are left.
	 * The earliest date is first. Only "Use today" has a tomato badge.
	 * @type {{ items: import('$lib/domain/use-up').SoonItem[] }}
	 */
	let { items } = $props();

	const uid = $props.id();

	const shown = $derived(items.filter((item) => item.free > 0).slice(0, MAX));
</script>

<section class="soon-list" aria-labelledby="{uid}-title">
	<h2 id="{uid}-title">Use soon</h2>

	{#if shown.length > 0}
		<ul class="soon-list__rows">
			{#each shown as soon (soon.ingredient.id)}
				<li class="soon-list__row">
					<span>{soon.ingredient.name}</span>
					<span class={['badge', isUrgent(soon.left) && 'badge--urgent']}>
						{leftText(soon.left)}
					</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="soon-list__empty">No fresh food waits.</p>
	{/if}
</section>

<style>
	.soon-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.soon-list h2 {
		padding-block-end: var(--space-1);
		border-block-end: var(--rule-4) solid var(--ink);
	}

	.soon-list__rows {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.soon-list__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		min-block-size: 2.5rem;
		font-size: 0.9375rem;
		font-weight: 600;
		border-block-end: var(--rule-1) solid var(--hairline);
	}

	.soon-list__empty {
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}
</style>
