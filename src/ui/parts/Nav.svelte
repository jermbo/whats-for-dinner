<script lang="ts" generics="Value extends string">
	// A count shows next to the label, such as the number of items to buy. On a narrow screen, the
	// options can take a second row, and each label stays complete.
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

	// The ink takes the box of the option that is on, so it also finds an option on a second row.
	let nav = $state<HTMLFieldSetElement>();
	let ink = $state<{ x: number; y: number; width: number; height: number } | null>(null);
	// The first box shows at once. After that, the ink slides.
	let placed = $state(false);

	function measure() {
		const on = nav?.querySelectorAll<HTMLElement>('.wfd-nav__option')[at];
		if (!on) return;
		ink = { x: on.offsetLeft, y: on.offsetTop, width: on.offsetWidth, height: on.offsetHeight };
		if (!placed) requestAnimationFrame(() => (placed = true));
	}

	$effect(() => {
		// A new count, such as the number of items to buy, can move the options.
		void options.map((option) => `${option.label}${option.count ?? ''}`).join();
		void at;
		measure();
	});

	$effect(() => {
		if (!nav) return;
		const observer = new ResizeObserver(measure);
		observer.observe(nav);
		return () => observer.disconnect();
	});
</script>

<!-- One row of options, of which one is on. The ink slides to the option that is on. -->
<fieldset
	class="wfd-nav"
	class:wfd-nav--placed={placed}
	style:--ink-x="{ink?.x ?? 0}px"
	style:--ink-y="{ink?.y ?? 0}px"
	style:--ink-width="{ink?.width ?? 0}px"
	style:--ink-height="{ink?.height ?? 0}px"
	bind:this={nav}
>
	<legend class="wfd-hidden">{label}</legend>
	{#each options as option}
		<label class="wfd-nav__option wfd-label">
			<input
				class="wfd-hidden"
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
		display: flex;
		flex-wrap: wrap;
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
			inset-block-start: 0;
			inset-inline-start: 0;
			inline-size: var(--ink-width);
			block-size: var(--ink-height);
			background: var(--wfd-color-selected);
			translate: var(--ink-x) var(--ink-y);
		}

		&:has(:focus-visible) {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}
	}

	.wfd-nav--placed::before {
		transition:
			translate var(--wfd-motion-change) var(--wfd-ease-out),
			inline-size var(--wfd-motion-change) var(--wfd-ease-out),
			block-size var(--wfd-motion-change) var(--wfd-ease-out);
	}

	/* The options share the row. A label stays complete, so an option goes to a new row first. */
	.wfd-nav__option {
		position: relative;
		display: flex;
		flex: 1 1 0;
		gap: var(--wfd-space-group);
		align-items: center;
		justify-content: center;
		min-block-size: var(--wfd-control-min);
		padding-inline: var(--wfd-space-tight);
		color: var(--wfd-color-text);
		white-space: nowrap;
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
