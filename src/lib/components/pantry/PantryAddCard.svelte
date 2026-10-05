<script>
	import ChoiceChips from '$lib/components/ui/ChoiceChips.svelte';
	import LevelSlider from '$lib/components/ui/LevelSlider.svelte';
	import { saveIngredient } from '$lib/data/ingredients';
	import { addByHand } from '$lib/data/pantry';
	import { LOCATIONS, UNIT_CHOICES, labelOf } from '$lib/domain/options';
	import { defaultLocation } from '$lib/domain/pantry';
	import { addScale, pantryScale } from '$lib/domain/pantry-scale';
	import { status } from '$lib/state/status.svelte';
	import { sortByName } from '$lib/util/collections';

	/**
	 * @typedef {import('$lib/types').Ingredient} Ingredient
	 * @typedef {import('$lib/types').PantryItem} PantryItem
	 */

	/**
	 * The card that adds food to the pantry by hand: a name, a place, and an amount. Most food
	 * comes in at "Put away", so this card is for the odd jar from a friend.
	 * A name that the app knows is that ingredient. A new name makes a new ingredient.
	 * @type {{
	 *   ingredients: Ingredient[],
	 *   pantryByIngredient: Map<string, PantryItem>,
	 *   onadded?: (itemId: string) => void
	 * }}
	 */
	let { ingredients, pantryByIngredient, onadded } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	/** @type {HTMLInputElement | undefined} */
	let field = $state();

	let name = $state('');
	/** The unit of a new ingredient. */
	let unit = $state(/** @type {import('$lib/types').Unit} */ ('g'));

	const text = $derived(name.trim());
	const known = $derived(
		ingredients.find((ingredient) => ingredient.name.toLowerCase() === text.toLowerCase())
	);
	/** The item of the ingredient, when the pantry has it. */
	const item = $derived(known && pantryByIngredient.get(known.id));
	/** A "have, low, or out" ingredient has no amount. */
	const measured = $derived(known?.tracking !== 'state');

	/**
	 * The scale of "how much". For an item in the pantry, the scale is its full gauge, with its
	 * low line: the owner sees the same row as in the list.
	 */
	const scale = $derived(
		known && item
			? addScale({ unit: known.unit, lowAt: pantryScale(item, known).low }, item.fullQuantity / 2)
			: addScale(known ?? { unit })
	);

	// The owner can change these two. A different name gives the usual values again.
	let amount = $derived(scale.value);
	let location = $derived(item?.location ?? (known ? defaultLocation(known) : 'fridge'));

	export function open() {
		name = '';
		dialog?.showModal();
		field?.focus();
	}

	/** @param {SubmitEvent} event */
	async function submit(event) {
		event.preventDefault();
		if (!text) return;

		const ingredient =
			known ??
			(await saveIngredient({
				id: '',
				name: text,
				category: 'Other',
				unit,
				tracking: 'quantity',
				perishable: location !== 'pantry',
				lowAt: scale.low,
				updatedAt: ''
			}));
		const id = await addByHand(ingredient, { quantity: amount, location, full: scale.max });

		status.say(`${ingredient.name} is in the ${labelOf(LOCATIONS, location).toLowerCase()}.`);
		dialog?.close();
		onadded?.(id);
	}
</script>

<dialog class="add-card" bind:this={dialog} aria-labelledby="{uid}-title">
	<form class="add-card__form" onsubmit={submit}>
		<div class="add-card__head">
			<h2 class="add-card__title" id="{uid}-title">Add to pantry</h2>
			<button class="add-card__cancel" type="button" onclick={() => dialog?.close()}>
				Cancel
			</button>
		</div>

		<div class="add-card__name">
			<label class="label" for="{uid}-name">Name</label>
			<input
				class="add-card__input"
				id="{uid}-name"
				type="text"
				list="{uid}-names"
				autocomplete="off"
				autocapitalize="sentences"
				enterkeyhint="done"
				required
				bind:this={field}
				bind:value={name}
			/>
			<datalist id="{uid}-names">
				{#each sortByName(ingredients) as ingredient (ingredient.id)}
					<option value={ingredient.name}></option>
				{/each}
			</datalist>
			<p class="add-card__fact" aria-live="polite">
				{#if known && item && measured}
					You have {scale.text(item.quantity)}. This adds to it.
				{:else if known && item}
					{known.name} is in the pantry.
				{:else if text && !known}
					New in the pantry.
				{/if}
			</p>
		</div>

		<div class="add-card__where">
			<ChoiceChips legend="Where" options={LOCATIONS} bind:value={location} />
		</div>

		{#if !known}
			<div class="add-card__unit">
				<ChoiceChips legend="Measure in" options={UNIT_CHOICES} bind:value={unit} />
			</div>
		{/if}

		{#if measured}
			<div class="add-card__amount">
				<LevelSlider
					label="How much"
					{scale}
					note="Low at {scale.text(scale.low)}"
					bind:value={amount}
				/>
			</div>
		{/if}

		<button class="button button--strong button--wide add-card__add" type="submit">
			{text ? `Add ${text.toLowerCase()}` : 'Add to pantry'}
		</button>
	</form>
</dialog>

<style>
	/* A phone: a sheet that comes up from the bottom edge. The list stays in view above it. */
	.add-card.add-card {
		inline-size: 100%;
		max-inline-size: none;
		margin: auto 0 0;
		padding: var(--space-6) var(--space-5);
		padding-block-end: calc(var(--space-6) + env(safe-area-inset-bottom));
		border: 0;
		border-radius: var(--radius) var(--radius) 0 0;
	}

	.add-card__form {
		display: grid;
		gap: var(--space-5);
	}

	.add-card__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block-end: var(--space-2);
		border-block-end: var(--rule-8) solid var(--ink);
	}

	.add-card__title {
		font-size: 2.25rem;
		line-height: 0.95;
	}

	.add-card__cancel {
		padding: var(--space-2) 0;
		font: inherit;
		font-weight: 700;
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
		color: inherit;
		background: none;
		border: 0;
		cursor: pointer;
	}

	.add-card__name {
		display: grid;
		gap: var(--space-1);
	}

	/* The name is a line to write on, not a box. */
	.add-card__input {
		inline-size: 100%;
		padding: var(--space-2) 0;
		font: inherit;
		font-size: 1.5rem;
		font-weight: 600;
		color: inherit;
		background: none;
		border: 0;
		border-block-end: var(--rule-4) solid var(--ink);
		border-radius: 0;

		&:focus-visible {
			outline: none;
			border-block-end-color: var(--olive);
		}

		/* The arrow that a browser adds for the list of names: the line stays clean. */
		&::-webkit-calendar-picker-indicator {
			display: none !important;
		}
	}

	/* One line always, so that the card does not jump when the app finds the name. */
	.add-card__fact {
		min-block-size: 1.3em;
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--ink-soft);
	}

	/* A wide main area: a card at the top of the list, with two columns. */
	@container main (min-width: 38rem) {
		.add-card.add-card {
			inline-size: min(46rem, 100% - 4rem);
			margin: 12vh auto auto;
			padding: var(--space-6);
			border-radius: var(--radius);

			/* The list stays in view behind the card: a wash of paper, not of ink. */
			&::backdrop {
				background: color-mix(in srgb, var(--paper) 72%, transparent);
			}
		}

		.add-card__form {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: end;
			column-gap: var(--space-8);
		}

		.add-card__head {
			grid-column: 1 / -1;
		}

		.add-card__amount,
		.add-card__unit {
			grid-column: 1;
		}

		.add-card__add {
			grid-column: 2;
		}
	}
</style>
