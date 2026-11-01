<script lang="ts">
	import Button from '../parts/Button.svelte';

	// "⋯" of an occasion: open its note, or delete it. Delete asks first, because the note is the
	// record of the day.
	type Props = { name: string; onopen: () => void; ondelete: () => void };
	let { name, onopen, ondelete }: Props = $props();

	let open = $state(false);
	let asking = $state(false);
	let box = $state<HTMLElement>();

	function toggle() {
		open = !open;
		asking = false;
	}
	// A tap outside the menu closes it.
	function outside(event: PointerEvent) {
		if (open && box && !box.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window onpointerdown={outside} />

<div class="wfd-occasion-menu" bind:this={box}>
	<button class="wfd-occasion-menu__dots" type="button" aria-label="More for {name}" aria-expanded={open} onclick={toggle}>
		<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="4" cy="10" r="2" /><circle cx="10" cy="10" r="2" /><circle cx="16" cy="10" r="2" /></svg>
	</button>
	{#if open}
		<div class="wfd-occasion-menu__box wfd-scheme">
			{#if asking}
				<p class="wfd-occasion-menu__ask">Delete {name}? The note goes to the trash.</p>
				<div class="wfd-occasion-menu__row">
					<Button kind="danger" onclick={() => ((open = false), ondelete())}>Delete</Button>
					<Button kind="link" onclick={() => (asking = false)}>Keep it</Button>
				</div>
			{:else}
				<Button kind="plain" onclick={() => ((open = false), onopen())}>Open the note</Button>
				<Button kind="danger" onclick={() => (asking = true)}>Delete occasion</Button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wfd-occasion-menu {
		position: relative;
	}

	button.wfd-occasion-menu__dots {
		display: grid;
		place-items: center;
		inline-size: var(--wfd-control-min);
		block-size: var(--wfd-control-min);
		padding: 0;
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		cursor: pointer;

		& svg {
			inline-size: 20px;
			block-size: 20px;
			fill: currentcolor;
		}

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	/* The menu is paper again, under the ink of the card. */
	.wfd-occasion-menu__box {
		position: absolute;
		inset-block-start: calc(100% + var(--wfd-space-group));
		inset-inline-end: 0;
		z-index: 6;
		display: grid;
		gap: var(--wfd-space-group);
		inline-size: max-content;
		max-inline-size: 16rem;
		padding: var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-surface);
		animation: wfd-menu-in var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-occasion-menu__ask {
		margin: 0;
	}

	.wfd-occasion-menu__row {
		display: flex;
		gap: var(--wfd-space-group);
	}

	@keyframes wfd-menu-in {
		from {
			opacity: 0;
			translate: 0 calc(-1 * var(--wfd-space-group));
		}
	}
</style>
