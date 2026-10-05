<script>
	import { resolve } from '$app/paths';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { appear, pop } from '$lib/motion/transitions';

	/**
	 * "Add to Shop": one button that sends each item below the low line to the shopping list.
	 * When all of them are on the list, the button becomes a quiet link to the list.
	 * With no item below the line, it shows nothing.
	 * @type {{ count: number, below: number, onadd: () => void }}
	 *   count: the items below the line that are not on the list. below: all items below the line.
	 */
	let { count, below, onadd } = $props();
</script>

{#if count > 0}
	<button class="to-shop" type="button" onclick={onadd} in:appear>
		<span>
			Add
			{#key count}<span class="to-shop__count" in:pop>{count}</span>{/key}
			to Shop
		</span>
		<Icon name="next" />
	</button>
{:else if below > 0}
	<a class="to-shop to-shop--done" href={resolve('/shop')} in:appear>
		<span><Icon name="check" /> {below} on the Shop list</span>
		<Icon name="next" />
	</a>
{/if}

<style>
	/* The one olive button of the screen: the answer to "what must I buy?". */
	.to-shop {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		inline-size: 100%;
		min-block-size: var(--button-height);
		padding: var(--space-2) var(--space-5);
		font-size: 1.0625rem;
		font-weight: 800;
		text-align: start;
		text-decoration: none;
		color: var(--ink);
		background: var(--olive);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);
		cursor: pointer;
		transition: scale 0.2s var(--ease-out);

		&:active {
			scale: 0.98;
		}

		& > span {
			display: flex;
			align-items: center;
			gap: 0.35em;
		}
	}

	.to-shop__count {
		display: inline-block;
		font-variant-numeric: tabular-nums;
	}

	/* Done: the items are on the list. A dashed rule, as a thing that waits. */
	.to-shop--done {
		font-size: 0.9375rem;
		font-weight: 700;
		background: none;
		border-style: dashed;
	}
</style>
