<script lang="ts">
	import type { Bar } from '../../pantry/level';
	import type { BarPart } from '../../pantry/pantry-bar';
	import ListLine from '../parts/ListLine.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import PantryBar from './PantryBar.svelte';

	type Props = {
		name: string;
		// The line below the name: the place, or the total of the food item.
		note: string;
		amount: string;
		// The number of packages of the line. The line shows it with 2 or more.
		packages?: number;
		// The level of the food item. Null when the plugin cannot count the amount.
		bar: Bar | null;
		// One part for each package of the food item, the packages of this place first.
		parts?: BarPart[];
		// The days until the use-by date. A badge shows only when the date is near.
		days: number | null;
		soon: boolean;
		onclick: () => void;
	};
	let { name, note, amount, packages = 1, bar, parts = [], days, soon, onclick }: Props = $props();

	const badge = $derived.by(() => {
		if (days === null || !soon) return null;
		if (days < 0) return { label: 'Past its date', kind: 'tomato' as const };
		if (days === 0) return { label: 'Use today', kind: 'tomato' as const };
		return { label: `${days} ${days === 1 ? 'day' : 'days'}`, kind: 'outline' as const };
	});
</script>

<!-- One food item in one place, with all its packages there. A tap opens it, so that you can change it. -->
<button class="wfd-line" class:wfd-line--none={!amount} type="button" {onclick}>
	<ListLine
		{name}
		small={note || undefined}
		number={amount || 'None'}
		numberSmall={packages > 1 ? `${packages} packages` : undefined}
		hint={bar?.isLow ? ', low' : undefined}
	>
		{#snippet tag()}
			{#if badge}<Sticker label={badge.label} kind={badge.kind} />{/if}
		{/snippet}
	</ListLine>
	{#if parts.length || !amount}<PantryBar {parts} low={bar?.isLow ?? false} />{/if}
</button>

<style>
	button.wfd-line {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-group);
		align-content: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 56px;
		padding: var(--wfd-space-group) 0 var(--wfd-space-inset);
		border: 0;
		/* A bin makes the rule soft, because its card already holds the lines. */
		border-block-end: var(--wfd-border-thin) solid var(--wfd-row-rule, var(--wfd-color-border));
		border-radius: var(--wfd-radius-button);
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		white-space: normal;
		cursor: pointer;
		transition:
			background-color var(--wfd-motion-change) var(--wfd-ease-out),
			box-shadow var(--wfd-motion-change) var(--wfd-ease-out),
			scale var(--wfd-button-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -3px;
		}

		/* A small press tells that the tap arrived. */
		&:active {
			scale: 0.99;
		}
	}

	/* Under a pointer, a soft tint that goes a little past the text on each side. */
	@media (hover: hover) {
		button.wfd-line:hover {
			--tint: color-mix(in oklab, var(--wfd-color-text) 5%, transparent);

			background: var(--tint);
			box-shadow:
				-10px 0 0 var(--tint),
				10px 0 0 var(--tint);
		}
	}

	/* A dashed rule is an empty place: the pantry has none of this food. */
	button.wfd-line--none {
		border-block-end-style: dashed;
		color: var(--wfd-color-text-muted);
	}
</style>
