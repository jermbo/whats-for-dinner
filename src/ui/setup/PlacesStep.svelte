<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { addPlace, renamePlace } from '../../pantry/places';
	import { firstNewPlace, FIRST_PLACES, MORE_PLACES } from '../../setup/starts';
	import Button from '../parts/Button.svelte';
	import Chip from '../parts/Chip.svelte';
	import Field from '../parts/Field.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import PickOne from '../parts/PickOne.svelte';
	import StepFrame from './StepFrame.svelte';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	let places = $state([...FIRST_PLACES]);
	let newPlace = $state(firstNewPlace(FIRST_PLACES));
	let added = $state('');

	// A place that you rename or remove takes its selection with it.
	const chosen = $derived(places.includes(newPlace) ? newPlace : '');
	const more = $derived(MORE_PLACES.filter((name) => addPlace(places, name) !== places));
	// The list can be one place or many, but not empty.
	const ready = $derived(places.length > 0 && Boolean(chosen));

	// A name that the list has already, or no name, leaves the field as the list has it.
	function rename(old: string, field: HTMLInputElement) {
		const next = renamePlace(places, old, field.value);
		if (next === places) {
			field.value = old;
			return;
		}
		if (newPlace === old) newPlace = field.value.trim();
		places = next;
	}

	function add(name: string) {
		places = addPlace(places, name);
		added = '';
	}

	function addTyped(event: SubmitEvent) {
		event.preventDefault();
		add(added);
	}

	const uid = $props.id();
</script>

<StepFrame
	title="Places"
	at={3}
	{ready}
	oncontinue={() => kitchen.setup.choosePlaces(places, chosen)}
>
	<p class="wfd-places__note">Where your food is. Rename, remove, or add a place: the list is yours.</p>

	<HiddenName id="{uid}-places" text="Places" />
	<ul class="wfd-places" aria-labelledby="{uid}-places">
		{#each places as name (name)}
			<li class="wfd-places__row" transition:slide={{ duration }}>
				<Field>
					<input
						type="text"
						aria-label="Name of {name}"
						value={name}
						onchange={(event) => rename(name, event.currentTarget)}
					/>
				</Field>
				<Button
					aria-label="Remove {name}"
					onclick={() => (places = places.filter((other) => other !== name))}
				>
					<span aria-hidden="true">×</span>
				</Button>
			</li>
		{/each}
	</ul>

	<form class="wfd-places__add" onsubmit={addTyped}>
		<Field kind="new">
			<input type="text" aria-label="A new place" placeholder="A new place" bind:value={added} />
		</Field>
		<Button type="submit" disabled={!added.trim()}>Add</Button>
	</form>

	{#if more.length}
		<div class="wfd-places__more" role="group" aria-labelledby="{uid}-more">
			<HiddenName id="{uid}-more" text="More places" />
			{#each more as name (name)}
				<Chip label="+ {name}" on={false} name="Add {name}" onclick={() => add(name)} />
			{/each}
		</div>
	{/if}

	{#if places.length}
		<div class="wfd-places__new">
			<!-- The control starts again from the list after each change of the list. -->
			{#key places.join('\n')}
				<PickOne
					legend="Place for new food"
					options={places}
					value={chosen}
					onchange={(value) => (newPlace = value)}
				/>
			{/key}
			<p class="wfd-places__note">Put away and add food propose this place for food that has no row yet.</p>
		</div>
	{/if}
</StepFrame>

<style>
	.wfd-places__note {
		margin: 0;
		color: var(--wfd-color-text-muted);
		font-size: var(--wfd-font-size-small);
	}

	.wfd-places {
		display: grid;
		gap: var(--wfd-space-group);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-places__row,
	.wfd-places__add {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--wfd-space-group);
	}

	.wfd-places__more {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-tight) var(--wfd-space-group);
	}

	.wfd-places__new {
		display: grid;
		gap: var(--wfd-space-group);
	}
</style>
