<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import { showDate } from '../../dates';
	import { amountOf, type Facts } from '../../shop/facts';
	import { readPrice } from '../../shop/price';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import PickOne from '../parts/PickOne.svelte';

	type Props = {
		name: string;
		// The item is not food of the pantry. "Into the pantry" makes a food item of it.
		own: boolean;
		facts: Facts;
		// The places that one tap can select.
		places: string[];
		// The line shows all its facts.
		open: boolean;
		ontoggle: () => void;
		onchange: (change: Partial<Facts>) => void;
		onnotbought: () => void;
	};
	let { name, own, facts, places, open, ontoggle, onchange, onnotbought }: Props = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// Where the food goes, and until when it is good.
	const where = $derived(
		[facts.place, facts.useBy ? `Use by ${showDate(facts.useBy)}` : 'No date'].join(' · ')
	);
	// Text that is not a number is not a price. The field shows it.
	const badPrice = $derived(facts.price.trim() !== '' && readPrice(facts.price) === null);
</script>

<!--
	One item of the cart. The price is the fact that you type most, so its field is on the line. A
	tap on the name opens the other facts.
-->
<div class="wfd-away-line" class:wfd-away-line--own={own}>
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
				<span class="wfd-away-line__name">{name}</span>
				{#if facts.intoPantry}
					<span class="wfd-away-line__amount wfd-number">{amountOf(facts)}</span>
				{/if}
			</span>
			<span class="wfd-away-line__where">{facts.intoPantry ? where : 'Not in the pantry'}</span>
		</span>
	</button>

	<input
		class="wfd-away-line__price"
		class:wfd-away-line__price--bad={badPrice}
		type="text"
		inputmode="decimal"
		autocomplete="off"
		aria-label="Price of {name}"
		aria-invalid={badPrice}
		placeholder="Price"
		value={facts.price}
		oninput={(event) => onchange({ price: event.currentTarget.value })}
	/>

	{#if own}
		<div class="wfd-away-line__into">
			<Chip
				label="Into the pantry"
				on={facts.intoPantry}
				onclick={() => onchange({ intoPantry: !facts.intoPantry })}
			/>
		</div>
	{/if}

	<div class="wfd-away-line__marks">
		<Chip label="On sale" on={facts.onSale} onclick={() => onchange({ onSale: !facts.onSale })} />
	</div>

	{#if open}
		<div class="wfd-away-line__facts" id="{uid}-facts" transition:slide={{ duration }}>
			{#if facts.intoPantry}
				<div class="wfd-away-line__pair">
					<label class="wfd-away-line__field">
						<span class="wfd-label">How much</span>
						<input
							type="text"
							autocomplete="off"
							placeholder="500 g"
							value={facts.amount}
							oninput={(event) => onchange({ amount: event.currentTarget.value })}
						/>
					</label>
					<label class="wfd-away-line__field">
						<span class="wfd-label">Use by</span>
						<input
							type="date"
							value={facts.useBy}
							oninput={(event) => onchange({ useBy: event.currentTarget.value })}
						/>
					</label>
				</div>
				<PickOne
					legend="Where"
					options={places}
					value={facts.place}
					other="A new place"
					onchange={(place) => onchange({ place })}
				/>
			{/if}
			<div class="wfd-away-line__actions">
				<Button aria-label="Not bought: {name}" onclick={onnotbought}>Not bought</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* The text is at the left. The two controls of the price are one above the other at the right. */
	.wfd-away-line {
		display: grid;
		grid-template-areas:
			'what price'
			'what marks'
			'facts facts';
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0 12px;
		align-items: start;
		padding-block: 10px;
	}

	/* An item of your own has "Into the pantry" below its name. */
	.wfd-away-line--own {
		grid-template-areas:
			'what price'
			'into marks'
			'facts facts';
	}

	button.wfd-away-line__what {
		display: flex;
		grid-area: what;
		gap: 8px;
		align-items: start;
		justify-content: start;
		inline-size: 100%;
		block-size: 100%;
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
		flex: none;
		inline-size: 12px;
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

	.wfd-away-line__where {
		color: var(--wfd-ink-2);
		font-size: 14px;
	}

	/* A price is a number of the receipt, so it has the font of the numbers. */
	.wfd-away-line :global(input.wfd-away-line__price) {
		grid-area: price;
		inline-size: 6.5rem;
		padding-inline: 10px;
		font-family: var(--wfd-display);
		font-variant-numeric: tabular-nums;
		text-align: end;
	}

	.wfd-away-line :global(input.wfd-away-line__price--bad) {
		border-color: var(--wfd-tomato);
	}

	.wfd-away-line__into {
		display: flex;
		grid-area: into;
		padding-inline-start: 20px;
	}

	.wfd-away-line__marks {
		display: flex;
		grid-area: marks;
		justify-content: end;
	}

	.wfd-away-line__facts {
		display: grid;
		grid-area: facts;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
		padding-block: 10px 6px;
	}

	.wfd-away-line__pair {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
		gap: 12px;
	}

	.wfd-away-line__field {
		display: grid;
		gap: 6px;
		min-inline-size: 0;
		color: var(--wfd-ink-2);
	}

	.wfd-away-line__field :global(input) {
		inline-size: 100%;
	}

	.wfd-away-line__actions {
		display: flex;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-away-line__mark {
			transition: none;
		}
	}
</style>
