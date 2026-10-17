<script lang="ts">
	import { addDays } from '../../dates';

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
		<input
			class="wfd-use-by__date"
			type="date"
			aria-label="Use-by date"
			{value}
			oninput={(event) => onchange(event.currentTarget.value)}
		/>
	</div>
</fieldset>

<style>
	.wfd-use-by {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-ink-2);
	}

	/* A legend is not a child of a grid, so it has its own space below it. */
	.wfd-use-by legend {
		margin-block-end: 6px;
		padding: 0;
	}

	.wfd-use-by__options {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	button.wfd-use-by__option {
		block-size: auto;
		min-block-size: 44px;
		padding: 0 14px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-quiet);
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.15s ease-out,
			color 0.15s ease-out;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	button.wfd-use-by__option--on {
		border-color: var(--wfd-ink);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	.wfd-use-by__options :global(input.wfd-use-by__date) {
		flex: 1 1 9rem;
		min-block-size: 44px;
		inline-size: auto;
		min-inline-size: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		button.wfd-use-by__option {
			transition: none;
		}
	}
</style>
