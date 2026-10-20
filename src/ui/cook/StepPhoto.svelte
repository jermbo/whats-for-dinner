<script lang="ts">
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, scale } from 'svelte/transition';
	import type { Step } from '../../cook/steps';

	type Props = {
		step: Step;
		// The address of a photo for the screen, or null when it is gone.
		urlOf: (name: string) => string | null;
		ontake: (photo: Blob) => Promise<unknown>;
		onbest: (name: string | null) => Promise<unknown>;
	};
	let { step, urlOf, ontake, onbest }: Props = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	const url = $derived(step.photo ? urlOf(step.photo) : null);
	// The view of all photos of the step, newest first.
	let open = $state(false);
	const newestFirst = $derived([...step.photos].reverse());
	let saving = $state(false);
	let shown = $state<HTMLButtonElement>();
	let close = $state<HTMLButtonElement>();
	// The view grows from the photo that you tapped, so that you see where it comes from.
	let origin = $state('center');

	async function show() {
		const parent = shown?.offsetParent?.getBoundingClientRect();
		const photo = shown?.getBoundingClientRect();
		if (parent && photo) {
			origin = `${photo.x + photo.width / 2 - parent.x}px ${photo.y + photo.height / 2 - parent.y}px`;
		}
		open = true;
		await tick();
		close?.focus();
	}

	async function hide() {
		open = false;
		await tick();
		shown?.focus();
	}

	async function onchange(event: Event) {
		const field = event.currentTarget as HTMLInputElement;
		const photo = field.files?.[0];
		field.value = '';
		if (!photo) return;
		saving = true;
		try {
			await ontake(photo);
		} finally {
			saving = false;
		}
	}
</script>

<div class="wfd-step-photo">
	{#if url}
		{#key url}
			<button
				class="wfd-step-photo__shown"
				type="button"
				aria-label="All photos of this step"
				bind:this={shown}
				onclick={show}
				in:fade={{ duration }}
			>
				<img src={url} alt="This step, as it must look" />
			</button>
		{/key}
	{/if}

	<label class="wfd-step-photo__take" for="{uid}-camera">
		{saving ? 'One moment' : 'Photo of this step'}
		<input
			id="{uid}-camera"
			class="wfd-step-photo__field"
			type="file"
			accept="image/*"
			capture="environment"
			disabled={saving}
			{onchange}
		/>
	</label>
</div>

{#if open}
	<!-- It covers the work of the card only, so the two buttons of Cook Mode stay: it is not modal. -->
	<div
		class="wfd-step-photo__all"
		role="dialog"
		tabindex="-1"
		aria-labelledby="{uid}-count"
		style:transform-origin={origin}
		transition:scale={{ duration, start: 0.6 }}
		onkeydown={(event) => event.key === 'Escape' && hide()}
	>
		<div class="wfd-step-photo__head">
			<span class="wfd-label" id="{uid}-count">
				{step.photos.length === 1 ? '1 photo' : `${step.photos.length} photos`} of this step
			</span>
			<button class="wfd-step-photo__close" type="button" bind:this={close} onclick={hide}>
				Close
			</button>
		</div>
		<ul class="wfd-step-photo__list">
			{#each newestFirst as photo (photo.name)}
				{@const src = urlOf(photo.name)}
				<li class="wfd-step-photo__one">
					{#if src}<img {src} alt={photo.name} />{/if}
					<button
						class="wfd-step-photo__best"
						class:wfd-step-photo__best--on={photo.best}
						type="button"
						aria-pressed={photo.best}
						onclick={() => onbest(photo.best ? null : photo.name)}
					>
						{#if photo.best}<span aria-hidden="true">✓</span>{/if}
						Best
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.wfd-step-photo {
		display: grid;
		gap: var(--wfd-space-stack);
		justify-items: start;
	}

	button.wfd-step-photo__shown {
		inline-size: 100%;
		max-inline-size: 28rem;
		block-size: auto;
		padding: 0;
		overflow: hidden;
		border: 0;
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-color-track);
		box-shadow: none;
		cursor: pointer;

		& img {
			display: block;
			inline-size: 100%;
			aspect-ratio: 4 / 3;
			object-fit: cover;
		}

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	/* The label is the button. The file field of the browser is hidden, but a screen reader has it. */
	.wfd-step-photo__take {
		position: relative;
		display: inline-flex;
		align-items: center;
		min-block-size: 56px;
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		color: var(--wfd-color-text);
		font-size: var(--wfd-font-size-text);
		font-weight: 700;
		cursor: pointer;

		&:focus-within {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: 2px;
		}
	}

	.wfd-step-photo__field {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	/* The photos of the step cover the work of the card, and the two buttons of Cook Mode stay. */
	.wfd-step-photo__all {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: var(--wfd-space-stack);
		padding: var(--wfd-space-inset) var(--wfd-space-inset);
		background: var(--wfd-color-surface);
	}

	.wfd-step-photo__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: var(--wfd-color-text-muted);
	}

	button.wfd-step-photo__close {
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-tight);
		border: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 700;
		cursor: pointer;
	}

	.wfd-step-photo__list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
		gap: var(--wfd-space-section);
		margin: 0;
		padding: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		list-style: none;
	}

	.wfd-step-photo__one {
		display: grid;
		gap: var(--wfd-space-group);

		& img {
			inline-size: 100%;
			aspect-ratio: 4 / 3;
			border-radius: var(--wfd-radius-button);
			object-fit: cover;
		}
	}

	button.wfd-step-photo__best {
		block-size: auto;
		min-block-size: var(--wfd-control);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 700;
		cursor: pointer;
		transition: background-color var(--wfd-chip-motion);
	}

	button.wfd-step-photo__best--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}
</style>
