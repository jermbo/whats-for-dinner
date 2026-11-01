<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getOutGroups, type GetOutGroup } from '../../cook/get-out';
	import { cookGotOutOf } from '../../cook/cook-pages';
	import { optionsOf } from '../../cook/pick-food';
	import { showName } from '../../match/names';
	import type { RecipeEntry } from '../../recipes/types';
	import GroupHead from '../parts/GroupHead.svelte';
	import Sticker from '../parts/Sticker.svelte';

	// The page "Get out": you mark the ingredients that are on the counter, before you start. Cook
	// Mode keeps the marks, so that they stay when you go to a step and come back.
	type Props = {
		entry: RecipeEntry;
		duration: number;
		onCounter: boolean[];
		// The food item of each line. The last page takes the food out of it.
		picked: (string | null)[];
		// The lines that fit two food items, where you tapped one.
		checked: boolean[];
	};
	let {
		entry,
		duration,
		onCounter = $bindable(),
		picked = $bindable(),
		checked = $bindable()
	}: Props = $props();

	// The list has the groups of the recipe, each with its own count.
	const groups = $derived(getOutGroups(entry.recipe, entry.match.ingredients));
	const gotOf = (group: GetOutGroup) => cookGotOutOf(group, onCounter);

	// A line that fits two food items has one selected. Until you tap, the line asks "Which one?".
	const options = $derived(entry.match.ingredients.map(optionsOf));
	function pick(at: number, path: string) {
		picked[at] = path;
		checked[at] = true;
		onCounter[at] = true;
	}
</script>

<div class="wfd-get-out">
	{#each groups as group}
		<section>
			{#if group.title}
				<GroupHead title={group.title} note={gotOf(group)} />
			{/if}
			<ul class="wfd-get-out__list">
				{#each group.rows as { at, match: { ingredient, status } }}
					<li class="wfd-get-out__row">
						<label class="wfd-get-out__item" class:wfd-get-out__item--got={onCounter[at]}>
							<input type="checkbox" bind:checked={onCounter[at]} />
							<span class="wfd-get-out__name">{showName(ingredient.name)}</span>
							{#if status === 'missing'}
								<Sticker label="None" kind="dashed" />
							{:else if status === 'short'}
								<Sticker label="Low" kind="amber" />
							{:else if status === 'unknown'}
								<Sticker label="Check" />
							{/if}
							<span class="wfd-get-out__amount wfd-number">
								{ingredient.amount?.text ?? ''}
							</span>
						</label>
						{#if options[at].length > 1}
							<div
								class="wfd-get-out__pick"
								role="group"
								aria-label="The food item for {showName(ingredient.name)}"
							>
								{#each options[at] as option (option.path)}
									<button
										class="wfd-get-out__option"
										class:wfd-get-out__option--on={picked[at] === option.path}
										type="button"
										aria-pressed={picked[at] === option.path}
										onclick={() => pick(at, option.path)}
									>
										{option.item.name}
									</button>
								{/each}
								{#if !checked[at]}
									<span out:fade={{ duration }}>
										<Sticker label="Which one?" kind="olive" />
									</span>
								{/if}
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	/* The space between two groups is here, and not above the head of each group. */
	.wfd-get-out {
		display: grid;
		gap: var(--wfd-space-section);
	}

	.wfd-get-out :global(.wfd-group) {
		margin-block-start: 0;
	}

	.wfd-get-out__list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-get-out__item {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		gap: var(--wfd-space-section);
		align-items: center;
		min-block-size: 58px;
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);
		cursor: pointer;
		transition: color var(--wfd-motion-change) var(--wfd-ease-out);
	}

	.wfd-get-out__row {
		border-block-end: var(--wfd-border-thin) solid var(--wfd-color-border);

		& .wfd-get-out__item {
			border-block-end: 0;
		}
	}

	/* The options of a line that fits two food items. The selected one is ink. */
	.wfd-get-out__pick {
		display: flex;
		flex-wrap: wrap;
		gap: var(--wfd-space-group);
		align-items: center;
		padding-block-end: var(--wfd-space-inset);
		padding-inline-start: calc(var(--checkbox-size) + var(--wfd-space-section));
	}

	button.wfd-get-out__option {
		block-size: auto;
		min-block-size: var(--wfd-control-min);
		padding: 0 var(--wfd-space-inset);
		border: var(--wfd-border) solid var(--wfd-color-border);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-color-control);
		box-shadow: none;
		color: var(--wfd-color-text);
		font-family: inherit;
		font-size: var(--wfd-font-size-text);
		font-weight: 600;
		cursor: pointer;
		transition: background-color var(--wfd-chip-motion);

		&:focus-visible {
			outline: var(--wfd-border) solid var(--wfd-color-focus);
			outline-offset: var(--wfd-focus-offset);
		}
	}

	button.wfd-get-out__option--on {
		border-color: var(--wfd-color-selected);
		background: var(--wfd-color-selected);
		color: var(--wfd-color-on-selected);
	}

	.wfd-get-out__item--got {
		color: var(--wfd-color-text-faint);
	}

	.wfd-get-out__name {
		font-size: var(--wfd-font-size-name);
		font-weight: 500;
	}

	.wfd-get-out__amount {
		font-size: var(--wfd-font-size-name);
	}
</style>
