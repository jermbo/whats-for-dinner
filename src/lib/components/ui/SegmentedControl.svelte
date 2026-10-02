<script>
	/**
	 * A group of radio buttons that looks like one row of buttons.
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
		margin-block-end: var(--space-1);
		font-weight: 600;
	}

	.segmented__options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}

	.segmented__option {
		display: grid;
		flex: 1;
		place-items: center;
		min-block-size: var(--tap);
		min-inline-size: var(--tap);
		padding-inline: var(--space-3);
		font-weight: 600;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;

		&:has(:checked) {
			color: var(--color-on-accent);
			background: var(--color-accent);
			border-color: var(--color-accent);
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--color-accent);
			outline-offset: 2px;
		}
	}
</style>
