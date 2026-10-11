<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';

	let { notes }: { notes: string[] } = $props();

	const uid = $props.id();
	const count = $derived(`${notes.length} ${notes.length === 1 ? 'note' : 'notes'} in this vault`);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
</script>

<section class="kitchen" aria-labelledby="{uid}-title">
	<h2 class="kitchen__title" id="{uid}-title">What's for Dinner</h2>
	<p class="kitchen__count" aria-live="polite">{count}</p>

	<ul class="kitchen__notes">
		{#each notes as note (note)}
			<li class="kitchen__note" transition:slide={{ duration }}>{note}</li>
		{/each}
	</ul>
</section>

<style>
	.kitchen__title {
		margin-block: 0 var(--size-4-2);
	}

	.kitchen__count {
		margin-block: 0 var(--size-4-4);
		color: var(--text-muted);
	}

	.kitchen__notes {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.kitchen__note {
		padding-block: var(--size-4-3);
		border-block-end: var(--border-width) solid var(--background-modifier-border);
	}
</style>
