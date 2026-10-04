<script>
	/**
	 * A select that looks like a chip, for one filter with a few values. The label is for screen
	 * readers: the selected value is the text in view.
	 * "active" gives the ink fill: use it when the filter hides something.
	 * @type {{
	 *   label: string,
	 *   options: { value: string, label: string }[],
	 *   value?: string,
	 *   active?: boolean
	 * }}
	 */
	let { label, options, value = $bindable(''), active = false } = $props();

	const uid = $props.id();
</script>

<span class={['select-chip', active && 'select-chip--active']}>
	<label class="visually-hidden" for={uid}>{label}</label>
	<select class="select-chip__control" id={uid} bind:value>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</span>

<style>
	/* A chip is 32 high. The select is taller, so that a finger hits it: 44 high. */
	.select-chip {
		position: relative;
		display: inline-grid;

		/* The arrow of the select. */
		&::after {
			position: absolute;
			inset-block-start: 50%;
			inset-inline-end: var(--space-3);
			inline-size: 0.4rem;
			block-size: 0.4rem;
			content: '';
			border: solid currentColor;
			border-width: 0 2px 2px 0;
			pointer-events: none;
			rotate: 45deg;
			translate: 0 -70%;
		}

		&.select-chip--active {
			color: var(--paper);
		}
	}

	.select-chip__control {
		min-block-size: var(--chip-hit);
		padding: 0 2rem 0 var(--space-3);
		font-size: 0.8125rem;
		font-weight: 700;
		background: var(--card);
		border: var(--rule-1) solid var(--ink);
		border-radius: var(--radius-sticker);
		appearance: none;
		cursor: pointer;
	}

	.select-chip--active .select-chip__control {
		background: var(--ink);
	}
</style>
