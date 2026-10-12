<script lang="ts">
	type Props = { label: string; value: string };
	let { label, value = $bindable() }: Props = $props();

	let field = $state<HTMLInputElement>();

	function clear() {
		value = '';
		field?.focus();
	}
</script>

<!-- A field that finds rows while you type. The cross shows only when the field has text. -->
<div class="wfd-find">
	<svg class="wfd-find__glass" viewBox="0 0 20 20" aria-hidden="true">
		<circle cx="8.5" cy="8.5" r="5.5" />
		<path d="m13 13 5 5" />
	</svg>
	<input
		class="wfd-find__field"
		type="text"
		inputmode="search"
		enterkeyhint="search"
		autocomplete="off"
		autocapitalize="off"
		spellcheck="false"
		aria-label={label}
		placeholder={label}
		bind:this={field}
		bind:value
	/>
	{#if value}
		<button class="wfd-find__clear" type="button" aria-label="Clear" onclick={clear}>
			<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>
		</button>
	{/if}
</div>

<style>
	.wfd-find {
		position: relative;
		display: grid;
		min-inline-size: 0;
	}

	.wfd-find svg {
		inline-size: 20px;
		block-size: 20px;
		fill: none;
		stroke: currentcolor;
		stroke-linecap: square;
		stroke-width: 2.5;
	}

	.wfd-find__glass {
		position: absolute;
		inset-block-start: 15px;
		inset-inline-start: 14px;
		color: var(--wfd-ink-2);
		pointer-events: none;
	}

	.wfd-find :global(input.wfd-find__field) {
		inline-size: 100%;
		padding-inline: 44px;
	}

	/* An empty field has no cross, so its placeholder can use that room. */
	.wfd-find :global(input.wfd-find__field:placeholder-shown) {
		padding-inline-end: 14px;
		text-overflow: ellipsis;
	}

	button.wfd-find__clear {
		position: absolute;
		inset-block: 0;
		inset-inline-end: 0;
		display: grid;
		place-items: center;
		inline-size: 46px;
		block-size: auto;
		padding: 0;
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-ink);
		cursor: pointer;
		animation: appear 0.15s ease-out;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: -6px;
		}
	}

	@keyframes appear {
		from {
			opacity: 0;
			scale: 0.6;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button.wfd-find__clear {
			animation: none;
		}
	}
</style>
