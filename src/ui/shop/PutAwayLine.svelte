<script lang="ts">
	import { flushSync } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { showDate } from '../../dates';
	import { prefersReducedMotion as reduced } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { entriesOf, refusal } from '../../pantry/unit-list';
	import { brandAt, brandCell } from '../../shop/bought-brand';
	import { amountOf, type CartItem, type Facts } from '../../shop/facts';
	import { readPrice, showPrice } from '../../shop/price';
	import { tilesOf } from '../brand-tiles';
	import BrandStrip from '../parts/BrandStrip.svelte';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import Field from '../parts/Field.svelte';
	import ListLine from '../parts/ListLine.svelte';
	import PickOne from '../parts/PickOne.svelte';
	import UseByPick from './UseByPick.svelte';

	type Props = {
		item: CartItem;
		facts: Facts;
		// The places that one tap selects.
		places: string[];
		// The place is still the guess of the plugin.
		placeIsGuess: boolean;
		today: string;
		// The amount goes into the pantry in this system.
		// The line shows all its facts.
		open: boolean;
		ontoggle: () => void;
		onsale: () => void;
		onchange: (change: Partial<Facts>) => void;
		// The regular price of the brand of the line, for the hint of a sale.
		regular: string;
		// The address of a photo of a brand, for the screen.
		urlOf: (photo: string) => string | null;
		// A photo of the camera tile: a new brand for the line.
		ontake: (photo: Blob) => Promise<unknown>;
		// A copy of this line, for a package that the plugin did not expect.
		onaddpackage: () => void;
		onnotbought: () => void;
		// You checked the line, and only this package goes into the pantry.
		onputaway: () => void;
		// An item is on its way into the pantry, so a second tap waits.
		busy: boolean;
	};
	let {
		item,
		facts,
		places,
		placeIsGuess,
		today,
		open,
		ontoggle,
		onsale,
		onchange,
		regular,
		urlOf,
		ontake,
		onaddpackage,
		onnotbought,
		onputaway,
		busy
	}: Props = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// The item is not food of the pantry. "Into the pantry" makes a food item of it.
	const own = $derived(!item.start.intoPantry);

	// The place is the title of the group, so the line tells only when the food is good until.
	const when = $derived(
		[facts.useBy ? `Use by ${showDate(facts.useBy)}` : 'No date', placeIsGuess && 'no place yet']
			.filter(Boolean)
			.join(' · ')
	);
	// Text that is not a number is not a price. The line and the field show it.
	// "1 bag" is not an amount of the pantry, so the line waits for the weight from the label.
	const badAmount = $derived(facts.intoPantry && entriesOf(facts.amount) === null);
	const badPrice = $derived(facts.price.trim() !== '' && readPrice(facts.price) === null);
	const price = $derived(showPrice(facts.price) || (badPrice ? facts.price.trim() : '–'));
	// On a sale, the field is empty, and the price that you usually pay for the brand is its hint.
	const hint = $derived(facts.onSale && regular ? `${regular} regular` : 'Price');

	// The brands of the food item. An item with no food item note has none, and no camera tile.
	const brands = $derived(item.brands ?? []);
	const selected = $derived(brandAt(facts.brand, brands));
	const chosen = $derived(selected === null ? null : brands[selected]);
	const chosenUrl = $derived(chosen?.photos[0] ? urlOf(chosen.photos[0]) : null);

	// One tap selects a brand. A tap on the selected brand takes the selection off.
	function pick(at: number) {
		onchange({ brand: selected === at ? '' : brandCell(brands[at]) });
	}

	let priceField = $state<HTMLInputElement>();

	// A sale has its own price, so the cursor goes into the price at once. The open line must be
	// on the screen before it can take the cursor.
	function sale() {
		const on = !facts.onSale;
		onsale();
		if (!on) return;
		flushSync();
		priceField?.focus();
	}
</script>

<!--
	One item of the cart, as the plugin filled it in. The closed line is text to check, with one
	chip for a sale. A tap on the line opens the corrections.
-->
<!-- A different brand has a different price. The new price fades in. -->
{#snippet paid()}
	{#key price}
		<span
			class:wfd-away-line__price--missing={price === '–'}
			class:wfd-away-line__price--bad={badPrice}
			in:fade={{ duration: reduced.current ? 0 : 300 }}
		>
			{price}
		</span>
	{/key}
{/snippet}

<div class="wfd-away-line">
	<button
		class="wfd-away-line__what"
		type="button"
		aria-expanded={open}
		aria-controls="{uid}-facts"
		onclick={ontoggle}
	>
		<ListLine
			name={item.name}
			small={facts.intoPantry ? when : undefined}
			number={facts.intoPantry ? amountOf(facts) : undefined}
			numberSmall={paid}
		>
			{#snippet mark()}
				<svg class="wfd-away-line__mark" class:wfd-away-line__mark--open={open} viewBox="0 0 20 20" aria-hidden="true">
					<path d="M5 8l5 5 5-5" />
				</svg>
				{#if chosenUrl}
					<img class="wfd-away-line__brand" src={chosenUrl} alt="" in:fade={{ duration }} />
				{:else if chosen}
					<span class="wfd-away-line__brand-name">{chosen.name}</span>
				{/if}
			{/snippet}
		</ListLine>
	</button>

	<div class="wfd-away-line__sale">
		<Chip label="Sale" name="Sale: {item.name}" on={facts.onSale} onclick={sale} />
	</div>

	{#if open}
		<div class="wfd-away-line__facts" id="{uid}-facts" in:fade={{ duration }}>
			{#if item.brands}
				<BrandStrip
					brands={tilesOf(brands, urlOf)}
					of={item.name}
					{selected}
					ontap={pick}
					{ontake}
				/>
			{/if}
			<div class="wfd-away-line__paid">
				<div class="wfd-away-line__field">
					<Field label="Price" kind="number">
						<input
							type="text"
							inputmode="decimal"
							enterkeyhint="done"
							autocomplete="off"
							aria-label="Price of {item.name}"
							aria-invalid={badPrice}
							placeholder={hint}
							value={facts.price}
							bind:this={priceField}
							oninput={(event) => onchange({ price: event.currentTarget.value })}
						/>
					</Field>
				</div>
				{#if own}
					<Chip
						label="Into the pantry"
						on={facts.intoPantry}
						onclick={() => onchange({ intoPantry: !facts.intoPantry })}
					/>
				{/if}
			</div>
			{#if facts.intoPantry}
				<PickOne
					legend="How much"
					options={item.amounts}
					value={facts.amount}
					other="Another amount"
					onchange={(amount) => onchange({ amount })}
				/>
				<UseByPick value={facts.useBy} {today} onchange={(useBy) => onchange({ useBy })} />
				<PickOne
					legend="Where"
					options={places}
					value={facts.place}
					other="A new place"
					onchange={(place) => onchange({ place })}
				/>
			{/if}
			{#if badAmount}
				<p class="wfd-away-line__refused" role="alert" transition:fade={{ duration }}>
					Select a size. {refusal}
				</p>
			{/if}
			<div class="wfd-away-line__actions">
				<Button
					kind="olive"
					aria-label="Put away: {item.name}"
					disabled={busy || badAmount}
					onclick={onputaway}
				>
					Put away
				</Button>
				<Button kind="plain" mark="✕" aria-label="Not bought: {item.name}" disabled={busy} onclick={onnotbought}>
					Not bought
				</Button>
				{#if facts.intoPantry}
					<Button kind="plain" mark="+" aria-label="One more package: {item.name}" disabled={busy} onclick={onaddpackage}>
						Package
					</Button>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.wfd-away-line__refused {
		margin: 0;
		color: var(--wfd-color-danger);
		font-size: var(--wfd-font-size-small);
	}

	/* The text and the price are one button. The chip of a sale is at the right of it. */
	.wfd-away-line {
		display: grid;
		grid-template-areas:
			'what sale'
			'facts facts';
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0 var(--wfd-space-group);
		align-items: center;
		padding-block: var(--wfd-space-tight);
	}

	button.wfd-away-line__what {
		display: grid;
		grid-area: what;
		grid-template-columns: minmax(0, 1fr);
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: var(--wfd-space-tight) 0;
		border: 0;
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	/* The chevron of "Known" and of the cart: one mark for each part that opens. */
	.wfd-away-line__mark {
		inline-size: 20px;
		block-size: 20px;
		align-self: center;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.5;
		transition: rotate var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-away-line__mark--open {
		rotate: 180deg;
	}

	/* The brand of the line, small, before the name. */
	.wfd-away-line__brand {
		inline-size: 24px;
		block-size: 24px;
		align-self: center;
		border-radius: var(--wfd-radius-sticker);
		object-fit: cover;
	}

	.wfd-away-line__brand-name {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		font-weight: 600;
	}

	.wfd-away-line__price--missing {
		color: var(--wfd-color-text-faint);
	}

	.wfd-away-line__price--bad {
		color: var(--wfd-color-danger);
	}

	.wfd-away-line__sale {
		display: flex;
		grid-area: sale;
	}

	.wfd-away-line__facts {
		display: grid;
		grid-area: facts;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-stack);
		padding: var(--wfd-space-tight) 0 var(--wfd-space-tight) var(--wfd-space-inset);
	}

	.wfd-away-line__paid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group) var(--wfd-space-stack);
		align-items: end;
	}

	.wfd-away-line__field {
		inline-size: 9rem;
	}

	.wfd-away-line__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group) var(--wfd-space-stack);
	}
</style>
