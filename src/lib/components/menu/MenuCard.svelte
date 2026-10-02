<script>
	import { resolve } from '$app/paths';
	import { entryName } from '$lib/data/menu';
	import { formatDateTime } from '$lib/util/format';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	/**
	 * One meal on the "Today" screen.
	 * @type {{ entry: MenuEntry, oncook: (entry: MenuEntry) => void, onprep: (entry: MenuEntry) => void }}
	 */
	let { entry, oncook, onprep } = $props();

	const name = $derived(entryName(entry));
</script>

<article class="card">
	<h3 class="card__title">
		<a href={resolve('/recipes/[id]', { id: entry.recipe.id })}>{name}</a>
	</h3>

	{#if entry.state === 'todo'}
		<ul class="menu-card__steps">
			{#each entry.recipe.prepSteps as step, index (index)}
				<li>{step.text} <span class="muted">({step.leadHours} hours before)</span></li>
			{/each}
		</ul>
		<button class="button button--primary" type="button" onclick={() => onprep(entry)}>
			Preparation done <span class="visually-hidden">for {name}</span>
		</button>
	{:else if entry.state === 'waiting' && entry.readyAt}
		<p>Preparation is done. Ready to cook: {formatDateTime(entry.readyAt)}.</p>
	{/if}

	<button
		class={['button', entry.state === 'ready' && 'button--primary']}
		type="button"
		onclick={() => oncook(entry)}
	>
		Cooked <span class="visually-hidden">: {name}</span>
	</button>
</article>

<style>
	.menu-card__steps {
		margin: 0;
		padding-inline-start: var(--space-4);
	}
</style>
