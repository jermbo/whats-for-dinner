<script lang="ts">
	import { makeStock } from '../../pantry/food-item';
	import type { Stock } from '../../pantry/types';
	import Button from '../parts/Button.svelte';

	type Props = {
		title: string;
		// With a list of names, the editor asks for the name of the food item.
		names?: string[];
		// The name that the field starts with, such as the text that found no food.
		startName?: string;
		stock?: Stock;
		// The places that the pantry has. One tap selects a place.
		places: string[];
		// The low line of the food item, as text. The hint is the line that the plugin sets when the
		// field is empty. With no low line here, the editor does not ask for it.
		low?: { text: string; hint: string };
		// Small text below the fields, such as the brands of the food item.
		facts?: string[];
		onsave: (stock: Stock, name: string, low: string) => void;
		oncancel: () => void;
		onusedup?: () => void;
		onopen?: () => void;
	};
	let {
		title,
		names,
		startName = '',
		stock,
		places,
		low,
		facts = [],
		onsave,
		oncancel,
		onusedup,
		onopen
	}: Props = $props();

	const uid = $props.id();
	// The fields start with the row as it is. After that, they are yours.
	const first = () => stock;
	const firstName = () => startName;
	const firstLow = () => low?.text ?? '';
	let name = $state(firstName());
	let lowText = $state(firstLow());
	let amount = $state(first()?.amountText ?? '');
	let place = $state(first()?.place ?? '');
	let useBy = $state(first()?.useBy ?? '');
	// A place that the pantry does not have yet.
	let newPlace = $state('');

	const where = $derived(newPlace.trim() || place);
	const ready = $derived(Boolean(where) && (!names || Boolean(name.trim())));

	function save(event: SubmitEvent) {
		event.preventDefault();
		if (ready) onsave(makeStock(where, amount, useBy), name.trim(), lowText.trim());
	}
</script>

<form class="wfd-editor" onsubmit={save}>
	<div class="wfd-editor__top">
		<h3 class="wfd-editor__title wfd-display">{title}</h3>
		<Button kind="link" onclick={oncancel}>Cancel</Button>
	</div>

	{#if names}
		<label class="wfd-editor__field">
			<span class="wfd-label">Name</span>
			<!-- svelte-ignore a11y_autofocus -->
			<input type="text" list="{uid}-names" autofocus bind:value={name} />
			<datalist id="{uid}-names">
				{#each names as option}
					<option value={option}></option>
				{/each}
			</datalist>
		</label>
	{/if}

	<fieldset class="wfd-editor__field">
		<legend class="wfd-label">Where</legend>
		<div class="wfd-editor__places">
			{#each places as option}
				<button
					class="wfd-editor__place"
					class:wfd-editor__place--on={!newPlace.trim() && place === option}
					type="button"
					aria-pressed={!newPlace.trim() && place === option}
					onclick={() => ((place = option), (newPlace = ''))}
				>
					{option}
				</button>
			{/each}
			<input
				class="wfd-editor__new"
				type="text"
				aria-label="A new place"
				placeholder="A new place"
				bind:value={newPlace}
			/>
		</div>
	</fieldset>

	<div class="wfd-editor__pair">
		<label class="wfd-editor__field">
			<span class="wfd-label">How much</span>
			<input type="text" placeholder="500 g" bind:value={amount} />
		</label>
		<label class="wfd-editor__field">
			<span class="wfd-label">Use by</span>
			<input type="date" bind:value={useBy} />
		</label>
		{#if low}
			<label class="wfd-editor__field">
				<span class="wfd-label">Low line</span>
				<input type="text" placeholder={low.hint} bind:value={lowText} />
			</label>
		{/if}
	</div>

	{#if facts.length}
		<p class="wfd-editor__facts">{facts.join(' · ')}</p>
	{/if}

	<div class="wfd-editor__actions">
		{#if onusedup}
			<Button onclick={onusedup}>Used up</Button>
		{/if}
		<Button kind="main" type="submit" disabled={!ready}>Save</Button>
	</div>
	{#if onopen}
		<Button kind="link" onclick={onopen}>Open note</Button>
	{/if}
</form>

<style>
	.wfd-editor {
		display: grid;
		gap: 14px;
		padding: 16px;
		border: 2px solid var(--wfd-ink);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-card);
	}

	.wfd-editor__top {
		display: flex;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
		border-block-end: 2px solid var(--wfd-ink);
	}

	.wfd-editor__title {
		margin: 0;
		color: var(--wfd-ink);
		font-size: 22px;
	}

	.wfd-editor__field {
		display: grid;
		gap: 6px;
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--wfd-ink-2);
	}

	.wfd-editor__field :global(input) {
		inline-size: 100%;
	}

	.wfd-editor__places {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	button.wfd-editor__place {
		block-size: auto;
		min-block-size: 50px;
		padding: 0 16px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-quiet);
		box-shadow: none;
		color: var(--wfd-ink);
		font-family: inherit;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.15s ease-out,
			color 0.15s ease-out;

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}

	button.wfd-editor__place--on {
		border-color: var(--wfd-ink);
		background: var(--wfd-ink);
		color: var(--wfd-on-ink);
	}

	.wfd-editor__places :global(input.wfd-editor__new) {
		flex: 1 1 10rem;
		inline-size: auto;
		border-style: dashed;
	}

	.wfd-editor__pair {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
		gap: 12px;
	}

	.wfd-editor__facts {
		margin: 0;
		color: var(--wfd-ink-2);
		font-size: 14px;
	}

	.wfd-editor__actions {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		gap: 12px;
	}

	@media (prefers-reduced-motion: reduce) {
		button.wfd-editor__place {
			transition: none;
		}
	}
</style>
