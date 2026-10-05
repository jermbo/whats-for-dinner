<script>
	import MealSheet from '$lib/components/meal/MealSheet.svelte';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import { entryName } from '$lib/domain/menu';
	import { nightShort, nightStart } from '$lib/domain/nights';
	import { dragSort } from '$lib/input/drag-sort';
	import { pop } from '$lib/motion/transitions';

	/**
	 * @typedef {import('$lib/domain/menu').MenuEntry} MenuEntry
	 * @typedef {import('$lib/domain/menu-plan').WeekRow} WeekRow
	 * @typedef {import('$lib/domain/menu-plan').WeekNote} WeekNote
	 */

	/**
	 * "Your week": one row for each night of the plan, with the meal of that night. The owner
	 * holds the handle of a row and drags it: the nights stay, and the meals change places.
	 * A tap on a meal turns its card: the back opens, with "Remove from the menu".
	 * A night with no meal is an open place. The meals with no night are in a second list.
	 * @type {{
	 *   rows: WeekRow[],
	 *   loose: MenuEntry[],
	 *   notes: Map<string, WeekNote>,
	 *   today: string,
	 *   entries: MenuEntry[],
	 *   lastSessions: Map<string, import('$lib/types').CookSession>,
	 *   onsort: (from: number, to: number) => void,
	 *   onremove: (entry: MenuEntry) => void,
	 *   onprep: (entry: MenuEntry) => unknown,
	 *   ondeal: () => void
	 * }}
	 *   notes: the small line of each meal, by menu item ID. today: the night of today.
	 *   entries: all meals of the menu, for the back of a card. ondeal: the owner wants a meal
	 *   for an open night.
	 */
	let { rows, loose, notes, today, entries, lastSessions, onsort, onremove, onprep, ondeal } =
		$props();

	/** @type {MealSheet | undefined} */
	let sheet = $state();

	/**
	 * The card that turns is the photo of the row.
	 * @param {MouseEvent & { currentTarget: HTMLElement }} event
	 * @param {MenuEntry} entry
	 */
	function turn(event, entry) {
		const card = event.currentTarget.closest('li')?.querySelector('[data-card]');
		if (card instanceof HTMLElement) sheet?.open(entry.item.id, card);
	}
</script>

{#snippet meal(/** @type {MenuEntry} */ entry)}
	{@const note = notes.get(entry.item.id)}
	<span class="week-row__photo" data-card>
		{#key entry.recipe.id}
			<RecipePhoto recipe={entry.recipe} variant="thumb" />
		{/key}
	</span>
	<button class="week-row__meal" type="button" onclick={(event) => turn(event, entry)}>
		<span class="visually-hidden">Turn the card: details of</span>
		{#key entry.item.id}
			<span class="week-row__name" in:pop>{entryName(entry)}</span>
		{/key}
		{#if note?.text}
			<span class={['week-row__note', note.urgent && 'week-row__note--urgent']}>{note.text}</span>
		{/if}
	</button>
{/snippet}

<ul class="week">
	{#each rows as row, index (row.night)}
		<li
			class={['week-row', 'rise', row.night < today && 'week-row--past']}
			style:--i={index}
			{@attach dragSort({ count: () => rows.length, onsort })}
		>
			<p class="week-row__night">
				<span class="label">{nightShort(row.night)}</span>
				<span class="week-row__date">{new Date(nightStart(row.night)).getDate()}</span>
			</p>

			{#if row.entry}
				{@render meal(row.entry)}
				<span class="week-row__handle" data-handle>
					<span class="visually-hidden">Drag {entryName(row.entry)} to a different night</span>
				</span>
			{:else}
				<span class="week-row__photo week-row__photo--open"></span>
				<button class="week-row__meal week-row__meal--open" type="button" onclick={ondeal}>
					<span class="week-row__name">Open</span>
					<span class="week-row__note">Deal a meal for this night</span>
				</button>
				<!-- The handle is there for each row, so that a row keeps its drag when it gets a meal. -->
				<span class="week-row__handle week-row__handle--none" data-handle aria-hidden="true"></span>
			{/if}
		</li>
	{/each}
</ul>

{#if loose.length > 0}
	<section class="stack stack--tight" aria-labelledby="week-loose">
		<h2 class="label" id="week-loose">With no night</h2>
		<ul class="week week--loose">
			{#each loose as entry (entry.item.id)}
				<li class="week-row">
					{@render meal(entry)}
				</li>
			{/each}
		</ul>
	</section>
{/if}

<MealSheet bind:this={sheet} {entries} {lastSessions} {onremove} {onprep} />

<style>
	.week {
		margin: 0;
		padding: 0;
		list-style: none;
		border-block-start: var(--rule-4) solid var(--ink);
	}

	/* One night: the day, the photo, the meal, and the handle. */
	.week-row {
		position: relative;
		display: grid;
		grid-template-columns: 2.5rem auto minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-3);
		min-block-size: 4.75rem;
		padding-block: var(--space-2);
		background: var(--paper);
		border-block-end: var(--rule-1) solid var(--ink);
	}

	/* A meal with no night has no day column. */
	.week--loose .week-row {
		grid-template-columns: auto minmax(0, 1fr);
	}

	/* The row under the finger: a card that the owner lifts. */
	.week-row:global(.is-dragging) {
		z-index: 1;
		background: var(--card);
		box-shadow: var(--shadow);
	}

	/* A night that is over: quiet. */
	.week-row--past {
		opacity: 0.55;
	}

	.week-row__night {
		display: grid;
		justify-items: center;
		gap: 0.125rem;
	}

	.week-row__date {
		font-family: var(--font-display);
		font-size: 1.75rem;
		line-height: 0.9;
	}

	.week-row__photo {
		display: block;
		inline-size: 3.75rem;
		block-size: 3.75rem;
		border-radius: var(--radius-control);
	}

	/* An open night: a dashed place, as an empty slot. */
	.week-row__photo--open {
		border: 2px dashed var(--hairline);
	}

	.week-row__meal {
		display: grid;
		gap: 0.125rem;
		min-inline-size: 0;
		min-block-size: var(--tap);
		padding: 0;
		align-content: center;
		text-align: start;
		background: none;
		border: 0;
		cursor: pointer;
	}

	.week-row__name {
		font-family: var(--font-display);
		font-size: 1.375rem;
		line-height: 1;
		text-transform: uppercase;
		overflow-wrap: anywhere;
		transform-origin: left center;
	}

	.week-row__meal--open .week-row__name {
		color: var(--hairline);
	}

	/* Two lines at most: a long preparation must not make the row tall. */
	.week-row__note {
		display: -webkit-box;
		overflow: hidden;
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.25;
		color: var(--ink-soft);
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.week-row__note--urgent {
		color: var(--tomato-text);
	}

	/* The handle: three short lines. A finger holds it to drag the row. */
	.week-row__handle {
		display: grid;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		cursor: grab;
		touch-action: none;

		&::before {
			inline-size: 1.125rem;
			block-size: 0.75rem;
			content: '';
			background: linear-gradient(
				to bottom,
				var(--ink-soft) 0 2px,
				transparent 2px 5px,
				var(--ink-soft) 5px 7px,
				transparent 7px 10px,
				var(--ink-soft) 10px 12px
			);
		}

		&:active {
			cursor: grabbing;
		}
	}

	/* An open night has no meal to drag. */
	.week-row__handle--none {
		visibility: hidden;
		pointer-events: none;
	}
</style>
