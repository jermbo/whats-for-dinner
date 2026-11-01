<script lang="ts">
	import { today } from '../../dates';
	import { useByTimes } from '../../pantry/use-by-times';
	import Button from '../parts/Button.svelte';
	import Field from '../parts/Field.svelte';

	// The one question of the last step of "Add to pantry", and its end. A tap on a time selects a
	// date, and "Correct" adds: "Correct" is the moment where you check the facts above it, so a
	// date alone adds nothing. The field is for the date of the label.
	type Props = {
		// The date of the last add, after a scan of the same package. It is on at the start, so a
		// row of cans is one tap on "Correct" each.
		same: string | null;
		busy: boolean;
		oncorrect: (useBy: string) => void;
	};
	let { same, busy, oncorrect }: Props = $props();

	type Choice = { label: string; date: string };
	const SAME = 'Same date';
	const FIELD = 'Date of the label';
	const options = $derived<Choice[]>([
		...(same ? [{ label: SAME, date: same }] : []),
		...useByTimes(today()),
		{ label: 'No date', date: '' }
	]);
	let chosen = $state<Choice | null>(null);
	const picked = $derived(chosen ?? (same ? { label: SAME, date: same } : null));
	let typed = $state('');

	function choose(choice: Choice) {
		chosen = choice;
		typed = '';
	}

	function type(value: string) {
		typed = value;
		chosen = value ? { label: FIELD, date: value } : null;
	}
</script>

<fieldset class="wfd-use-by-correct" disabled={busy}>
	<legend class="wfd-display">Use by</legend>
	<div class="wfd-use-by-correct__options">
		{#each options as option (option.label)}
			<button
				class="wfd-use-by-correct__option"
				class:wfd-use-by-correct__option--same={option.label === SAME}
				class:wfd-use-by-correct__option--on={picked?.label === option.label}
				type="button"
				aria-pressed={picked?.label === option.label}
				onclick={() => choose(option)}
			>
				{option.label}
			</button>
		{/each}
	</div>
	<Field>
		<input
			type="date"
			aria-label="Use-by date"
			value={typed}
			oninput={(event) => type(event.currentTarget.value)}
		/>
	</Field>
	<Button kind="main" disabled={!picked} onclick={() => picked && oncorrect(picked.date)}>Correct</Button>
</fieldset>

<style>
	.wfd-use-by-correct {
		display: grid;
		gap: var(--wfd-space-group);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-color-text-muted);
	}

	/* A legend is not a child of a grid, so it has its own space below it. The date is what this
	   screen is for, so its question is a title. */
	.wfd-use-by-correct legend {
		margin-block-end: var(--wfd-space-group);
		padding: 0;
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-title);
	}

	/* Two large columns, so that the thumb finds a date with no aim. */
	.wfd-use-by-correct__options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--wfd-space-group);
	}

	button.wfd-use-by-correct__option {
		block-size: auto;
		min-block-size: var(--wfd-control);
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
			outline-offset: var(--wfd-focus-offset);
		}

		&:disabled {
			cursor: default;
			opacity: 0.5;
		}
	}

	button.wfd-use-by-correct__option--same {
		grid-column: 1 / -1;
	}

	button.wfd-use-by-correct__option--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}
</style>
