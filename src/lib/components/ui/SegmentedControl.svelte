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

	/** @param {string} next */
	function select(next) {
		value = next;
		onchange?.(next);
	}
</script>

<fieldset class="segmented">
	<legend class={['segmented__legend', hideLegend && 'visually-hidden']}>{legend}</legend>
	<div class="segmented__options">
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

	/* One box with an ink rule holds the options. */
	.segmented__options {
		display: flex;
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-control);
		overflow: hidden;
	}

	.segmented__option {
		display: grid;
		flex: 1;
		place-items: center;
		min-block-size: calc(var(--tap) - 4px);
		min-inline-size: var(--tap);
		padding-inline: var(--space-3);
		font-weight: 700;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s;

		& + & {
			border-inline-start: var(--rule-1) solid var(--ink);
		}

		/* The selected option has an ink fill and bold text. Color is not the only sign. */
		&:has(:checked) {
			font-weight: 800;
			color: var(--paper);
			background: var(--ink);
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--ink);
			outline-offset: -5px;
			box-shadow: none;
		}
	}
</style>
