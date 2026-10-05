<script>
	/**
	 * A choice of one from a few, as a row of square boxes. The selected box is ink.
	 * @type {{
	 *   legend: string,
	 *   options: { value: string, label: string }[],
	 *   value: string
	 * }}
	 */
	let { legend, options, value = $bindable() } = $props();

	const name = $props.id();
</script>

<fieldset class="choice">
	<legend class="label choice__legend">{legend}</legend>
	<div class="choice__options" style:--count={options.length}>
		{#each options as option (option.value)}
			<label class="choice__option">
				<input
					class="visually-hidden"
					type="radio"
					{name}
					value={option.value}
					bind:group={value}
				/>
				<span>{option.label}</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.choice {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.choice__legend {
		padding: 0;
		margin-block-end: var(--space-2);
	}

	.choice__options {
		display: grid;
		grid-template-columns: repeat(var(--count), minmax(0, 1fr));
		gap: var(--space-2);
	}

	.choice__option {
		display: grid;
		place-items: center;
		min-block-size: var(--tap);
		padding-inline: var(--space-2);
		font-weight: 700;
		text-align: center;
		background: var(--card);
		border: 2px solid var(--ink);
		border-radius: var(--radius-sticker);
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s,
			scale 0.25s var(--ease-spring);

		&:has(:checked) {
			font-weight: 800;
			color: var(--paper);
			background: var(--ink);
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--ink);
			outline-offset: 2px;
		}

		/* The finger is down: the box gives a little, as a key. */
		&:active {
			scale: 0.95;
		}
	}
</style>
