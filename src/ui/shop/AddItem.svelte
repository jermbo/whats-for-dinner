<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { FoodNote } from '../../note';
	import { proposalsFor } from '../../shop/proposals';
	import Button from '../parts/Button.svelte';
	import Field from '../parts/Field.svelte';
	import HiddenName from '../parts/HiddenName.svelte';

	type Props = {
		foods: FoodNote[];
		// The paths of the notes of the items folder.
		itemNotes: string[];
		// The item is the note of a proposal.
		onadd: (path: string) => void;
		// The item has no note: only the name that you typed.
		onaddnew: (name: string) => void;
	};
	let { foods, itemNotes, onadd, onaddnew }: Props = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	let field = $state<HTMLInputElement>();
	let text = $state('');
	const proposals = $derived(proposalsFor(text, foods, itemNotes));

	// The field is empty again and keeps the cursor, so that you can add the next item.
	function done() {
		text = '';
		field?.focus();
	}

	function add(path: string) {
		onadd(path);
		done();
	}

	function addNew() {
		onaddnew(text.trim());
		done();
	}

	const uid = $props.id();
</script>

<!--
	An item of your own. A proposal is a note that the name finds, so its item gets an exact link.
	"Add as new" is for an item that no note has, such as batteries.
-->
<div class="wfd-add">
	<div class="wfd-add__tools">
		<Field>
			<input
				type="text"
				autocomplete="off"
				spellcheck="false"
				aria-label="Add an item"
				placeholder="Add an item"
				bind:this={field}
				bind:value={text}
			/>
		</Field>
		<Button disabled={!text.trim()} onclick={addNew}>Add as new</Button>
	</div>

	{#if proposals.length}
		<HiddenName id="{uid}-proposals" text="Notes with this name" />
		<ul class="wfd-add__proposals" aria-labelledby="{uid}-proposals" transition:slide={{ duration }}>
			{#each proposals as proposal (proposal.path)}
				<li transition:slide={{ duration }}>
					<button class="wfd-add__proposal" type="button" onclick={() => add(proposal.path)}>
						{proposal.name}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.wfd-add {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-tight);
	}

	.wfd-add__tools {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--wfd-space-group);
	}

	.wfd-add__proposals {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* A proposal is one row with the height of a thumb. */
	button.wfd-add__proposal {
		justify-content: start;
		inline-size: 100%;
		block-size: auto;
		min-block-size: var(--wfd-control);
		padding: 0 var(--wfd-space-inset);
		border: 0;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
		border-radius: 0;
		background: none;
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 600;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: -3px;
		}
	}
</style>
