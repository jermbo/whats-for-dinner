<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Proposal } from '../../shop/proposals';
	import Button from '../parts/Button.svelte';

	type Props = {
		// The text of the field to find, which found no row of the list.
		text: string;
		proposals: Proposal[];
		// The item is the note of a proposal.
		onadd: (path: string) => void;
		// The item has no note: only the name that you typed.
		onaddnew: (name: string) => void;
	};
	let { text, proposals, onadd, onaddnew }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<!--
	In the store, you see the batteries and you take them. The text that found no row proposes the
	notes that it names, and one tap puts the item into the cart.
-->
<div class="wfd-take" aria-live="polite">
	<p class="wfd-take__note">"{text}" is not on the list.</p>
	<ul class="wfd-take__list">
		{#each proposals as proposal (proposal.path)}
			<li class="wfd-take__line" transition:slide={{ duration }}>
				<span class="wfd-take__name">{proposal.name}</span>
				<Button onclick={() => onadd(proposal.path)}>Add to cart</Button>
			</li>
		{/each}
		<li class="wfd-take__line">
			<span class="wfd-take__name wfd-take__name--new">{text.trim()}</span>
			<Button onclick={() => onaddnew(text.trim())}>Add as new</Button>
		</li>
	</ul>
</div>

<style>
	.wfd-take {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-tight);
	}

	.wfd-take__note {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-take__list {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-take__line {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--wfd-space-section);
		align-items: center;
		min-block-size: 60px;
		border-block-end: var(--wfd-border-thin) dashed var(--wfd-color-text-faint);
	}

	.wfd-take__name {
		font-size: var(--wfd-font-size-name);
		font-weight: 600;
	}

	.wfd-take__name::first-letter {
		text-transform: uppercase;
	}

	.wfd-take__name--new {
		color: var(--wfd-color-text-muted);
	}
</style>
