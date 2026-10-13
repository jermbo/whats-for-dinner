<script lang="ts">
	type Props = {
		legend: string;
		options: string[];
		// The option that is on, or a text that no option has.
		value: string;
		// The words of the field for a text that no option has, such as "A new place".
		other: string;
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
		<input
			class="wfd-pick__other"
			type="text"
			autocomplete="off"
			aria-label={other}
			placeholder={other}
			value={text}
			oninput={(event) => type(event.currentTarget.value)}
		/>
	</div>
</fieldset>

<style>
	.wfd-pick {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-ink-2);
	}

	/* A legend is not a child of a grid, so it has its own space below it. */
	.wfd-pick legend {
		margin-block-end: 6px;
		padding: 0;
	}

	.wfd-pick__options {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	button.wfd-pick__option {
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

	button.wfd-pick__option--on {
		border-color: var(--wfd-ink);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	/* The field has a dashed edge: it is the place for an option that is not there yet. */
	.wfd-pick__options :global(input.wfd-pick__other) {
		flex: 1 1 9rem;
		min-block-size: 44px;
		inline-size: auto;
		min-inline-size: 0;
		border-style: dashed;
	}

	@media (prefers-reduced-motion: reduce) {
		button.wfd-pick__option {
			transition: none;
		}
	}
</style>
