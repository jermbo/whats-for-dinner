<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { folderPath } from '../../settings';
	import { areApart, HOME, homePaths } from '../../setup/home';
	import Field from '../parts/Field.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import Panel from '../parts/Panel.svelte';
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

	const uid = $props.id();
</script>

<StepFrame title="Plugin home" at={2} ready={apart} oncontinue={() => kitchen.setup.makeHome(home)}>
	<Field label="Name of the folder">
		<input type="text" placeholder={HOME} bind:value={text} />
		{#if home && !apart}
			<span class="wfd-home__note">The recipes folder "{recipes}" cannot be in it.</span>
		{:else}
			<span class="wfd-home__note">Each note of the plugin, but the recipes, goes here.</span>
		{/if}
	</Field>

	<HiddenName id="{uid}-made" text="The plugin makes" />
	<Panel kind="form">
		<ul class="wfd-home__made" aria-labelledby="{uid}-made">
			{#each made as path}
				<li>{path}</li>
			{/each}
		</ul>
	</Panel>
</StepFrame>

<style>
	.wfd-home__note {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-home__made {
		display: grid;
		gap: var(--wfd-space-tight);
		margin: 0;
		font-size: var(--wfd-font-size-small);
		font-weight: 600;
		list-style: none;
		overflow-wrap: anywhere;
	}
</style>
