<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { photoRecords } from '../../cook/record';
	import { showDate } from '../../dates';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { RecipeEntry } from '../../recipes/types';
	import HiddenName from '../parts/HiddenName.svelte';

	type Props = { kitchen: Kitchen; entry: RecipeEntry; onclose: () => void };
	let { kitchen, entry, onclose }: Props = $props();

	const records = $derived(photoRecords(entry.recipe.instructions));
	let at = $state(0);
	const record = $derived(records[Math.min(at, records.length - 1)]);
	const url = $derived(record ? kitchen.photoUrl(record.photo, entry.path) : null);

	const duration = $derived(prefersReducedMotion.current ? 0 : 220);
	// The next record comes in from the side to which you go.
	let from = $state(0);
	function go(to: number) {
		if (to < 0 || to >= records.length) return;
		from = to > at ? 60 : -60;
		at = to;
	}

	// The photo follows the finger. A swipe of 50 px or more goes to the next record.
	let start = $state<number | null>(null);
	let moved = $state(0);
	function down(event: PointerEvent) {
		start = event.clientX;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}
	function move(event: PointerEvent) {
		if (start !== null) moved = event.clientX - start;
	}
	function up() {
		if (moved <= -50) go(at + 1);
		else if (moved >= 50) go(at - 1);
		start = null;
		moved = 0;
	}

	// The keys work only in the gallery, so that an arrow key in the editor of a different pane
	// does not move it. The gallery takes the focus when it opens.
	let gallery = $state<HTMLElement>();
	$effect(() => gallery?.focus());

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') go(at - 1);
		else if (event.key === 'ArrowRight') go(at + 1);
		else if (event.key === 'Escape') onclose();
	}

	const uid = $props.id();
</script>

<!-- The arrow keys are the keyboard form of the swipe, so the whole gallery listens for them. -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article
	class="wfd-gallery"
	aria-labelledby="{uid}-name"
	tabindex="-1"
	bind:this={gallery}
	{onkeydown}
>
	<HiddenName id="{uid}-name" text="Meals of {entry.recipe.title}" />
	<header class="wfd-gallery__bar">
		<p class="wfd-gallery__title wfd-label">{entry.recipe.title}</p>
		<span class="wfd-gallery__count wfd-number">{at + 1}/{records.length}</span>
		<button class="wfd-gallery__close" type="button" onclick={onclose}>Close</button>
	</header>

	{#if record}
		{#key at}
			<figure
				class="wfd-gallery__record"
				in:fly={{ x: from, duration }}
				onpointerdown={down}
				onpointermove={move}
				onpointerup={up}
				onpointercancel={up}
			>
				<div class="wfd-gallery__frame">
					{#if url}
						<img
							class="wfd-gallery__photo"
							style:translate="{moved}px 0"
							src={url}
							alt="{entry.recipe.title}, {showDate(record.date)}"
							draggable="false"
						/>
					{/if}
				</div>
				<figcaption class="wfd-gallery__caption">
					<span class="wfd-gallery__date wfd-display">{showDate(record.date)}</span>
					{#if record.rating}
						<span class="wfd-gallery__stars" aria-label="Rating: {record.rating} of 5">
							{'★'.repeat(record.rating)}<span class="wfd-gallery__no-star"
								>{'★'.repeat(5 - record.rating)}</span
							>
						</span>
					{/if}
					{#if record.note}
						<span class="wfd-gallery__note">{record.note}</span>
					{/if}
				</figcaption>
			</figure>
		{/key}
	{/if}
</article>

<style>
	/* The gallery fills the tab with the dark frame of Cook Mode, so that the photo is all you see. */
	/* The focus is only for the arrow keys, so the whole page gets no ring. */
	.wfd-gallery:focus {
		outline: none;
	}

	.wfd-gallery {
		display: flex;
		flex-direction: column;
		gap: 12px;
		block-size: 100%;
		padding: 12px 12px max(var(--safe-area-inset-bottom, 0px), 12px);
		overflow: hidden;
		background: var(--wfd-frame);
		color: #eceae2;
	}

	:global(.view-content.wfd:has(> .wfd-gallery)) {
		background: var(--wfd-frame);
	}

	.wfd-gallery__bar {
		display: flex;
		flex: none;
		gap: 16px;
		align-items: center;
	}

	.wfd-gallery__title {
		flex: 1;
		min-inline-size: 0;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	button.wfd-gallery__close {
		block-size: auto;
		min-block-size: 44px;
		padding: 0 4px;
		border: 0;
		background: none;
		box-shadow: none;
		color: #eceae2;
		font-family: inherit;
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid currentcolor;
		}
	}

	.wfd-gallery__record {
		display: grid;
		flex: 1;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 12px;
		min-block-size: 0;
		margin: 0;
		touch-action: pan-y;
		user-select: none;
	}

	.wfd-gallery__frame {
		display: grid;
		place-items: center;
		min-block-size: 0;
	}

	.wfd-gallery__photo {
		max-inline-size: 100%;
		max-block-size: 100%;
		border-radius: var(--wfd-radius-card);
		object-fit: contain;
	}

	.wfd-gallery__caption {
		display: grid;
		gap: 4px;
		padding-inline: 4px;
	}

	.wfd-gallery__date {
		font-size: 28px;
	}

	.wfd-gallery__stars {
		font-size: 18px;
		letter-spacing: 1px;
	}

	.wfd-gallery__no-star {
		color: #4a463f;
	}

	.wfd-gallery__note {
		font-size: 17px;
		line-height: 1.4;
	}
</style>
