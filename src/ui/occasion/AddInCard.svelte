<script lang="ts">
	import type { NewDish } from '../../occasion/occasion-note';
	import type { RecipeEntry } from '../../recipes/types';
	import Button from '../parts/Button.svelte';
	import AddDish from './AddDish.svelte';

	// "Add a dish" at the end of a card. A tap opens the field in that card, and "Done" closes it.
	// The card tells the person or the course of the new dish.
	type Props = {
		label: string;
		open: boolean;
		recipes: RecipeEntry[];
		ontoggle: () => void;
		onadd: (dish: Pick<NewDish, 'path' | 'name'>) => void;
	};
	let { label, open, recipes, ontoggle, onadd }: Props = $props();
</script>

{#if open}
	<div class="wfd-add-in-card">
		<AddDish {recipes} {onadd} />
		<div><Button kind="link" onclick={ontoggle}>Done</Button></div>
	</div>
{:else}
	<div><Button kind="link" mark="+" onclick={ontoggle}>{label}</Button></div>
{/if}

<style>
	.wfd-add-in-card {
		display: grid;
		gap: var(--wfd-space-group);
	}
</style>
