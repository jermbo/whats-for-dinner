<script>
	import Icon from '$lib/components/ui/Icon.svelte';
	import { dragSort } from '$lib/input/drag-sort';

	/**
	 * The categories of the store, as a list that the owner puts in the sequence of the aisles.
	 * Hold the number of a row and drag it, or use the two buttons of the row.
	 * @type {{ order: string[], onchange: (order: string[]) => void, onreset: () => void }}
	 */
	let { order, onchange, onreset } = $props();

	/** The sequence on the screen. A move shows immediately: the database answers a moment later. */
	let shown = $derived(order);

	/**
	 * @param {number} from
	 * @param {number} to
	 */
	function move(from, to) {
		const next = [...shown];
		next.splice(to, 0, ...next.splice(from, 1));
		shown = next;
		onchange(next);
	}
</script>

<details class="sequence">
	<summary class="sequence__summary">
		<span class="sequence__title">Sequence of the categories</span>
		<span class="sequence__first">{shown[0]} first</span>
	</summary>

	<ol class="sequence__list">
		{#each shown as name, index (name)}
			<li class="sequence__row" {@attach dragSort({ count: () => shown.length, onsort: move })}>
				<span class="sequence__number" data-handle>
					{index + 1}
					<span class="visually-hidden">. Drag to move {name}</span>
				</span>
				<span class="sequence__name">{name}</span>
				<button
					class="button button--round sequence__button"
					type="button"
					disabled={index === 0}
					onclick={() => move(index, index - 1)}
				>
					<Icon name="up" />
					<span class="visually-hidden">Move {name} up</span>
				</button>
				<button
					class="button button--round sequence__button"
					type="button"
					disabled={index === shown.length - 1}
					onclick={() => move(index, index + 1)}
				>
					<Icon name="down" />
					<span class="visually-hidden">Move {name} down</span>
				</button>
			</li>
		{/each}
	</ol>

	<button class="button" type="button" onclick={onreset}>Default sequence</button>
</details>

<style>
	/* The closed list is one more row of the preferences: its name, and the first category. */
	.sequence__summary {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-block-size: var(--tap);
		padding-block: var(--space-1);
		cursor: pointer;
		border-block-end: var(--rule-1) solid var(--hairline);

		/* The arrow of the summary is at the right, after the first category. */
		&::after {
			flex: none;
			inline-size: 0.5rem;
			block-size: 0.5rem;
			content: '';
			border: solid currentColor;
			border-width: 0 2px 2px 0;
			rotate: 45deg;
			transition: rotate 0.2s var(--ease-out);
		}

		&::-webkit-details-marker {
			display: none;
		}
	}

	.sequence[open] .sequence__summary::after {
		rotate: 225deg;
	}

	.sequence__title {
		flex: 1;
		font-weight: 700;
	}

	.sequence__first {
		color: var(--ink-soft);
		text-align: end;
	}

	.sequence__list {
		margin: 0 0 var(--space-3);
		padding: 0;
		list-style: none;
	}

	.sequence__row {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-block: var(--space-1);
		border-block-end: var(--rule-1) solid var(--hairline);
	}

	/* The number of a row is its handle: hold it, and drag the row to a new place. */
	.sequence__number {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		font-family: var(--font-display);
		font-size: 1.25rem;
		border: 2px solid var(--ink);
		border-radius: var(--radius-sticker);
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
	}

	.sequence__name {
		flex: 1;
		min-inline-size: 0;
		font-weight: 700;
	}

	.sequence__button {
		flex: none;
	}

	/* The row that you drag lifts above the list: white, with a shadow. */
	.sequence__row:global(.is-dragging) {
		z-index: 2;
		background: var(--card);
		box-shadow: var(--shadow);

		& .sequence__number {
			cursor: grabbing;
			color: var(--paper);
			background: var(--ink);
		}
	}
</style>
