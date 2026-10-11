<script lang="ts" generics="Value extends string">
	type Option = { value: Value; label: string };
	type Props = {
		label: string;
		options: readonly Option[];
		value: Value;
		onchange: (value: Value) => void;
	};
	let { label, options, value, onchange }: Props = $props();

	const uid = $props.id();
	const at = $derived(options.findIndex((option) => option.value === value));
</script>

<!-- One row of options, of which one is on. The fill slides to the option that is on. -->
<fieldset class="switch" style:--count={options.length} style:--at={at}>
	<legend class="switch__legend">{label}</legend>
	{#each options as option}
		<label class="switch__option">
			<input
				class="switch__input"
				type="radio"
				name={uid}
				checked={option.value === value}
				onchange={() => onchange(option.value)}
			/>
			{option.label}
		</label>
	{/each}
</fieldset>

<style>
	.switch {
		--edge: var(--size-2-1);

		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--count), 1fr);
		min-inline-size: 0;
		margin: 0;
		padding: var(--edge);
		border: var(--border-width) solid var(--background-modifier-border);
		border-radius: var(--radius-m);
		background: var(--background-secondary);

		&::before {
			content: '';
			position: absolute;
			inset-block: var(--edge);
			inset-inline-start: var(--edge);
			inline-size: calc((100% - 2 * var(--edge)) / var(--count));
			border-radius: var(--radius-s);
			background: var(--interactive-accent);
			translate: calc(var(--at) * 100%) 0;
			transition: translate 0.2s ease-out;
		}
	}

	.switch__legend,
	.switch__input {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.switch__option {
		position: relative;
		display: grid;
		place-items: center;
		min-block-size: 44px;
		border-radius: var(--radius-s);
		color: var(--text-muted);
		font-size: var(--font-ui-medium);
		cursor: pointer;
		transition: color 0.2s ease-out;

		&:has(:checked) {
			color: var(--text-on-accent);
		}

		&:has(:focus-visible) {
			outline: 2px solid var(--interactive-accent);
			outline-offset: 2px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.switch::before,
		.switch__option {
			transition: none;
		}
	}
</style>
