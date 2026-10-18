<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { folderPath } from '../../settings';
	import type { UnitSystem } from '../../pantry/unit-system';
	import { areApart, HOME } from '../../setup/home';
	import Chip from '../parts/Chip.svelte';
	import StepFrame from './StepFrame.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const uid = $props.id();
	// The field starts with the setting as it is. After that, it is yours.
	const first = () => ({ folders: kitchen.folders(), text: kitchen.settings.recipesFolder });
	const { folders, text: firstText } = first();
	let text = $state(firstText);

	const path = $derived(folderPath(text));
	// The home gets its name in the next step. Until then, it is the name that it starts with.
	const apart = $derived(areApart(path, HOME));
	const isNew = $derived(Boolean(path) && !folders.includes(path));

	// The first food step writes rows, so the unit system comes before it.
	const systems: { value: UnitSystem; label: string }[] = [
		{ value: 'metric', label: 'Metric' },
		{ value: 'imperial', label: 'Imperial' }
	];
</script>

<StepFrame
	title="Recipes"
	at={1}
	ready={apart}
	oncontinue={() => kitchen.chooseRecipesFolder(path)}
>
	<label class="wfd-recipes">
		<span class="wfd-label">Recipes folder</span>
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
	</label>
	<fieldset class="wfd-recipes wfd-recipes__units">
		<legend class="wfd-label">Units of the pantry</legend>
		<div class="wfd-recipes__chips">
			{#each systems as system (system.value)}
				<Chip
					label={system.label}
					on={kitchen.settings.units === system.value}
					onclick={() => kitchen.changeSettings({ units: system.value })}
				/>
			{/each}
		</div>
	</fieldset>
</StepFrame>

<style>
	.wfd-recipes {
		display: grid;
		gap: 6px;
		color: var(--wfd-ink-2);

		& input {
			inline-size: 100%;
		}
	}

	.wfd-recipes__note {
		font-size: 14px;
	}

	.wfd-recipes__units {
		margin: 16px 0 0;
		padding: 0;
		border: 0;
	}

	.wfd-recipes__chips {
		display: flex;
		gap: 8px;
	}
</style>
