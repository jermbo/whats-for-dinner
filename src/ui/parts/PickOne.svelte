<script lang="ts">
	import Field from './Field.svelte';
	type Props = {
		legend: string;
		options: string[];
		// The option that is on, or a text that no option has.
		value: string;
		// The words of the field for a text that no option has, such as "A new place". With no words,
		// the control has no field.
		other?: string;
		// A second tap puts an option off, so that no option is on.
		canBeOff?: boolean;
		onchange: (value: string) => void;
	};
	let { legend, options, value, other, canBeOff = false, onchange }: Props = $props();

	// The control starts with the value as it is. After that, the option and the text are yours.
	const first = () => (options.includes(value) ? ['', value] : [value, '']);
	let text = $state(first()[0]);
	let picked = $state(first()[1]);
	// A text in the field counts, and not the option of the last tap.
	const on = $derived(text.trim() ? '' : picked);

	function pick(option: string) {
		picked = canBeOff && on === option ? '' : option;
		text = '';
		onchange(picked);
	}

	function type(next: string) {
		text = next;
		onchange(text.trim() || picked);
	}
</script>

<!-- One of some options with one tap, or a text that no option has. -->
<fieldset class="wfd-pick">
	<legend class="wfd-label">{legend}</legend>
	<div class="wfd-pick__options">
		{#each options as option (option)}
			<button
				class="wfd-pick__option"
				class:wfd-pick__option--on={on === option}
				type="button"
				aria-pressed={on === option}
				onclick={() => pick(option)}
			>
				{option}
			</button>
		{/each}
		{#if other}
			<div class="wfd-pick__other">
				<Field kind="new">
					<input
						type="text"
						autocomplete="off"
						aria-label={other}
						placeholder={other}
						value={text}
						oninput={(event) => type(event.currentTarget.value)}
					/>
				</Field>
			</div>
		{/if}
	</div>
</fieldset>

<style>
	.wfd-pick {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-color-text-muted);
	}

	/* A legend is not a child of a grid, so it has its own space below it. */
	.wfd-pick legend {
		margin-block-end: var(--wfd-space-group);
		padding: 0;
	}

	.wfd-pick__options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
	}

	button.wfd-pick__option {
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

	button.wfd-pick__option--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	.wfd-pick__other {
		flex: 1 1 9rem;
		min-inline-size: 0;
	}
</style>
