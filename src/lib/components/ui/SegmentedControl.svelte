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
		margin-block-end: var(--space-2);
		font-weight: 600;
	}

	/* One white pill that holds the options. */
	.segmented__options {
		display: flex;
		gap: var(--space-1);
		padding: var(--space-2);
		background: var(--color-surface);
		border-radius: var(--radius-pill);
		box-shadow: var(--shadow);
	}

	.segmented__option {
		display: grid;
		flex: 1;
		place-items: center;
		min-block-size: calc(var(--tap) - var(--space-2));
		min-inline-size: var(--tap);
		padding-inline: var(--space-3);
		color: var(--color-muted);
		border-radius: var(--radius-pill);
		cursor: pointer;
		transition:
			background-color 0.25s,
			color 0.25s,
			scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.95;
		}

		/* The selected option has a fill and bold text. Color is not the only sign. */
		&:has(:checked) {
			font-weight: 600;
			color: var(--color-text);
			background: var(--color-accent-soft);
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--color-accent-strong);
			outline-offset: 2px;
		}
	}
</style>
