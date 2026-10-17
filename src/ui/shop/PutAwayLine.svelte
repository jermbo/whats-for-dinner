<script lang="ts">
	import { flushSync } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import { showDate } from '../../dates';
	import { amountOf, type CartItem, type Facts } from '../../shop/facts';
	import { readPrice, showPrice } from '../../shop/price';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
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
		// The line shows all its facts.
		open: boolean;
		ontoggle: () => void;
		onsale: () => void;
		onchange: (change: Partial<Facts>) => void;
		onnotbought: () => void;
		// You checked the line, and only this item goes into the pantry.
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
	const badPrice = $derived(facts.price.trim() !== '' && readPrice(facts.price) === null);
	const price = $derived(showPrice(facts.price) || (badPrice ? facts.price.trim() : '–'));
	// On a sale, the field is empty, and the price that you usually pay is its hint.
	const hint = $derived(facts.onSale && item.start.price ? `${item.start.price} regular` : 'Price');

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
<div class="wfd-away-line">
	<button
		class="wfd-away-line__what"
		type="button"
		aria-expanded={open}
		aria-controls="{uid}-facts"
		onclick={ontoggle}
	>
		<span class="wfd-away-line__mark" class:wfd-away-line__mark--open={open} aria-hidden="true">
			›
		</span>
		<span class="wfd-away-line__text">
			<span class="wfd-away-line__top">
				<span class="wfd-away-line__name">{item.name}</span>
				{#if facts.intoPantry}
					<span class="wfd-away-line__amount wfd-number">{amountOf(facts)}</span>
				{/if}
			</span>
			{#if facts.intoPantry}
				<span class="wfd-away-line__when">{when}</span>
			{/if}
		</span>
		<span
			class="wfd-away-line__price wfd-number"
			class:wfd-away-line__price--missing={price === '–'}
			class:wfd-away-line__price--bad={badPrice}
		>
			{price}
		</span>
	</button>

	<div class="wfd-away-line__sale">
		<Chip label="Sale" name="Sale: {item.name}" on={facts.onSale} onclick={sale} />
	</div>

	{#if open}
		<div class="wfd-away-line__facts" id="{uid}-facts" transition:slide={{ duration }}>
			<div class="wfd-away-line__paid">
				<label class="wfd-away-line__field">
					<span class="wfd-label">Price</span>
					<input
						class="wfd-away-line__price-field"
						class:wfd-away-line__price-field--bad={badPrice}
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
				</label>
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
			<div class="wfd-away-line__actions">
				<Button kind="olive" aria-label="Put away: {item.name}" disabled={busy} onclick={onputaway}>
					Put away
				</Button>
				<Button aria-label="Not bought: {item.name}" disabled={busy} onclick={onnotbought}>
					Not bought
				</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* The text and the price are one button. The chip of a sale is at the right of it. */
	.wfd-away-line {
		display: grid;
		grid-template-areas:
			'what sale'
			'facts facts';
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0 8px;
		align-items: center;
		padding-block: 6px;
	}

	button.wfd-away-line__what {
		display: grid;
		grid-area: what;
		grid-template-columns: 12px minmax(0, 1fr) auto;
		gap: 8px;
		align-items: start;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 50px;
		padding: 4px 0;
		border: 0;
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
			outline-offset: 2px;
		}
	}

	.wfd-away-line__mark {
		font-size: 20px;
		font-weight: 700;
		line-height: 1.1;
		transition: rotate 0.2s ease-out;
	}

	.wfd-away-line__mark--open {
		rotate: 90deg;
	}

	.wfd-away-line__text {
		display: grid;
		gap: 3px;
		min-inline-size: 0;
	}

	.wfd-away-line__top {
		display: flex;
		flex-wrap: wrap;
		gap: 2px 10px;
		align-items: baseline;
	}

	.wfd-away-line__name {
		font-size: 18px;
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.wfd-away-line__name::first-letter {
		text-transform: uppercase;
	}

	.wfd-away-line__amount {
		font-size: 17px;
	}

	.wfd-away-line__when {
		color: var(--wfd-ink-2);
		font-size: 14px;
	}

	/* A price is a number of the receipt, so it has the font of the numbers. */
	.wfd-away-line__price {
		font-family: var(--wfd-display);
		font-size: 17px;
		font-variant-numeric: tabular-nums;
		line-height: 1.3;
		text-align: end;
	}

	.wfd-away-line__price--missing {
		color: var(--wfd-ink-3);
	}

	.wfd-away-line__price--bad {
		color: var(--wfd-tomato);
	}

	.wfd-away-line__sale {
		display: flex;
		grid-area: sale;
	}

	.wfd-away-line__facts {
		display: grid;
		grid-area: facts;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		padding: 6px 0 6px 20px;
	}

	.wfd-away-line__paid {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 12px;
		align-items: end;
	}

	.wfd-away-line__field {
		display: grid;
		gap: 6px;
		color: var(--wfd-ink-2);
	}

	.wfd-away-line__field :global(input.wfd-away-line__price-field) {
		inline-size: 9rem;
		min-block-size: 44px;
		padding-inline: 10px;
		font-family: var(--wfd-display);
		font-variant-numeric: tabular-nums;
		text-align: end;
	}

	.wfd-away-line__field :global(input.wfd-away-line__price-field--bad) {
		border-color: var(--wfd-tomato);
	}

	.wfd-away-line__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 12px;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-away-line__mark {
			transition: none;
		}
	}
</style>
