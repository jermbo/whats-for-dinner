<script lang="ts">
	import { makeStock } from './pantry/food-item';
	import type { Stock } from './pantry/types';

	type Props = {
		// The names of the food items and the places that the pantry has, as proposals.
		names: string[];
		places: string[];
		onadd: (name: string, stock: Stock) => void;
	};
	let { names, places, onadd }: Props = $props();

	const uid = $props.id();
	let name = $state('');
	let amount = $state('');
	let place = $state('');
	let useBy = $state('');

	function add(event: SubmitEvent) {
		event.preventDefault();
		if (!name.trim() || !place.trim()) return;
		onadd(name.trim(), makeStock(place, amount, useBy));
		// The place stays, because you put away some items in one place.
		name = '';
		amount = '';
		useBy = '';
	}
</script>

<details class="add">
	<summary class="add__summary">Add food</summary>

	<form class="add__form" onsubmit={add}>
		<label class="add__field">
			<span class="add__label">Food item</span>
			<input type="text" list="{uid}-names" required bind:value={name} />
		</label>
		<label class="add__field">
			<span class="add__label">Amount</span>
			<input type="text" placeholder="500 g" bind:value={amount} />
		</label>
		<label class="add__field">
			<span class="add__label">Place</span>
			<input type="text" list="{uid}-places" required bind:value={place} />
		</label>
		<label class="add__field">
			<span class="add__label">Use by</span>
			<input type="date" bind:value={useBy} />
		</label>
		<button class="add__button mod-cta" type="submit">Add</button>
	</form>

	<datalist id="{uid}-names">
		{#each names as option}
			<option value={option}></option>
		{/each}
	</datalist>
	<datalist id="{uid}-places">
		{#each places as option}
			<option value={option}></option>
		{/each}
	</datalist>
</details>

<style>
	.add {
		border: var(--border-width) dashed var(--background-modifier-border);
		border-radius: var(--radius-m);
	}

	.add__summary {
		display: flex;
		align-items: center;
		min-block-size: 44px;
		padding-inline: var(--size-4-4);
		color: var(--text-accent);
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid var(--interactive-accent);
			outline-offset: 2px;
		}
	}

	.add__form {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
		gap: var(--size-4-3);
		align-items: end;
		padding: 0 var(--size-4-4) var(--size-4-4);
		animation: reveal 0.2s ease-out;
	}

	.add__field {
		display: grid;
		gap: var(--size-2-2);
	}

	.add__field :global(input) {
		inline-size: 100%;
		min-block-size: 44px;
	}

	.add__label {
		color: var(--text-muted);
		font-size: var(--font-ui-smaller);
	}

	.add__button {
		min-block-size: 44px;
	}

	@keyframes reveal {
		from {
			opacity: 0;
			translate: 0 calc(-1 * var(--size-4-2));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.add__form {
			animation: none;
		}
	}
</style>
