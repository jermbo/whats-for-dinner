<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { folderPath } from '../../settings';
	import { areApart, HOME, homePaths } from '../../setup/home';
	import StepFrame from './StepFrame.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	let text = $state(HOME);

	const home = $derived(folderPath(text));
	const recipes = $derived(kitchen.settings.recipesFolder);
	const apart = $derived(areApart(recipes, home));
	// What the button makes, so that you see it before the vault has it.
	const made = $derived.by(() => {
		const paths = homePaths(home || HOME);
		return [paths.pantryFolder, paths.shoppingFolder, paths.itemsFolder, paths.planNote];
	});
</script>

<StepFrame title="Plugin home" at={2} ready={apart} oncontinue={() => kitchen.makeHome(home)}>
	<label class="wfd-home">
		<span class="wfd-label">Name of the folder</span>
		<input type="text" placeholder={HOME} bind:value={text} />
		{#if home && !apart}
			<span class="wfd-home__note">The recipes folder "{recipes}" cannot be in it.</span>
		{:else}
			<span class="wfd-home__note">Each note of the plugin, but the recipes, goes here.</span>
		{/if}
	</label>

	<ul class="wfd-home__made" aria-label="The plugin makes">
		{#each made as path}
			<li>{path}</li>
		{/each}
	</ul>
</StepFrame>

<style>
	.wfd-home {
		display: grid;
		gap: 6px;
		color: var(--wfd-ink-2);

		& input {
			inline-size: 100%;
		}
	}

	.wfd-home__note {
		font-size: 14px;
	}

	.wfd-home__made {
		display: grid;
		gap: 4px;
		margin: 0;
		padding: 12px 16px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-card);
		background: var(--wfd-card);
		color: var(--wfd-ink);
		font-size: 15px;
		font-weight: 600;
		list-style: none;
		overflow-wrap: anywhere;
	}
</style>
