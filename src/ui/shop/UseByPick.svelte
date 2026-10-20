<script lang="ts">
	import { addDays } from '../../dates';
	import Field from '../parts/Field.svelte';

	type Props = {
		// The use-by date as year-month-day, or no text.
		value: string;
		today: string;
		onchange: (value: string) => void;
	};
	let { value, today, onchange }: Props = $props();

	// You think of a use-by date as a time: milk keeps a week. So one tap gives the date, and the
	// field is for the date that the pack tells.
	const options = $derived([
		{ label: 'No date', date: '' },
		{ label: '3 days', date: addDays(today, 3) },
		{ label: '1 week', date: addDays(today, 7) },
		{ label: '2 weeks', date: addDays(today, 14) },
		{ label: '1 month', date: addDays(today, 30) }
	]);
</script>

<fieldset class="wfd-use-by">
	<legend class="wfd-label">Use by</legend>
	<div class="wfd-use-by__options">
		{#each options as option (option.label)}
			<button
				class="wfd-use-by__option"
				class:wfd-use-by__option--on={value === option.date}
				type="button"
				aria-pressed={value === option.date}
				onclick={() => onchange(option.date)}
			>
				{option.label}
			</button>
		{/each}
		<div class="wfd-use-by__date">
			<Field>
				<input
					type="date"
					aria-label="Use-by date"
					{value}
					oninput={(event) => onchange(event.currentTarget.value)}
				/>
			</Field>
		</div>
	</div>
</fieldset>

<style>
	.wfd-use-by {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-color-text-muted);
	}

	/* A legend is not a child of a grid, so it has its own space below it. */
	.wfd-use-by legend {
		margin-block-end: var(--wfd-space-group);
		padding: 0;
	}

	.wfd-use-by__options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
	}

	button.wfd-use-by__option {
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	button.wfd-use-by__option--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	.wfd-use-by__date {
		flex: 1 1 9rem;
		min-inline-size: 0;
	}
</style>
