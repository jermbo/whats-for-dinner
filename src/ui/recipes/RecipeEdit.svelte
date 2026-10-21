<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import Intake from '../intake/Intake.svelte';

	// The edit form of a recipe, in its card, on paper. "Save" writes the note as the edit page does.
	type Props = { kitchen: Kitchen; path: string; onclose: () => void };
	let { kitchen, path, onclose }: Props = $props();
</script>

<div class="wfd-recipe-edit">
	{#await kitchen.intake.readForIntake({ is: 'edit', path }) then start}
		{#if start}
			<Intake {kitchen} replace={{ is: 'edit', path, start }} onclose={() => onclose()} />
		{:else}
			<p class="wfd-recipe-edit__gone">The note of this recipe is gone.</p>
		{/if}
	{/await}
</div>

<style>
	/* The head of the form is the head of a page. In a card, it has the size of the open name. */
	.wfd-recipe-edit :global(.wfd-head__title) {
		font-size: var(--wfd-font-size-title);
	}

	.wfd-recipe-edit__gone {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}
</style>
