<script lang="ts">
	import Field from './Field.svelte';
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
	<Field>
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
	</Field>
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
		color: var(--wfd-color-text-muted);
		pointer-events: none;
	}

	/* The field has the look of each field, with room for the glass and the cross. */
	.wfd-find :global(.wfd-field input.wfd-find__field) {
		padding-inline: var(--wfd-control-min);
	}

	/* An empty field has no cross, so its placeholder can use that room. */
	.wfd-find :global(.wfd-field input.wfd-find__field:placeholder-shown) {
		padding-inline-end: var(--wfd-space-inset);
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
		color: var(--wfd-color-text);
		cursor: pointer;
		animation: appear var(--wfd-motion-change) var(--wfd-ease-out);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -6px;
		}
	}

	@keyframes appear {
		from {
			opacity: 0;
			scale: 0.6;
		}
	}
</style>
