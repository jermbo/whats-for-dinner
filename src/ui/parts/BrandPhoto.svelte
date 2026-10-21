<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { easeOf, timeOf } from '../motion';
	import Button from './Button.svelte';
	import Panel from './Panel.svelte';

	type Props = {
		// The address of the photo, or null for a brand with no photo.
		url: string | null;
		// The name of the brand. A brand with no name shows no name.
		name: string;
		// The small photo that you tapped. The large photo grows from it.
		from: HTMLElement | null;
		onclose: () => void;
		// The actions below the photo, such as "In cart".
		children?: Snippet;
	};
	let { url, name, from, onclose, children }: Props = $props();

	let dialog = $state<HTMLDialogElement>();
	let card = $state<HTMLElement>();

	// A modal dialog is above the whole screen, so the photo has the room of the screen, and the
	// browser keeps the focus in it.
	onMount(() => {
		dialog?.showModal();
		grow();
		return () => dialog?.close();
	});

	function grow() {
		const start = from?.getBoundingClientRect();
		const end = card?.getBoundingClientRect();
		if (!start || !end || !card || !end.width) return;
		const x = start.x + start.width / 2 - (end.x + end.width / 2);
		const y = start.y + start.height / 2 - (end.y + end.height / 2);
		const size = start.width / end.width;
		card?.animate(
			[
				{ transform: `translate(${x}px, ${y}px) scale(${size})`, opacity: 0.4 },
				{ transform: 'none', opacity: 1 }
			],
			{ duration: timeOf(card, 'move'), easing: easeOf(card) }
		);
	}

	// A tap on the dark part around the photo closes it.
	function outside(event: MouseEvent) {
		if (event.target === dialog) onclose();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	class="wfd-brand-photo"
	aria-label={name || 'Brand with no name'}
	bind:this={dialog}
	oncancel={(event) => (event.preventDefault(), onclose())}
	onclick={outside}
>
	<div bind:this={card}>
		<Panel kind="form">
			<div class="wfd-brand-photo__card">
				<div class="wfd-brand-photo__head">
					<Button kind="link" onclick={onclose}>Close</Button>
				</div>
				{#if url}
					<img class="wfd-brand-photo__image" src={url} alt={name || 'Brand with no name'} />
				{/if}
				{#if name}
					<span class="wfd-brand-photo__name wfd-display">{name}</span>
				{/if}
				{#if children}
					<div class="wfd-brand-photo__actions">{@render children()}</div>
				{/if}
			</div>
		</Panel>
	</div>
</dialog>

<style>
	dialog.wfd-brand-photo {
		inline-size: min(100% - 32px, 32rem);
		max-inline-size: none;
		max-block-size: calc(100% - 32px);
		padding: 0;
		overflow: visible;
		border: 0;
		background: none;

		&::backdrop {
			background: color-mix(in srgb, var(--wfd-color-frame) 60%, transparent);
		}
	}

	.wfd-brand-photo__card {
		display: grid;
		gap: var(--wfd-space-stack);
	}

	.wfd-brand-photo__head {
		display: flex;
		gap: var(--wfd-space-stack);
		align-items: center;
		justify-content: flex-end;
		min-block-size: var(--wfd-control-min);
	}

	.wfd-brand-photo__name {
		font-size: var(--wfd-font-size-name);
	}

	.wfd-brand-photo__image {
		display: block;
		inline-size: 100%;
		max-block-size: 60vh;
		border-radius: var(--wfd-radius-button);
		object-fit: contain;
		background: var(--wfd-color-track);
	}

	/* The action is at the lower edge, where the thumb is. */
	.wfd-brand-photo__actions {
		display: grid;
		gap: var(--wfd-space-stack);
	}
</style>
