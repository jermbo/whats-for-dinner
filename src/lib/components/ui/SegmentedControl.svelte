<script>
	/**
	 * A group of radio buttons that looks like one row of chips.
	 * @type {{
	 *   legend: string,
	 *   options: { value: string, label: string }[],
	 *   value?: string,
	 *   hideLegend?: boolean,
	 *   onchange?: (value: string) => void
	 * }}
	 */
	let { legend, options, value = $bindable(''), hideLegend = false, onchange } = $props();

	const name = $props.id();

	/** The place of the selected option. -1: no option is selected. */
	const index = $derived(options.findIndex((option) => option.value === value));

	/** @param {string} next */
	function select(next) {
		value = next;
		onchange?.(next);
	}
</script>

<fieldset class="segmented">
	<legend class={['segmented__legend', hideLegend && 'visually-hidden']}>{legend}</legend>
	<div
		class={['segmented__options', index < 0 && 'segmented__options--none']}
		style:--count={options.length}
		style:--index={index}
	>
		{#each options as option (option.value)}
			<label class="segmented__option">
				<input
					class="segmented__input visually-hidden"
					type="radio"
					{name}
					value={option.value}
					checked={option.value === value}
					onchange={() => select(option.value)}
				/>
				<span class="segmented__label">{option.label}</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.segmented {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.segmented__legend {
		padding: 0;
		margin-block-end: var(--space-2);
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	/* One box with an ink rule holds the options. The options have the same width. */
	.segmented__options {
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--count), minmax(0, 1fr));
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);
		overflow: hidden;

		/* The ink fill of the selected option. It slides from the old option to the new one. */
		&::before {
			position: absolute;
			inset-block: 0;
			inset-inline-start: 0;
			inline-size: calc(100% / var(--count));
			content: '';
			background: var(--ink);
			translate: calc(var(--index) * 100%) 0;
			transition: translate 0.4s var(--ease-spring);
		}

		&.segmented__options--none::before {
			display: none;
		}
	}

	.segmented__option {
		/* Above the ink fill. */
		position: relative;
		display: grid;
		place-items: center;
		min-block-size: calc(var(--tap) - 4px);
		padding-inline: var(--space-3);
		font-weight: 700;
		text-align: center;
		cursor: pointer;
		transition: color 0.2s;

		& + & {
			border-inline-start: var(--rule-1) solid var(--ink);
		}

		/* The selected option has bold text on the ink fill. Color is not the only sign. */
		&:has(:checked) {
			font-weight: 800;
			color: var(--paper);
		}

		&:has(:focus-visible) {
			outline: var(--focus-ring);
			outline-offset: -5px;
			box-shadow: none;
		}

		/* The finger is down: the text gives a little, as a key. */
		&:active .segmented__label {
			scale: 0.94;
		}
	}

	.segmented__label {
		transition: scale 0.2s var(--ease-out);
	}
</style>
