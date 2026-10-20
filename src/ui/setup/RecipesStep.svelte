<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { folderPath } from '../../settings';
	import { areApart, HOME } from '../../setup/home';
	import Field from '../parts/Field.svelte';
	import StepFrame from './StepFrame.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const uid = $props.id();
	// The field starts with the setting as it is. After that, it is yours.
	const first = () => ({ folders: kitchen.setup.folders(), text: kitchen.settings.recipesFolder });
	const { folders, text: firstText } = first();
	let text = $state(firstText);

	const path = $derived(folderPath(text));
	// The home gets its name in the next step. Until then, it is the name that it starts with.
	const apart = $derived(areApart(path, HOME));
	const isNew = $derived(Boolean(path) && !folders.includes(path));
</script>

<StepFrame
	title="Recipes"
	at={1}
	ready={apart}
	oncontinue={() => kitchen.setup.chooseRecipesFolder(path)}
>
	<Field label="Recipes folder">
		<input type="text" list="{uid}-folders" placeholder="Recipes" bind:value={text} />
		<datalist id="{uid}-folders">
			{#each folders as option (option)}
				<option value={option}></option>
			{/each}
		</datalist>
		{#if path && !apart}
			<span class="wfd-recipes__note">Your recipes stay outside {HOME}, so that they stay when you delete it.</span>
		{:else if isNew}
			<span class="wfd-recipes__note">The plugin makes this folder.</span>
		{:else}
			<span class="wfd-recipes__note">Only the notes in this folder are recipes.</span>
		{/if}
	</Field>
</StepFrame>

<style>
	.wfd-recipes__note {
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}
</style>
