<script lang="ts">
	type View = 'list' | 'cart';
	type Props = {
		view: View;
		// The items in the cart, each item of the trip, and the items to get.
		inCart: number;
		total: number;
		toGet: number;
		// Each new number gives its button one squeeze: a name landed on it.
		shelfLanded: number;
		cartLanded: number;
		onshow: (view: View, event: MouseEvent) => void;
	};
	let { view, inCart, total, toGet, shelfLanded, cartLanded, onshow }: Props = $props();
</script>

<!--
	The shelf at the left and the cart at the right, with a bar of the trip below them. They are in
	the top of the part, so they stay in view while the list scrolls, and a name that flies always
	has a place to land.
-->
<div class="wfd-trip-head">
	<div class="wfd-trip-head__row">
		<button
			class="wfd-trip-head__side"
			class:wfd-trip-head__side--on={view === 'list'}
			type="button"
			data-fly="shelf"
			aria-pressed={view === 'list'}
			onclick={(event) => onshow('list', event)}
		>
			{#key shelfLanded}
				<svg class="wfd-trip-head__icon" class:wfd-trip-head__icon--landed={shelfLanded > 0} viewBox="0 0 24 24" aria-hidden="true">
					<path d="M3 20h18M3 12.5h18M5 12.5V6h3.5v6.5M10.5 12.5V8h3v4.5M15.5 12.5V4.5h3.5v8M5.5 20v-4.5h3V20M10.5 20v-5.5h4V20" />
				</svg>
			{/key}
			<span class="wfd-trip-head__label">To get</span>
			<span class="wfd-trip-head__count wfd-number">{toGet}</span>
		</button>
		<button
			class="wfd-trip-head__side"
			class:wfd-trip-head__side--on={view === 'cart'}
			type="button"
			data-fly="cart"
			aria-pressed={view === 'cart'}
			onclick={(event) => onshow('cart', event)}
		>
			<span class="wfd-trip-head__count wfd-number">{inCart}</span>
			<span class="wfd-trip-head__label">Cart</span>
			{#key cartLanded}
				<svg class="wfd-trip-head__icon" class:wfd-trip-head__icon--landed={cartLanded > 0} viewBox="0 0 24 24" aria-hidden="true">
					<path d="M2.5 4h2.2l2.5 10.3c.1.4.5.7 1 .7h9.2c.5 0 .9-.3 1-.8L20.5 8H6" />
					<circle cx="9" cy="19.2" r="1.6" />
					<circle cx="17" cy="19.2" r="1.6" />
				</svg>
			{/key}
		</button>
	</div>
	<!-- One piece for each item of the trip. The pieces of the cart are ink. -->
	<div class="wfd-trip-head__pieces" aria-hidden="true">
		{#each { length: total }, at}
			<span class="wfd-trip-head__piece" class:wfd-trip-head__piece--done={at < inCart}></span>
		{/each}
	</div>
</div>

<style>
	.wfd-trip-head {
		container-type: inline-size;
		display: grid;
		gap: var(--wfd-space-stack);
	}

	/*
	 * On a phone, the shelf is under the left thumb and the cart at the right edge. On a wide tab,
	 * the two are together at the right, so the eye does not cross the screen from one to the other.
	 */
	.wfd-trip-head__row {
		display: flex;
		gap: var(--wfd-space-stack);
		justify-content: space-between;
	}

	@container (inline-size > 46rem) {
		.wfd-trip-head__row {
			justify-content: flex-end;
		}
	}

	button.wfd-trip-head__side {
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

	button.wfd-trip-head__side--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	.wfd-trip-head__icon {
		inline-size: 24px;
		block-size: 24px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* A name landed: the icon is pressed in and grows back to its size, with no bounce past it. */
	.wfd-trip-head__icon--landed {
		animation: wfd-trip-landed var(--wfd-row-motion);
	}

	@keyframes wfd-trip-landed {
		from {
			scale: 0.7;
		}
	}

	.wfd-trip-head__count {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-trip-head__label {
		font-size: var(--wfd-font-size-small);
	}

	.wfd-trip-head__pieces {
		display: flex;
		gap: var(--wfd-space-tight);
	}

	.wfd-trip-head__piece {
		flex: 1;
		block-size: 8px;
		background: var(--wfd-color-track);
		transition: background-color var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-trip-head__piece--done {
		background: var(--wfd-color-text);
	}
</style>
