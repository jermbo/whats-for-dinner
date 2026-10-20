<script lang="ts" generics="Value extends string">
	// A count shows next to the label, such as the number of items to buy.
	type Option = { value: Value; label: string; count?: number };
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

<!-- One row of options, of which one is on. The ink slides to the option that is on. -->
<fieldset class="wfd-nav" style:--count={options.length} style:--at={at}>
	<legend class="wfd-nav__legend">{label}</legend>
	{#each options as option}
		<label class="wfd-nav__option wfd-label">
			<input
				class="wfd-nav__input"
				type="radio"
				name={uid}
				checked={option.value === value}
				onchange={() => onchange(option.value)}
			/>
			{option.label}
			{#if option.count}
				{#key option.count}
					<span class="wfd-nav__count wfd-display">{option.count}</span>
				{/key}
			{/if}
		</label>
	{/each}
</fieldset>

<style>
	.wfd-nav {
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--count), 1fr);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		overflow: hidden;
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-surface);

		&::before {
			content: '';
			position: absolute;
			inset-block: 0;
			inset-inline-start: 0;
			inline-size: calc(100% / var(--count));
			background: var(--wfd-color-selected);
			translate: calc(var(--at) * 100%) 0;
			transition: translate var(--wfd-motion-change) var(--wfd-ease-out);
		}

		&:has(:focus-visible) {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-nav__legend,
	.wfd-nav__input {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.wfd-nav__option {
		position: relative;
		display: flex;
		gap: var(--wfd-space-group);
		align-items: center;
		justify-content: center;
		min-block-size: var(--wfd-control-min);
		color: var(--wfd-color-text);
		cursor: pointer;
		transition: color var(--wfd-motion-change) var(--wfd-ease-out);

		&:has(:checked) {
			color: var(--wfd-color-on-selected);
		}
	}

	/* A count that changes makes a small jump, so that you see where your tap went. */
	.wfd-nav__count {
		font-size: var(--wfd-font-size-small);
		animation: jump var(--wfd-motion-move) var(--wfd-ease-out);
	}

	@keyframes jump {
		40% {
			translate: 0 -5px;
		}
	}
</style>
