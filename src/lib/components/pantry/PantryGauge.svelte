<script>
	import Gauge from '$lib/components/ui/Gauge.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { setQuantity, setState } from '$lib/data/pantry';
	import { pantryScale, stateAt } from '$lib/domain/pantry-scale';
	import { lessMotion } from '$lib/motion/less-motion.svelte';
	import { collapse } from '$lib/motion/transitions';

	/** @typedef {import('$lib/types').PantryItem} PantryItem */

	/**
	 * One pantry item as a gauge. The other edits are behind the "more" button.
	 * In a pantry check, each change is a correction. On the pantry screen, a smaller amount
	 * is an amount that was used.
	 * @type {{
	 *   item: PantryItem,
	 *   ingredient: import('$lib/types').Ingredient,
	 *   note?: string,
	 *   done?: boolean,
	 *   checking?: boolean,
	 *   fresh?: boolean,
	 *   onchange?: () => void,
	 *   onmore: () => void
	 * }}
	 *   fresh: the owner added this item a moment ago. The screen moves to the row, and a row
	 *   that is new fills from zero.
	 */
	let {
		item,
		ingredient,
		note,
		done,
		checking = false,
		fresh = false,
		onchange,
		onmore
	} = $props();

	/** @type {HTMLElement | undefined} */
	let node = $state();

	$effect(() => {
		if (fresh)
			node?.scrollIntoView({ block: 'center', behavior: lessMotion.current ? 'auto' : 'smooth' });
	});

	const scale = $derived(pantryScale(item, ingredient));

	/** @param {number} value */
	async function change(value) {
		if (ingredient.tracking === 'state') {
			await setState(ingredient.id, stateAt(value), 'corrected');
		} else {
			const cause = checking || value > item.quantity ? 'corrected' : 'used';
			await setQuantity(ingredient.id, value, cause);
		}
		onchange?.();
	}
</script>

<li class="pantry-gauge" data-regroup={item.id} bind:this={node} transition:collapse>
	<Gauge
		label={ingredient.name}
		{scale}
		{note}
		{done}
		from={fresh ? 0 : undefined}
		delay={350}
		onchange={change}
	/>

	<button class="pantry-gauge__more" type="button" onclick={onmore}>
		<Icon name="more" />
		<span class="visually-hidden">More options for {ingredient.name}</span>
	</button>
</li>

<style>
	.pantry-gauge {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-1);
	}

	.pantry-gauge__more {
		display: grid;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		padding: 0;
		color: var(--ink-soft);
		background: none;
		border: 0;
		border-radius: var(--radius-control);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s,
			scale 0.25s var(--ease-spring);

		&:hover {
			color: var(--ink);
			background: var(--paper-deep);
		}

		&:active {
			scale: 0.9;
		}
	}
</style>
