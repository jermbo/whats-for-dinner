<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { pop } from '$lib/motion/transitions';
	import { formatQuantity } from '$lib/util/format';

	/** An item this old shows its age in a warning color. */
	const OLD_DAYS = 7;

	/**
	 * One food item to use first. A tap selects it, and the ideas show only the recipes with the
	 * selected food. An item that the menu uses completely has a check, and no tap.
	 * @type {{
	 *   soon: import('$lib/data/use-up').SoonItem,
	 *   pressed: boolean,
	 *   ontoggle: () => void
	 * }}
	 */
	let { soon, pressed, ontoggle } = $props();

	const planned = $derived(soon.free === 0);
	const amount = $derived(
		soon.ingredient.tracking === 'quantity'
			? formatQuantity(soon.free, soon.ingredient.unit)
			: 'Have'
	);
	const age = $derived(
		soon.days === 0 ? 'New today' : `${soon.days} ${soon.days === 1 ? 'day' : 'days'}`
	);
</script>

{#if planned}
	<div class="soon soon--planned">
		<span class="soon__name">{soon.ingredient.name}</span>
		<span class="soon__amount" in:pop><Icon name="check" /> On the menu</span>
		<span class="soon__age"><span class="visually-hidden">In stock:</span> {age}</span>
	</div>
{:else}
	<button
		class={['soon', soon.days >= OLD_DAYS && 'soon--old']}
		type="button"
		aria-pressed={pressed}
		onclick={ontoggle}
	>
		<span class="soon__name">{soon.ingredient.name}</span>
		<span class="soon__amount">
			{#key amount}<span in:pop>{amount}</span>{/key}
		</span>
		<span class="soon__age">
			<Icon name="clock" />
			<span class="visually-hidden">In stock:</span>
			{age}
		</span>
	</button>
{/if}

<style>
	.soon {
		display: grid;
		gap: 0.15rem;
		min-inline-size: 7.5rem;
		min-block-size: 100%;
		padding: var(--space-3) var(--space-4);
		text-align: start;
		background: var(--color-surface);
		border: 2px solid transparent;
		border-radius: 1rem;
		box-shadow: var(--shadow);
		cursor: pointer;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.95;
		}

		/* Selected: a teal line and a teal tint. The line is the sign, not only the color. */
		&[aria-pressed='true'] {
			background: var(--color-accent-soft);
			border-color: var(--color-accent-strong);
		}
	}

	.soon__name {
		font-weight: 600;
		white-space: nowrap;
	}

	.soon__amount {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: 1.1rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.soon__age {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--color-muted);
		font-size: 0.8rem;
	}

	.soon__amount :global(.icon),
	.soon__age :global(.icon) {
		inline-size: 1rem;
		block-size: 1rem;
	}

	/* Old stock: the age is in a dark amber, and bold. */
	.soon--old .soon__age {
		color: color-mix(in srgb, var(--color-low-strong), black 35%);
		font-weight: 600;
	}

	/* Planned: the menu uses all of it. It is quiet, with a check. */
	.soon--planned {
		color: var(--color-muted);
		background: transparent;
		border: 2px dashed var(--color-border);
		box-shadow: none;
		cursor: default;

		& .soon__amount {
			font-size: 0.9rem;
			color: var(--color-accent-strong);
		}
	}
</style>
