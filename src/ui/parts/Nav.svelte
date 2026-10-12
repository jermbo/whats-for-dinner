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
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-card);

		&::before {
			content: '';
			position: absolute;
			inset-block: 0;
			inset-inline-start: 0;
			inline-size: calc(100% / var(--count));
			background: var(--wfd-ink);
			translate: calc(var(--at) * 100%) 0;
			transition: translate 0.2s ease-out;
		}

		&:has(:focus-visible) {
			outline: 2px solid var(--wfd-ink);
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
		gap: 6px;
		align-items: center;
		justify-content: center;
		min-block-size: 46px;
		color: var(--wfd-ink);
		cursor: pointer;
		transition: color 0.2s ease-out;

		&:has(:checked) {
			color: var(--wfd-on-ink);
		}
	}

	/* A count that changes makes a small jump, so that you see where your tap went. */
	.wfd-nav__count {
		font-size: 14px;
		animation: jump 0.3s ease-out;
	}

	@keyframes jump {
		40% {
			translate: 0 -5px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-nav::before,
		.wfd-nav__option {
			transition: none;
		}

		.wfd-nav__count {
			animation: none;
		}
	}
</style>
