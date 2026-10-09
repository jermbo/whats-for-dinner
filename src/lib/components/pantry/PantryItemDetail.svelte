<script>
	import Gauge from '$lib/components/ui/Gauge.svelte';
	import { emptyItem, setLevel } from '$lib/data/pantry';
	import { nightShort } from '$lib/domain/nights';
	import { LOCATIONS, labelOf } from '$lib/domain/options';
	import { pantryScale } from '$lib/domain/pantry-scale';
	import { isCounted } from '$lib/domain/put-away';
	import { useByBadge } from '$lib/domain/use-by';
	import { closeLostPanel, openSheetOrPanel } from '$lib/layout/sheet-or-panel';
	import { status } from '$lib/state/status.svelte';
	import { formatDay, formatQuantity, formatShortDay } from '$lib/util/format';
	import PantryItemEdit from './PantryItemEdit.svelte';

	/**
	 * @typedef {import('$lib/domain/pantry-view').PantryRow} PantryRow
	 * @typedef {import('$lib/domain/pantry-detail').Use} Use
	 * @typedef {import('$lib/domain/pantry-detail').HistoryLine} HistoryLine
	 */

	/** The detail shows this many recipes. */
	const MAX_USES = 4;

	/**
	 * The detail of one pantry item: where it is, how much there is, the meals that use it, the
	 * history of its changes, and its two actions: "Used up" and "Add to Shop". The other edits
	 * are in a block that opens.
	 *
	 * On a page with one column, the detail is a modal sheet above the page. On a page with a
	 * side column, it is a panel in that column: put it in the "split__side" element.
	 * @type {{
	 *   row: PantryRow | undefined,
	 *   uses: Use[],
	 *   lines: HistoryLine[],
	 *   listed: boolean,
	 *   onshop: (row: PantryRow) => void
	 * }}
	 *   row: the item that the detail shows. uses: the recipes that use it. lines: its history,
	 *   the newest first. listed: the item is on the shopping list or in the cart.
	 */
	let { row, uses, lines, listed, onshop } = $props();

	const uid = $props.id();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();
	// A new key gives new fields each time the detail opens.
	let opened = $state(0);

	const scale = $derived(row && pantryScale(row.item, row.ingredient));
	const badge = $derived(useByBadge(row?.left ?? null));

	/** The place, and the use-by date when the food has one. */
	const where = $derived.by(() => {
		if (!row) return '';
		const place = labelOf(LOCATIONS, row.item.location);
		const dated = row.left !== null && row.item.useBy;
		return dated ? `${place} · use by ${formatDay(dated)}` : place;
	});

	/** The full gauge and the low line, in words. */
	const note = $derived.by(() => {
		if (!row || !scale || !isCounted(row.ingredient)) return '';
		return `of ${scale.text(scale.max)} · low at ${scale.text(scale.low)}`;
	});

	/** Shows the detail of the row that the page gives. */
	export function open() {
		if (!dialog) return;
		opened += 1;
		if (!dialog.open) openSheetOrPanel(dialog);
	}

	// An item that is removed from the pantry has no detail.
	$effect(() => {
		if (!row) dialog?.close();
	});

	/** @param {PantryRow} gone */
	async function usedUp(gone) {
		await emptyItem(gone.ingredient, 'used');
		status.say(`${gone.ingredient.name} is used up.`);
	}
</script>

<svelte:window onresize={() => dialog && closeLostPanel(dialog)} />

<dialog class="pantry-detail" bind:this={dialog} aria-labelledby="{uid}-title">
	{#if row && scale}
		{@const current = row}
		{@const { item, ingredient } = current}

		<div class="stack">
			<header class="pantry-detail__head">
				<div class="pantry-detail__top">
					<h2 class="pantry-detail__name" id="{uid}-title">{ingredient.name}</h2>
					<button class="pantry-detail__close" type="button" onclick={() => dialog?.close()}>
						Close
					</button>
				</div>
				<p class="pantry-detail__where">
					<span>{where}</span>
					{#if badge}
						<span class={['badge', badge.urgent && 'badge--urgent']}>{badge.text}</span>
					{/if}
				</p>
			</header>

			{#key item.id}
				<Gauge
					label="In stock"
					{scale}
					{note}
					onchange={(value) => setLevel(item, ingredient, value)}
				/>
			{/key}

			{#if uses.length > 0}
				<section class="stack stack--tight" aria-labelledby="{uid}-uses">
					<h3 class="section-title" id="{uid}-uses">Used in</h3>
					<ul class="pantry-detail__rows">
						{#each uses.slice(0, MAX_USES) as use (use.recipe.id)}
							<li class="pantry-detail__row">
								<span class="pantry-detail__meal">{use.recipe.name}</span>
								{#if use.item}
									<strong class="pantry-detail__amount">
										{isCounted(ingredient) ? formatQuantity(use.quantity, ingredient.unit) : 'Some'}
										{#if use.item.night}· {nightShort(use.item.night)}{/if}
									</strong>
								{:else}
									<span class="muted">Not planned</span>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if lines.length > 0}
				<section class="stack stack--tight" aria-labelledby="{uid}-history">
					<h3 class="section-title" id="{uid}-history">History</h3>
					<ol class="pantry-detail__history receipt-text">
						{#each lines as line, index (line.id)}
							<li class="pantry-detail__line rise" style:--i={index}>
								<time datetime={line.at}>{formatShortDay(line.at)}</time>
								<span class="pantry-detail__cause">{line.label}</span>
								<span>{line.amount}</span>
							</li>
						{/each}
					</ol>
				</section>
			{/if}

			<div class="pantry-detail__actions">
				<button
					class="button"
					type="button"
					disabled={current.level === 'out'}
					onclick={() => usedUp(current)}
				>
					Used up
				</button>
				<button
					class="button button--strong"
					type="button"
					disabled={listed}
					onclick={() => onshop(current)}
				>
					{listed ? 'On the Shop list' : 'Add to Shop'}
				</button>
			</div>

			{#key opened}
				<details class="pantry-detail__edit">
					<summary class="button button--link">Change the item</summary>
					<PantryItemEdit row={current} ondone={() => dialog?.close()} />
				</details>
			{/key}
		</div>
	{/if}
</dialog>

<style>
	/* A panel in the side column of the page: it is in the page, and not above it. */
	.pantry-detail:not(:modal) {
		position: static;
		inline-size: 100%;
		max-inline-size: none;
		max-block-size: none;
		margin: 0;
	}

	.pantry-detail__head {
		display: grid;
		gap: var(--space-2);
		padding-block-end: var(--space-3);
		border-block-end: var(--rule-8) solid var(--ink);
	}

	.pantry-detail__top {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.pantry-detail__name {
		font-size: clamp(2.25rem, 14cqi, 3.5rem);
		line-height: 0.9;
		overflow-wrap: anywhere;
	}

	.pantry-detail__close {
		flex: none;
		min-block-size: var(--tap);
		padding: 0 var(--space-1);
		font-weight: 700;
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
		background: none;
		border: 0;
		cursor: pointer;
	}

	.pantry-detail__where {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		font-weight: 600;
		color: var(--ink-soft);
	}

	.pantry-detail__rows,
	.pantry-detail__history {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.pantry-detail__row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block: var(--space-2);
		border-block-end: var(--rule-1) solid var(--hairline);
	}

	.pantry-detail__meal {
		font-weight: 700;
	}

	.pantry-detail__amount {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 400;
		line-height: 1;
		white-space: nowrap;
	}

	/* A line of the receipt: the day, the cause with a dotted leader, and the amount. */
	.pantry-detail__line {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
		padding-block: 0.15rem;
	}

	.pantry-detail__cause {
		display: flex;
		flex: 1;
		align-items: baseline;
		gap: var(--space-2);
		min-inline-size: 0;

		&::after {
			flex: 1;
			content: '';
			border-block-end: 2px dotted var(--hairline);
		}
	}

	.pantry-detail__actions {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: var(--space-3);
	}

	.pantry-detail__edit > summary {
		list-style: none;
		justify-content: start;
		padding-inline: 0;

		&::-webkit-details-marker {
			display: none;
		}
	}

	.pantry-detail__edit[open] > summary {
		margin-block-end: var(--space-3);
	}
</style>
