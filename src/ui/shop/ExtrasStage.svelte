<script lang="ts">
	import type { Kitchen } from '../../kitchen-state.svelte';
	import { isForMeal } from '../../shop/browse';
	import Button from '../parts/Button.svelte';
	import HiddenName from '../parts/HiddenName.svelte';
	import AddItem from './AddItem.svelte';
	import StageFoot from './StageFoot.svelte';
	import SuggestionList from './SuggestionList.svelte';

	type Props = {
		kitchen: Kitchen;
		// Opens the stage Shop.
		onshop: () => void;
	};
	let { kitchen, onshop }: Props = $props();

	// The meals put their food on the list with no action from you. The line tells that it is done.
	const forMeals = $derived(kitchen.list.filter(isForMeal).length);
	const meals = $derived(
		forMeals === 0
			? 'nothing to buy'
			: `${forMeals} ${forMeals === 1 ? 'item' : 'items'} on the list`
	);

	const uid = $props.id();
</script>

<!-- What the plugin cannot decide for you: the staples that need a look, and your own items. -->
<section class="wfd-extras" aria-labelledby="{uid}-name">
	<HiddenName id="{uid}-name" text="Extras" />
	<button class="wfd-extras__meals" type="button" onclick={onshop}>
		<span>Your meals: <strong>{meals}</strong></span>
		<span aria-hidden="true">→</span>
	</button>

	<!-- Above the suggestions, so that the keyboard of a phone does not hide it. -->
	<AddItem
		foods={kitchen.foods}
		itemNotes={kitchen.itemNotes}
		onadd={(path) => kitchen.shop.addExtra(path)}
		onaddnew={(name) => kitchen.shop.addNewItem(name)}
	/>

	<SuggestionList
		suggestions={kitchen.suggestions}
		onadd={(path) => kitchen.shop.addExtra(path)}
		onskip={(path) => kitchen.shop.skip(path)}
		onunskip={(path) => kitchen.shop.unskip(path)}
		onneverask={(path) => kitchen.shop.neverAsk(path)}
	/>

	<StageFoot>
		<Button kind="main" onclick={onshop}>Go shopping <span aria-hidden="true">→</span></Button>
	</StageFoot>
</section>

<style>
	.wfd-extras {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 12px;
	}

	button.wfd-extras__meals {
		display: flex;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
		inline-size: 100%;
		block-size: auto;
		min-block-size: 50px;
		padding: 8px 14px;
		border: 2px solid var(--wfd-line);
		border-radius: var(--wfd-radius-button);
		background: var(--wfd-card);
		box-shadow: none;
		color: var(--wfd-ink-2);
		font-family: inherit;
		font-size: 16px;
		font-weight: 600;
		text-align: start;
		white-space: normal;
		cursor: pointer;

		& strong {
			color: var(--wfd-ink);
			font-weight: 700;
		}

		&:focus-visible {
			outline: 2px solid var(--wfd-ink);
			outline-offset: 2px;
		}
	}
</style>
