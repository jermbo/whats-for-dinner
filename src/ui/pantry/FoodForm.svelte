<script lang="ts">
	import type { BrandDraft } from '../../kitchen/brand-actions';
	import { KINDS, showKind, type StapleLabel } from '../../pantry/staple';
	import type { FoodItem } from '../../pantry/types';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import BrandFields from './BrandFields.svelte';
	import Panel from '../parts/Panel.svelte';
	import SizeField from './SizeField.svelte';

	// The form of a food item: what is true of each package, not of one. The place, the level, and
	// the date are on the card.
	type Props = {
		item: FoodItem;
		// The size that the next package gets now.
		size: string;
		staple: StapleLabel;
		urlOf: (photo: string) => string | null;
		onsave: (form: { size: string; staple: StapleLabel; brands: BrandDraft[] }) => void;
		oncancel: () => void;
		onopen: () => void;
	};
	let { item, size, staple, urlOf, onsave, oncancel, onopen }: Props = $props();

	const first = () => ({ size, staple, brands: item.brands });
	let sizeText = $state(first().size);
	let kind = $state(first().staple);
	let drafts = $state<BrandDraft[]>(
		first().brands.map((brand, at) => ({
			at,
			start: brand.name,
			name: brand.name,
			startVerdict: brand.verdict,
			verdict: brand.verdict,
			photo: null,
			removed: false
		}))
	);

	const kinds: { value: StapleLabel; label: string }[] = [
		{ value: 'never', label: 'Never ask' },
		{ value: null, label: 'Not a staple' },
		...KINDS.map((value) => ({ value, label: showKind(value) }))
	];

	function save(event: SubmitEvent) {
		event.preventDefault();
		onsave({ size: sizeText, staple: kind, brands: drafts });
	}
</script>

<Panel kind="form">
	<form class="wfd-food" onsubmit={save}>
		<div class="wfd-food__top">
			<h3 class="wfd-food__title wfd-display">{item.name}</h3>
			<Button kind="link" onclick={oncancel}>Cancel</Button>
		</div>

		<SizeField value={sizeText} onchange={(next) => (sizeText = next)} />
		<p class="wfd-food__note">The size is for the next package. The packages that you have keep theirs.</p>

		{#if item.aliases.length}
			<p class="wfd-food__note">Other names: {item.aliases.join(', ')}</p>
		{/if}

		<!--
			How often you buy the food. The plugin asks about each food item that is low, and about a staple
			when its time is over. "Never ask" is for food that you bought for one recipe.
		-->
		<fieldset class="wfd-food__field">
			<legend class="wfd-label">Staple</legend>
			<div class="wfd-food__chips">
				{#each kinds as option (option.label)}
					<Chip label={option.label} on={kind === option.value} onclick={() => (kind = option.value)} />
				{/each}
			</div>
		</fieldset>

		<BrandFields brands={item.brands} bind:drafts {urlOf} of={item.name} />

		<div class="wfd-food__actions">
			<Button kind="main" type="submit">Save</Button>
		</div>
		<Button kind="link" onclick={onopen}>Open note</Button>
	</form>
</Panel>

<style>
	.wfd-food {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-section);
	}

	.wfd-food__top {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: space-between;
	}

	.wfd-food__title {
		margin: 0;
		font-size: var(--wfd-font-size-title);
		overflow-wrap: anywhere;
	}

	.wfd-food__note {
		margin: calc(-1 * var(--wfd-space-group)) 0 0;
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-food__field {
		display: grid;
		gap: var(--wfd-space-group);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-food__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--wfd-space-group);
	}

	.wfd-food__actions {
		display: grid;
	}
</style>
