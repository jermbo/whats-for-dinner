<script module lang="ts">
	import type { Verdict } from '../../pantry/brands';

	// One brand as the strip shows it: its first photo, or its name as a chip, and its verdict.
	export type BrandTile = { key: string; name: string; verdict: Verdict | null; url: string | null };
</script>

<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { scale } from 'svelte/transition';

	type Props = {
		brands: BrandTile[];
		// A tap on a brand. A chip with no such tap is text, and its tap goes to the strip.
		ontap: (at: number, tile: HTMLElement) => void;
		tapChips?: boolean;
		// A tap on the strip outside its buttons, such as on the gap between two photos.
		onrest?: () => void;
		// The brand with the ring, or null. With no value, the strip has no selection.
		selected?: number | null;
		// With this, the strip ends with the camera tile. The photo is a new brand.
		ontake?: (photo: Blob, tile: HTMLElement) => Promise<unknown>;
		// What a screen reader says for each brand, such as "Brand A of taco seasoning".
		of: string;
	};
	let { brands, ontap, tapChips = true, onrest, selected, ontake, of }: Props = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	const tiles: HTMLElement[] = $state([]);
	// The ring is one element, so that it can slide from one brand to the next.
	const ring = $derived.by(() => {
		const tile = selected == null ? undefined : tiles[selected];
		if (!tile) return null;
		const { offsetLeft: x, offsetTop: y, offsetWidth: width, offsetHeight: height } = tile;
		return { x, y, width, height };
	});

	let saving = $state(false);
	let camera = $state<HTMLElement>();

	async function take(event: Event) {
		const field = event.currentTarget as HTMLInputElement;
		const photo = field.files?.[0];
		field.value = '';
		if (!photo || !ontake || !camera) return;
		saving = true;
		try {
			await ontake(photo, camera);
		} finally {
			saving = false;
		}
	}

	function rest(event: MouseEvent) {
		if (!(event.target as Element).closest('button, label')) onrest?.();
	}

	const nameOf = (brand: BrandTile) => `${brand.name || 'Brand with no name'} of ${of}`;
</script>

<!-- The mark of a verdict: an olive check or a tomato cross, with its words for a screen reader. -->
{#snippet mark(brand: BrandTile)}
	{#if brand.verdict}
		<span class="wfd-brands__mark wfd-brands__mark--{brand.verdict === 'avoid' ? 'avoid' : 'again'}">
			<span aria-hidden="true">{brand.verdict === 'avoid' ? '✕' : '✓'}</span>
			<span class="wfd-brands__hidden">, {brand.verdict === 'avoid' ? 'avoid' : 'buy again'}</span>
		</span>
	{/if}
{/snippet}

<!-- The row has its own button for the keyboard. A tap on the strip is only a larger target. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="wfd-brands" onclick={rest}>
	{#each brands as brand, at (brand.key)}
		{@const on = selected === at}
		{#if brand.url}
			<button
				class="wfd-brands__photo"
				type="button"
				aria-pressed={selected === undefined ? undefined : on}
				bind:this={tiles[at]}
				onclick={(event) => ontap(at, event.currentTarget)}
				in:scale={{ duration, start: 0.6 }}
			>
				<img src={brand.url} alt="" />
				<span class="wfd-brands__hidden">{nameOf(brand)}</span>
				{@render mark(brand)}
			</button>
		{:else if tapChips}
			<button
				class="wfd-brands__chip"
				type="button"
				aria-pressed={selected === undefined ? undefined : on}
				bind:this={tiles[at]}
				onclick={(event) => ontap(at, event.currentTarget)}
				in:scale={{ duration, start: 0.6 }}
			>
				{brand.name}
				{@render mark(brand)}
			</button>
		{:else}
			<span class="wfd-brands__chip" bind:this={tiles[at]} in:scale={{ duration, start: 0.6 }}>
				{brand.name}
				{@render mark(brand)}
			</span>
		{/if}
	{/each}

	{#if ontake}
		<label
			class="wfd-brands__camera"
			class:wfd-brands__camera--saving={saving}
			for="{uid}-camera"
			bind:this={camera}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M4 8h3l2-3h6l2 3h3v11H4z" />
				<circle cx="12" cy="13" r="3.5" />
			</svg>
			<span class="wfd-brands__hidden">Photo of a new brand of {of}</span>
			<input
				id="{uid}-camera"
				class="wfd-brands__hidden"
				type="file"
				accept="image/*"
				capture="environment"
				disabled={saving}
				onchange={take}
			/>
		</label>
	{/if}

	{#if ring}
		<span
			class="wfd-brands__ring"
			style:translate="{ring.x}px {ring.y}px"
			style:inline-size="{ring.width}px"
			style:block-size="{ring.height}px"
			aria-hidden="true"
		></span>
	{/if}
</div>

<style>
	.wfd-brands {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	/* The mark sits on the corner of the photo, so that the photo stays whole. */
	.wfd-brands__mark {
		position: absolute;
		inset-block-start: 2px;
		inset-inline-end: 2px;
		display: grid;
		place-items: center;
		inline-size: 20px;
		block-size: 20px;
		border: 2px solid var(--wfd-card);
		border-radius: 50%;
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		line-height: 1;
		animation: wfd-mark-in 0.2s ease-out;
	}

	/* On a chip, the mark follows the name. */
	.wfd-brands__chip .wfd-brands__mark {
		position: static;
		margin-inline-start: 6px;
	}

	.wfd-brands__mark--again {
		background: var(--wfd-olive);
		color: var(--wfd-on-olive);
	}

	.wfd-brands__mark--avoid {
		background: var(--wfd-tomato);
	}

	@keyframes wfd-mark-in {
		from {
			scale: 0.4;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-brands__mark {
			animation: none;
		}
	}

	/* A photo is small and square: enough to know a package, and a target for the thumb. */
	button.wfd-brands__photo,
	.wfd-brands__camera {
		position: relative;
		display: grid;
		place-items: center;
		inline-size: 48px;
		block-size: 48px;
		padding: 0;
		overflow: hidden;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-track);
		box-shadow: none;
		cursor: pointer;

		&:focus-visible,
		&:focus-within {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	button.wfd-brands__photo img {
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}

	.wfd-brands__chip {
		display: inline-flex;
		align-items: center;
		block-size: 36px;
		padding: 0 12px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-quiet);
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
	}

	button.wfd-brands__chip {
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	.wfd-brands__camera {
		border-style: dashed;
		background: none;
		color: var(--wfd-ink-2);

		& svg {
			inline-size: 24px;
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linejoin: round;
		}
	}

	.wfd-brands__camera--saving {
		opacity: 0.5;
	}

	.wfd-brands__hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	.wfd-brands__ring {
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		box-sizing: border-box;
		border: 3px solid var(--wfd-olive);
		border-radius: var(--wfd-radius-button);
		pointer-events: none;
		transition:
			translate 0.2s ease-out,
			inline-size 0.2s ease-out,
			block-size 0.2s ease-out;
	}

	@media (prefers-reduced-motion: reduce) {
		.wfd-brands__ring {
			transition: none;
		}
	}
</style>
