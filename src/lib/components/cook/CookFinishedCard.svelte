<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { cookAmounts, cookTakes } from '$lib/domain/cook-takes';
	import { pop, rise } from '$lib/motion/transitions';
	import { formatQuantity, unitLabel } from '$lib/util/format';

	/** The first row comes in after the card is in view. Each next row comes a moment later. */
	const START_MS = 140;
	const STAGGER_MS = 45;

	/**
	 * The last card of Cook mode: "Done?". It lists what "Cooked" takes from the pantry, so that
	 * the owner sees the result before the tap. "Change amounts" makes each amount a field, for
	 * a meal that used more or less than the recipe.
	 * The card of Cook mode is olive for this card. On a wide card, the title is the left half
	 * and the list is the right half.
	 * @type {{
	 *   recipe: import('$lib/types').Recipe,
	 *   session: import('$lib/types').CookSession,
	 *   ingredientsById: Map<string, import('$lib/types').Ingredient>,
	 *   pantryByIngredient: Map<string, import('$lib/types').PantryItem>,
	 *   changes: Map<string, number>,
	 *   finishing: boolean,
	 *   onamount: (ingredientId: string, amount: number) => void,
	 *   onfinish: () => void
	 * }}
	 *   changes: the amounts that the owner changed, by ingredient ID. finishing: true after
	 *   "Cooked", until the next page opens.
	 */
	let {
		recipe,
		session,
		ingredientsById,
		pantryByIngredient,
		changes,
		finishing,
		onamount,
		onfinish
	} = $props();

	const uid = $props.id();

	let editing = $state(false);

	const rows = $derived(
		cookTakes(
			cookAmounts(session.menuItem.kind, recipe, ingredientsById, changes),
			pantryByIngredient
		)
	);

	/**
	 * @param {Event & { currentTarget: HTMLInputElement }} event
	 * @param {import('$lib/domain/cook-takes').CookTake} row
	 */
	function change(event, row) {
		const field = event.currentTarget;
		const amount = field.valueAsNumber;
		// A field that is empty or below zero gets its amount back.
		if (Number.isFinite(amount) && amount >= 0) onamount(row.ingredient.id, amount);
		else field.value = String(row.amount);
	}
</script>

<section class="cook-done" aria-labelledby="{uid}-title">
	<div class="cook-done__head">
		<h2 class="cook-done__title" id="{uid}-title">Done?</h2>
		<p class="label">{recipe.name}</p>
	</div>

	<div class="cook-done__takes">
		{#if rows.length === 0}
			<p class="label">Takes nothing from the pantry</p>
		{:else}
			<p class="label" id="{uid}-takes">Takes from the pantry</p>
			<ul class="cook-done__list" aria-labelledby="{uid}-takes">
				{#each rows as row, index (row.ingredient.id)}
					{@const { ingredient } = row}
					<li class="cook-done__row" in:rise|global={{ delay: START_MS + index * STAGGER_MS }}>
						<span class="cook-done__name">{ingredient.name}</span>
						{#if row.takes < row.amount}
							<span class="badge">{row.takes > 0 ? 'Takes all' : 'Not in pantry'}</span>
						{/if}
						<!-- A new key gives a new element, so the value pops when it changes. -->
						{#key editing ? 'field' : row.takes}
							<span class="cook-done__value" in:pop>
								{#if editing}
									<label class="cook-done__field">
										<span class="visually-hidden">
											Amount of {ingredient.name} in {unitLabel(ingredient.unit)}
										</span>
										<input
											class="cook-done__input"
											type="number"
											inputmode="decimal"
											min="0"
											step="any"
											value={row.amount}
											onchange={(event) => change(event, row)}
										/>
										{#if ingredient.unit !== 'count'}
											<span aria-hidden="true">{unitLabel(ingredient.unit)}</span>
										{/if}
									</label>
								{:else}
									−{formatQuantity(row.takes, ingredient.unit)}
								{/if}
							</span>
						{/key}
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="cook-done__actions">
		<button
			class="button button--strong cook-done__cooked"
			type="button"
			disabled={finishing}
			onclick={onfinish}
		>
			<Icon name="check" />
			Cooked
		</button>
		{#if rows.length > 0}
			<button
				class="button button--link"
				type="button"
				aria-expanded={editing}
				onclick={() => (editing = !editing)}
			>
				{editing ? 'Use these amounts' : 'Change amounts'}
			</button>
		{/if}
	</div>
</section>

<style>
	/*
	 * The card fills the height that is there. The list scrolls in its own box, so "Cooked"
	 * stays in view below a long list.
	 */
	.cook-done {
		display: grid;
		flex: 1 1 0;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: var(--space-4);
		min-block-size: 20rem;
	}

	.cook-done__head {
		display: grid;
		gap: var(--space-2);
	}

	.cook-done__title {
		font-size: clamp(3.5rem, 22cqi, 7rem);
		line-height: 0.86;
	}

	.cook-done__takes {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--space-2);
		min-block-size: 0;
	}

	.cook-done__list {
		flex: 1;
		min-block-size: 0;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		list-style: none;
		border-block-start: var(--rule-4) solid var(--ink);
	}

	.cook-done__row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-block-size: var(--tap);
		padding-block: var(--space-1);
		border-block-end: var(--rule-1) solid var(--ink);
	}

	.cook-done__name {
		flex: 1;
		font-size: 1.15rem;
		font-weight: 600;
	}

	.cook-done__value {
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1;
		white-space: nowrap;
	}

	.cook-done__field {
		display: flex;
		align-items: baseline;
		gap: var(--space-1);
		cursor: text;
	}

	/* The field is as wide as its number, where the browser can do that. */
	.cook-done__input {
		inline-size: 5ch;
		min-inline-size: 2ch;
		max-inline-size: 7ch;
		min-block-size: 2.5rem;
		padding: 0;
		font-size: inherit;
		text-align: end;
		field-sizing: content;
		background: none;
		border: 0;
		border-block-end: 2px dashed var(--ink);
		border-radius: 0;
		appearance: textfield;

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			margin: 0;
			appearance: none;
		}
	}

	.cook-done__actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.cook-done__cooked {
		flex: 1;
		gap: var(--space-2);
		min-block-size: 3.75rem;
		font-size: 1.2rem;
	}

	/* A wide card has two halves: the title at the left, and the list at the right. */
	@container cook-card (min-width: 48rem) {
		.cook-done {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			column-gap: var(--space-8);
			padding: var(--space-4);
		}

		/* The title is at the top, and the name of the meal is at the lower edge. */
		.cook-done__head {
			grid-row: 1 / -1;
			align-content: space-between;
		}

		.cook-done__title {
			font-size: clamp(6rem, 17cqi, 14rem);
		}

		.cook-done__takes {
			grid-row: 1 / 3;
		}
	}
</style>
