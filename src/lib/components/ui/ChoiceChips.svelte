<script>
	/**
	 * A group of radio buttons that looks like a row of pills. It uses less height than the
	 * segmented control. The selected pill has a dark fill.
	 * @type {{
	 *   legend: string,
	 *   options: { value: string, label: string }[],
	 *   value?: string
	 * }}
	 */
	let { legend, options, value = $bindable('') } = $props();

	const name = $props.id();
</script>

<fieldset class="choice-chips">
	<legend class="visually-hidden">{legend}</legend>
	<div class="choice-chips__options">
		{#each options as option (option.value)}
			<label class="choice-chips__option">
				<input
					class="visually-hidden"
					type="radio"
					{name}
					value={option.value}
					bind:group={value}
				/>
				{option.label}
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.choice-chips {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.choice-chips__options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.choice-chips__option {
		position: relative;
		display: inline-flex;
		align-items: center;
		min-block-size: var(--tap);
		padding: var(--space-2) var(--space-4);
		font-weight: 500;
		color: var(--color-muted);
		background: var(--color-surface);
		border-radius: var(--radius-pill);
		box-shadow: var(--shadow);
		cursor: pointer;
		transition:
			background-color 0.25s,
			color 0.25s,
			scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.95;
		}

		&:has(:checked) {
			color: var(--color-on-accent);
			background: var(--color-accent-strong);
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--color-accent-strong);
			outline-offset: 2px;
		}
	}
</style>
