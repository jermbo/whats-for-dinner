<script lang="ts">
	type View = 'list' | 'cart';
	type Props = {
		view: View;
		toGet: number;
		inCart: number;
		// Each new number gives its button one squeeze: a name landed on it.
		shelfLanded: number;
		cartLanded: number;
		onshow: (view: View, event: MouseEvent) => void;
	};
	let { view, toGet, inCart, shelfLanded, cartLanded, onshow }: Props = $props();
</script>

<!--
	The shelf at the left and the cart at the right. They are in the top of the part, so they stay
	in view while the list scrolls, and a name that flies always has a place to land.
-->
<div class="wfd-trip-buttons">
	<button
		class="wfd-trip-buttons__side"
		class:wfd-trip-buttons__side--on={view === 'list'}
		type="button"
		data-fly="shelf"
		aria-pressed={view === 'list'}
		onclick={(event) => onshow('list', event)}
	>
		{#key shelfLanded}
			<svg class="wfd-trip-buttons__icon" class:wfd-trip-buttons__icon--landed={shelfLanded > 0} viewBox="0 0 24 24" aria-hidden="true">
				<path d="M3 20h18M3 12.5h18M5 12.5V6h3.5v6.5M10.5 12.5V8h3v4.5M15.5 12.5V4.5h3.5v8M5.5 20v-4.5h3V20M10.5 20v-5.5h4V20" />
			</svg>
		{/key}
		<span class="wfd-trip-buttons__label">To get</span>
		<span class="wfd-trip-buttons__count wfd-number">{toGet}</span>
	</button>
	<button
		class="wfd-trip-buttons__side"
		class:wfd-trip-buttons__side--on={view === 'cart'}
		type="button"
		data-fly="cart"
		aria-pressed={view === 'cart'}
		onclick={(event) => onshow('cart', event)}
	>
		<span class="wfd-trip-buttons__count wfd-number">{inCart}</span>
		<span class="wfd-trip-buttons__label">Cart</span>
		{#key cartLanded}
			<svg class="wfd-trip-buttons__icon" class:wfd-trip-buttons__icon--landed={cartLanded > 0} viewBox="0 0 24 24" aria-hidden="true">
				<path d="M2.5 4h2.2l2.5 10.3c.1.4.5.7 1 .7h9.2c.5 0 .9-.3 1-.8L20.5 8H6" />
				<circle cx="9" cy="19.2" r="1.6" />
				<circle cx="17" cy="19.2" r="1.6" />
			</svg>
		{/key}
	</button>
</div>

<style>
	.wfd-trip-buttons {
		display: flex;
		gap: var(--wfd-space-stack);
		justify-content: space-between;
	}

	button.wfd-trip-buttons__side {
		display: inline-flex;
		gap: var(--wfd-space-group);
		align-items: center;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-pill);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-weight: 700;
		cursor: pointer;
		transition:
			background-color var(--wfd-chip-motion),
			border-color var(--wfd-chip-motion),
			color var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	button.wfd-trip-buttons__side--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	.wfd-trip-buttons__icon {
		inline-size: 24px;
		block-size: 24px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* A name landed: the icon is pressed in and grows back to its size, with no bounce past it. */
	.wfd-trip-buttons__icon--landed {
		animation: wfd-trip-landed var(--wfd-row-motion);
	}

	@keyframes wfd-trip-landed {
		from {
			scale: 0.7;
		}
	}

	.wfd-trip-buttons__count {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-trip-buttons__label {
		font-size: var(--wfd-font-size-small);
	}
</style>
