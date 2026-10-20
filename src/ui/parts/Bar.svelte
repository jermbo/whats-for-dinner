<script lang="ts" generics="Sort extends string">
	import type { Snippet } from 'svelte';
	import Field from './Field.svelte';
	import FindField from './FindField.svelte';

	type Props = {
		// The words of the find field, such as "Find food".
		label: string;
		find: string;
		// The name of the sequence for a screen reader, such as "Sequence of the pantry".
		sequence: string;
		sorts: { value: Sort; label: string }[];
		sort: Sort;
		open: boolean;
		// The number of filters that are on. A closed bar hides the chips, so its button shows it.
		count: number;
		chips: Snippet;
		// The control that adds to the list of the part. It stays in view when the bar is closed.
		end?: Snippet;
	};
	let {
		label,
		find = $bindable(),
		sequence,
		sorts,
		sort = $bindable(),
		open = $bindable(),
		count,
		chips,
		end
	}: Props = $props();

	const more = $props.id();
</script>

<!--
	The controls above the list of a part. On a phone, the bar is closed until you need it: one row
	with the find field. On a wide tab, all of it is in one row, so it has no button.
-->
<div class="wfd-bar">
	<div class="wfd-bar__tools" class:wfd-bar__tools--end={Boolean(end)}>
		<div class="wfd-bar__find">
			<FindField {label} bind:value={find} />
		</div>

		<button
			class="wfd-bar__toggle"
			type="button"
			aria-label={count ? `Sequence and filters, ${count} on` : 'Sequence and filters'}
			aria-expanded={open}
			aria-controls={more}
			onclick={() => (open = !open)}
		>
			<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5h16M5 10h10M8 15h4" /></svg>
			{#if count && !open}
				<span class="wfd-bar__count wfd-number" aria-hidden="true">{count}</span>
			{/if}
		</button>

		<div class="wfd-bar__more" class:wfd-bar__more--open={open} id={more}>
			<div class="wfd-bar__clip">
				<!-- One row: the sequence stays, and the filters scroll to the side. -->
				<div class="wfd-bar__filters">
					<div class="wfd-bar__sort-box">
						<Field>
							<select class="wfd-bar__sort" aria-label={sequence} bind:value={sort}>
								{#each sorts as option (option.value)}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</Field>
					</div>

					<!-- The name is hidden text, because Obsidian shows each aria-label as a tooltip. -->
					<div class="wfd-bar__chips" role="group" aria-labelledby="{more}-chips">
						<span class="wfd-bar__hidden" id="{more}-chips">Filters</span>
						{@render chips()}
					</div>
				</div>
			</div>
		</div>

		{#if end}
			<div class="wfd-bar__end">{@render end()}</div>
		{/if}
	</div>
</div>

<style>
	.wfd-bar__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* The bar asks its own width: a phone gets two rows, and a wide tab gets one row. */
	.wfd-bar {
		container-type: inline-size;
	}

	.wfd-bar__tools {
		display: grid;
		grid-template:
			'find toggle' auto
			'more more' auto / minmax(0, 1fr) auto;
		column-gap: var(--wfd-space-group);
		align-items: center;
	}

	.wfd-bar__tools--end {
		grid-template:
			'find toggle end' auto
			'more more more' auto / minmax(0, 1fr) auto auto;
	}

	.wfd-bar__find {
		grid-area: find;
	}

	.wfd-bar__end {
		display: grid;
		grid-area: end;
	}

	/* The button has the size of the find field. Ink tells that the bar is open. */
	button.wfd-bar__toggle {
		position: relative;
		display: grid;
		grid-area: toggle;
		place-items: center;
		inline-size: 50px;
		block-size: var(--wfd-control);
		padding: 0;
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		cursor: pointer;
		transition:
			background-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion);

		&[aria-expanded='true'] {
			border-color: var(--wfd-color-selected);
			background: var(--wfd-color-selected);
			color: var(--wfd-color-on-selected);
		}

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-bar__toggle svg {
		inline-size: 20px;
		block-size: 20px;
		fill: none;
		stroke: currentcolor;
		stroke-linecap: square;
		stroke-width: 2.5;
	}

	.wfd-bar__count {
		position: absolute;
		inset-block-start: -8px;
		inset-inline-end: -8px;
		display: grid;
		place-items: center;
		min-inline-size: 22px;
		block-size: 22px;
		padding-inline: var(--wfd-space-tight);
		border: var(--wfd-border) solid var(--wfd-color-bg);
		border-radius: var(--wfd-radius-sticker);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
		font-size: var(--wfd-font-size-label);
		animation: appear var(--wfd-motion-change) var(--wfd-ease-out);
	}

	/*
	 * The second row opens from no height to its own height. A row that is closed is not there for
	 * the keyboard or for a screen reader.
	 */
	.wfd-bar__more {
		display: grid;
		grid-area: more;
		grid-template-rows: 0fr;
		min-inline-size: 0;
		visibility: hidden;
		transition:
			grid-template-rows var(--wfd-motion-change) var(--wfd-ease-out),
			visibility var(--wfd-motion-change);
	}

	.wfd-bar__more--open {
		grid-template-rows: 1fr;
		visibility: visible;
	}

	/* Only the height is cut, so that the focus ring of the sequence keeps its sides. */
	.wfd-bar__clip {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		min-block-size: 0;
		overflow-y: clip;
	}

	.wfd-bar__filters {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		min-inline-size: 0;
		margin-block-start: var(--wfd-space-group);
	}

	.wfd-bar__sort-box {
		flex: none;
	}

	/* The sequence sits in the row of the chips, so it has their height and their text. */
	.wfd-bar :global(.wfd-field select.wfd-bar__sort) {
		min-block-size: var(--wfd-control-min);
		padding-inline: var(--wfd-space-inset) calc(var(--wfd-space-inset) + var(--wfd-space-section));
		font-size: var(--wfd-font-size-small);
		font-weight: 700;
	}

	.wfd-bar__chips {
		display: flex;
		gap: var(--wfd-space-group);
		min-inline-size: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	@container (inline-size > 46rem) {
		.wfd-bar__tools {
			grid-template: 'find more' auto / minmax(12rem, 18rem) minmax(0, 1fr);
			column-gap: var(--wfd-space-stack);
		}

		.wfd-bar__tools--end {
			grid-template: 'find more end' auto / minmax(12rem, 18rem) minmax(0, 1fr) auto;
		}

		button.wfd-bar__toggle {
			display: none;
		}

		.wfd-bar__more {
			grid-template-rows: 1fr;
			visibility: visible;
		}

		.wfd-bar__filters {
			margin-block-start: 0;
		}
	}

	@keyframes appear {
		from {
			opacity: 0;
			scale: 0.6;
		}
	}
</style>
