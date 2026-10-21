<script lang="ts">
	import type { Status } from '../../match/match';
	import { showName } from '../../match/names';
	import { withoutPrep } from '../../recipes/prep';
	import { toGetFirst } from '../../recipes/to-get';
	import type { RecipeEntry } from '../../recipes/types';
	import Button from '../parts/Button.svelte';
	import Sticker from '../parts/Sticker.svelte';
	import PrepNote from './PrepNote.svelte';

	// The inside of an open recipe: what you must get comes first and is large. The food that you
	// have is a quiet group of chips.
	type Props = {
		entry: RecipeEntry;
		// When the meter starts, and the time of one piece. The count of the head uses the same times.
		start: number;
		step: number;
		oncook: (event: MouseEvent) => void;
		onedit: () => void;
		onnote: () => void;
		onclose: () => void;
	};
	let { entry, start, step, oncook, onedit, onnote, onclose }: Props = $props();
	const { recipe, match } = $derived(entry);
	const description = $derived(withoutPrep(recipe.description ?? ''));

	const toGet = $derived(toGetFirst(match.ingredients));
	const have = $derived(match.ingredients.filter((one) => one.status === 'enough'));
	// The pieces that the count counts come first: what you have, then what you must check.
	const meterOrder: Status[] = ['enough', 'unknown', 'short', 'missing'];
	const meter = $derived(
		[...match.ingredients].sort(
			(a, b) => meterOrder.indexOf(a.status) - meterOrder.indexOf(b.status)
		)
	);
</script>

<div class="wfd-needs" style:--wfd-needs-step="{step}ms" style:--wfd-needs-start="{start}ms">
	<div class="wfd-needs__food">
		<div
			class="wfd-needs__meter"
			role="img"
			aria-label="{match.inPantry} of {match.ingredients.length} in the pantry"
		>
			{#each meter as one, index}
				<span class="wfd-needs__piece wfd-needs__piece--{one.status}" style:--wfd-needs-n={index}
				></span>
			{/each}
		</div>

		{#if toGet.length}
			<section class="wfd-needs__group">
				<h4 class="wfd-needs__head wfd-label">To get or check · {toGet.length}</h4>
				<ul class="wfd-needs__rows">
					{#each toGet as one, index}
						<li class="wfd-needs__row" style:--wfd-needs-n={index}>
							<span class="wfd-needs__name">{showName(one.ingredient.name)}</span>
							<span class="wfd-needs__amount">{one.ingredient.amount?.text ?? ''}</span>
							<span class="wfd-needs__stamp">
								{#if one.status === 'missing'}
									<Sticker label="None" kind="dashed" />
								{:else if one.status === 'short'}
									<Sticker label="Low" kind="amber" />
								{:else}
									<Sticker label="Check" />
								{/if}
							</span>
						</li>
					{/each}
				</ul>
			</section>
		{:else}
			<p class="wfd-needs__all wfd-display">
				All in the pantry <span class="wfd-needs__stamp" aria-hidden="true">✓</span>
			</p>
		{/if}

		{#if have.length}
			<section class="wfd-needs__group">
				<h4 class="wfd-needs__head wfd-label">In the pantry · {have.length}</h4>
				<ul class="wfd-needs__chips">
					{#each have as one}
						<li class="wfd-needs__chip">
							{showName(one.ingredient.name)}
							{#if one.ingredient.amount}<span class="wfd-needs__chip-amount"
									>{one.ingredient.amount.text}</span
								>{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>

	<div class="wfd-needs__method">
		{#if description}
			<p class="wfd-needs__description">{description}</p>
		{/if}
		{#if entry.prep}
			<div><PrepNote text={entry.prep} /></div>
		{/if}
		<div class="wfd-needs__actions">
			<div class="wfd-needs__cook">
				<Button kind="olive" arrow onclick={oncook}>Cook</Button>
			</div>
			<div class="wfd-needs__second">
				<div><Button kind="plain" mark="✎" onclick={onedit}>Edit</Button></div>
				<div><Button kind="plain" mark="↗" onclick={onnote}>Note</Button></div>
				<div><Button kind="plain" mark="↑" onclick={onclose}>Close</Button></div>
			</div>
		</div>
	</div>
</div>

<style>
	.wfd-needs {
		container-type: inline-size;
	}

	.wfd-needs__food,
	.wfd-needs__method {
		display: grid;
		gap: var(--wfd-space-section);
		align-content: start;
	}

	/* With room, the food and the method sit side by side. Without it, the method comes after. */
	@container (min-width: 34rem) {
		.wfd-needs {
			display: grid;
			grid-template-columns: 3fr 2fr;
			gap: calc(var(--wfd-space-section) * 2);
		}
	}

	@container (max-width: 34rem) {
		.wfd-needs__method {
			margin-block-start: var(--wfd-space-section);
		}
	}

	/* The meter fills from the left: one piece for each step of the count in the head. */
	.wfd-needs__meter {
		display: flex;
		gap: 3px;
		block-size: 10px;
	}

	.wfd-needs__piece {
		flex: 1;
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-text);
		transform-origin: left;
		animation: wfd-needs-fill calc(var(--wfd-needs-step) * 3) var(--wfd-ease-out) backwards;
		animation-delay: calc(var(--wfd-needs-start) + var(--wfd-needs-n) * var(--wfd-needs-step));
	}

	.wfd-needs__piece--unknown {
		background: var(--wfd-color-text-faint);
	}

	.wfd-needs__piece--short {
		background: var(--wfd-color-warning);
	}

	.wfd-needs__piece--missing {
		border: var(--wfd-border) dashed var(--wfd-color-text-faint);
		background: none;
	}

	@keyframes wfd-needs-fill {
		from {
			opacity: 0;
			scale: 0 1;
		}
	}

	.wfd-needs__group {
		display: grid;
		gap: var(--wfd-space-group);
	}

	.wfd-needs__head {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-needs__rows,
	.wfd-needs__chips {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-needs__row {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: var(--wfd-space-stack);
		align-items: center;
		min-block-size: var(--wfd-control-min);
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
	}

	/*
	 * A sticker is pressed on after the card opens: it comes down a little large and turned, and
	 * lands flat with one short press. Each sticker comes one step after the sticker above it.
	 */
	.wfd-needs__stamp {
		display: inline-block;
		animation: wfd-needs-stamp calc(var(--wfd-motion-move) * 1.4) var(--wfd-ease-out) backwards;
		animation-delay: calc(var(--wfd-motion-move) + var(--wfd-needs-n, 0) * var(--wfd-needs-step));
	}

	@keyframes wfd-needs-stamp {
		0% {
			opacity: 0;
			scale: 1.35;
			rotate: -5deg;
			translate: 0 -6px;
		}
		55% {
			opacity: 1;
			scale: 0.94;
			rotate: 0deg;
			translate: 0 0;
		}
		100% {
			scale: 1;
		}
	}

	.wfd-needs__name {
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
	}

	.wfd-needs__amount {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.wfd-needs__all {
		margin: 0;
		font-size: var(--wfd-font-size-title);
	}

	.wfd-needs__chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
	}

	.wfd-needs__chip {
		display: inline-flex;
		gap: var(--wfd-space-tight);
		align-items: baseline;
		padding: var(--wfd-space-tight) var(--wfd-space-group);
		border: var(--wfd-border-thin) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-needs__chip-amount {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-label);
		font-weight: 600;
	}

	.wfd-needs__description {
		margin: 0;
		font-size: var(--wfd-font-size-text);
		line-height: var(--wfd-line-height-text);
		white-space: pre-line;
	}

	.wfd-needs__actions,
	.wfd-needs__cook {
		display: grid;
		gap: var(--wfd-space-group);
	}

	.wfd-needs__second {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--wfd-space-tight);

		& > div {
			display: grid;
		}
	}
</style>
