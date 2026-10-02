<script>
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import { entryName } from '$lib/data/menu';
	import { photoMorph } from '$lib/motion/photo-morph';
	import { formatDateTime } from '$lib/util/format';

	/** @typedef {import('$lib/data/menu').MenuEntry} MenuEntry */

	/**
	 * One meal on the "Today" screen.
	 * @type {{
	 *   entry: MenuEntry,
	 *   index?: number,
	 *   oncook: (entry: MenuEntry) => void,
	 *   onprep: (entry: MenuEntry) => void
	 * }}
	 */
	let { entry, index = 0, oncook, onprep } = $props();

	const TAGS = { ready: 'Ready', todo: 'Needs preparation', waiting: 'In preparation' };

	const name = $derived(entryName(entry));
</script>

<article class="card card--media rise" style:--i={index} use:photoMorph>
	<!-- The title below is the link for the keyboard and for screen readers. -->
	<a
		class="card__media"
		href={resolve('/recipes/[id]', { id: entry.recipe.id })}
		tabindex="-1"
		aria-hidden="true"
	>
		<RecipePhoto recipe={entry.recipe} />
		<span class="card__tag">{TAGS[entry.state]}</span>
	</a>

	<div class="card__body">
		<h3 class="card__title">
			<a href={resolve('/recipes/[id]', { id: entry.recipe.id })}>{name}</a>
		</h3>

		{#if entry.state === 'todo'}
			<ul class="menu-card__steps">
				{#each entry.recipe.prepSteps as step, stepIndex (stepIndex)}
					<li>{step.text} <span class="muted">({step.leadHours} hours before)</span></li>
				{/each}
			</ul>
			<button class="button button--strong" type="button" onclick={() => onprep(entry)}>
				Preparation done <span class="visually-hidden">for {name}</span>
			</button>
		{:else if entry.state === 'waiting' && entry.readyAt}
			<p>Preparation is done. Ready to cook: {formatDateTime(entry.readyAt)}.</p>
		{/if}

		<button
			class={['button', entry.state === 'ready' && 'button--strong']}
			type="button"
			onclick={() => oncook(entry)}
		>
			Cooked <span class="visually-hidden">: {name}</span>
		</button>
	</div>
</article>

<style>
	.menu-card__steps {
		margin: 0;
		padding-inline-start: var(--space-4);
	}

	.card__title a {
		color: inherit;
		text-decoration: none;
	}
</style>
