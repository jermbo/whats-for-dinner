<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { pop } from '$lib/motion/transitions';
	import { formatQuantity } from '$lib/util/format';

	/** An item this old shows its age in a warning color. */
	const OLD_DAYS = 7;

	/**
	 * One food item to use first. A tap selects it, and the ideas show only the recipes with the
	 * selected food. An item that the menu uses completely has a check, and no tap.
	 * With no "ontoggle", the item only shows the food, and it has no tap.
	 * @type {{
	 *   soon: import('$lib/domain/use-up').SoonItem,
	 *   pressed: boolean,
	 *   ontoggle?: () => void
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

{#snippet food()}
	<span class="soon__name">{soon.ingredient.name}</span>
	<span class="soon__amount">
		{#key amount}<span in:pop>{amount}</span>{/key}
	</span>
	<span class="soon__age">
		<Icon name="clock" />
		<span class="visually-hidden">In stock:</span>
		{age}
	</span>
{/snippet}

{#if planned}
	<div class="soon soon--planned">
		<span class="soon__name">{soon.ingredient.name}</span>
		<span class="soon__amount" in:pop><Icon name="check" /> On the menu</span>
		<span class="soon__age"><span class="visually-hidden">In stock:</span> {age}</span>
	</div>
{:else if ontoggle}
	<button
		class={['soon', 'soon--tap', soon.days >= OLD_DAYS && 'soon--old']}
		type="button"
		aria-pressed={pressed}
		onclick={ontoggle}
	>
		{@render food()}
	</button>
{:else}
	<div class={['soon', soon.days >= OLD_DAYS && 'soon--old']}>
		{@render food()}
	</div>
{/if}

<style>
	/* A tag of food on the paper: white, with an ink rule. */
	.soon {
		display: grid;
		gap: 0.15rem;
		min-inline-size: 7.5rem;
		min-block-size: 100%;
		padding: var(--space-3) var(--space-4);
		text-align: start;
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);
		transition:
			background-color 0.2s,
			color 0.2s,
			scale 0.2s var(--ease-out);

		/* Selected: an ink fill. The fill is the sign, and the check of the list is too. */
		&[aria-pressed='true'] {
			color: var(--paper);
			background: var(--ink);

			& .soon__age {
				color: inherit;
			}
		}
	}

	/* An item that a tap selects. */
	.soon--tap {
		cursor: pointer;

		&:active {
			scale: 0.96;
		}

		/* Only for a mouse: on a touch screen, a hover stays after the tap. */
		@media (hover: hover) {
			&:hover:not([aria-pressed='true']) {
				background: var(--paper-deep);
			}
		}
	}

	.soon__name {
		font-weight: 800;
		white-space: nowrap;
	}

	.soon__amount {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-family: var(--font-display);
		font-size: 1.375rem;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.soon__age {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--ink-soft);
		font-size: 0.8rem;
		font-weight: 600;
	}

	.soon__amount :global(.icon),
	.soon__age :global(.icon) {
		inline-size: 1rem;
		block-size: 1rem;
	}

	/* Old stock: the age is in tomato, and bold. */
	.soon--old .soon__age {
		color: var(--tomato-text);
		font-weight: 800;
	}

	.soon--old[aria-pressed='true'] .soon__age {
		color: inherit;
	}

	/* Planned: the menu uses all of it. It is quiet, with a dashed rule. */
	.soon--planned {
		color: var(--ink-soft);
		background: transparent;
		border-style: dashed;

		& .soon__amount {
			font-family: var(--font-body);
			font-size: 0.9rem;
			font-weight: 700;
			color: var(--ink);
		}
	}
</style>
