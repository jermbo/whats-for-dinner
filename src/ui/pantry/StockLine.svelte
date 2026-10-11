<script lang="ts">
	import Sticker from '../parts/Sticker.svelte';

	type Props = {
		name: string;
		// The line below the name: the place, or the total of the food item.
		note: string;
		amount: string;
		// The days until the use-by date. A badge shows only when the date is near.
		days: number | null;
		soon: boolean;
		onclick: () => void;
	};
	let { name, note, amount, days, soon, onclick }: Props = $props();

	const badge = $derived.by(() => {
		if (days === null || !soon) return null;
		if (days < 0) return { label: 'Past its date', kind: 'tomato' as const };
		if (days === 0) return { label: 'Use today', kind: 'tomato' as const };
		return { label: `${days} ${days === 1 ? 'day' : 'days'}`, kind: 'outline' as const };
	});
</script>

<!-- One food item in one place. A tap opens it, so that you can change it. -->
<button class="wfd-line" class:wfd-line--none={!amount} type="button" {onclick}>
	<span class="wfd-line__text">
		<span class="wfd-line__name">{name}</span>
		{#if note}<span class="wfd-line__note">{note}</span>{/if}
	</span>
	{#if badge}<Sticker label={badge.label} kind={badge.kind} />{/if}
	<span class="wfd-line__amount wfd-number">{amount || 'None'}</span>
</button>

<style>
	button.wfd-line {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 12px;
		align-items: center;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 56px;
		padding: 8px 0;
		border: 0;
		border-block-end: 1px solid var(--wfd-line);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: -3px;
		}
	}

	/* A dashed rule is an empty place: the pantry has none of this food. */
	button.wfd-line--none {
		border-block-end-style: dashed;
		color: var(--wfd-ink-2);
	}

	.wfd-line__text {
		display: grid;
		gap: 2px;
		min-inline-size: 0;
	}

	.wfd-line__name {
		font-size: 17px;
		font-weight: 500;
	}

	.wfd-line__note {
		color: var(--wfd-ink-2);
		font-size: 14px;
	}

	.wfd-line__amount {
		font-size: 18px;
	}
</style>
