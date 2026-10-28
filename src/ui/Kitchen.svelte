<script lang="ts">
	import './fonts.css';
	import './tokens.css';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, fly } from 'svelte/transition';
	import type { Kitchen, Part } from '../kitchen-state.svelte';
	import type { Only as PantryOnly, Sort as PantrySort } from '../pantry/views';
	import type { Only as RecipeOnly, Sort as RecipeSort } from '../recipes/browse';
	import type { Only as ShopOnly, Sort as ShopSort } from '../shop/browse';
	import { BarState } from './bar-state.svelte';
	import CookMode from './cook/CookMode.svelte';
	import PantryPart from './pantry/PantryPart.svelte';
	import Button from './parts/Button.svelte';
	import Nav from './parts/Nav.svelte';
	import PartHead from './parts/PartHead.svelte';
	import PlanPart from './plan/PlanPart.svelte';
	import RecipesPart from './recipes/RecipesPart.svelte';
	import Intake from './intake/Intake.svelte';
	import Gallery from './recipes/Gallery.svelte';
	import HasNotes from './setup/HasNotes.svelte';
	import Setup from './setup/Setup.svelte';
	import { PutAwayDraft } from './shop/put-away-draft.svelte';
	import ShopPart from './shop/ShopPart.svelte';
	import type { Stage } from './shop/stage';

	let { kitchen }: { kitchen: Kitchen } = $props();

	const sequence: Part[] = ['pantry', 'recipes', 'plan', 'shop'];

	const toCook = $derived(kitchen.meals.length);
	const options = $derived([
		{ value: 'pantry' as const, label: 'Pantry' },
		{ value: 'recipes' as const, label: 'Recipes' },
		{ value: 'plan' as const, label: 'Plan', count: toCook },
		{ value: 'shop' as const, label: 'Shop', count: kitchen.list.length }
	]);

	const part = $derived(kitchen.part);
	// The new part comes in from the side of its option in the navigation.
	let from = $state(-16);
	const duration = $derived(prefersReducedMotion.current ? 0 : 200);
	// The kitchen fades in at the end of setup. A tab that opens on the four parts shows them at once.
	let inSetup = $state(false);
	$effect.pre(() => {
		if (kitchen.screen !== 'kitchen') inSetup = true;
	});

	// The bar of each part, with the sequence that the part starts with. A part forgets its bar
	// when it goes off the screen, so the bars are here: they stay while the kitchen is open.
	const bars = {
		pantry: new BarState<PantrySort, PantryOnly>('place'),
		recipes: new BarState<RecipeSort, RecipeOnly>('match'),
		shop: new BarState<ShopSort, ShopOnly>('name')
	};

	function show(next: Part) {
		from = sequence.indexOf(next) > sequence.indexOf(part) ? 16 : -16;
		kitchen.showPart(next);
	}

	// "Add a meal" shows each recipe, the recipes that use up the pantry first.
	function addMeal() {
		bars.recipes.clear();
		bars.recipes.find = '';
		bars.recipes.sort = 'match';
		bars.recipes.open = false;
		show('recipes');
	}

	// The path of the recipe that is in Cook Mode.
	let cooking = $state<string | null>(null);
	const cooked = $derived(kitchen.recipes.find((entry) => entry.path === cooking));
	const cook = (path: string) => (cooking = path);
	const page = $derived(kitchen.page);
	const inGallery = $derived(
		page?.is === 'gallery' ? kitchen.recipes.find((entry) => entry.path === page.path) : undefined
	);

	// After "Save", the Recipes part shows the new recipe.
	function closePage(saved: boolean) {
		kitchen.closePage();
		if (saved) show('recipes');
	}

	// The Shop part forgets its stage and what you gave at put away when it goes off the screen, so
	// the two are here: they stay while the kitchen is open.
	let shopStage = $state<Stage | null>(null);
	const draft = new PutAwayDraft();
</script>

<!-- The note is gone, or it is not a recipe now, or the vault cannot read it: one tap goes back. -->
{#snippet gone(path: string)}
	<PartHead title="Intake">
		{#snippet side()}
			<Button kind="link" onclick={() => kitchen.closePage()}>Close</Button>
		{/snippet}
	</PartHead>
	<p class="wfd-kitchen__gone">The plugin cannot read the note "{path}".</p>
{/snippet}

<!--
	Until setup is complete, the four parts are not there. Before the first read of the vault, the
	kitchen cannot tell setup from a vault with notes, so the screen is empty.
-->
{#if kitchen.screen === null}
	<div class="wfd-kitchen"></div>
{:else if kitchen.screen === 'notes'}
	<HasNotes />
{:else if kitchen.screen !== 'kitchen'}
	<Setup {kitchen} step={kitchen.screen} />
{:else if page?.is === 'intake'}
	<div class="wfd-kitchen" in:fade={{ duration }}>
		<Intake {kitchen} onclose={closePage} />
	</div>
{:else if page?.is === 'convert' || page?.is === 'edit'}
	<div class="wfd-kitchen" in:fade={{ duration }}>
		{#await kitchen.intake.readForIntake(page) then start}
			{#if start}
				<Intake {kitchen} replace={{ is: page.is, path: page.path, start }} onclose={closePage} />
			{:else}
				{@render gone(page.path)}
			{/if}
		{:catch}
			{@render gone(page.path)}
		{/await}
	</div>
{:else if inGallery}
	<Gallery {kitchen} entry={inGallery} onclose={() => kitchen.closePage()} />
{:else if cooked}
	<CookMode {kitchen} entry={cooked} onclose={() => (cooking = null)} />
{:else}
	<div class="wfd-kitchen" in:fade={{ duration: inSetup ? duration : 0 }}>
		<!-- The nav stays at the top while a part scrolls. -->
		<div class="wfd-kitchen__nav">
			<Nav label="Part of the kitchen" {options} value={part} onchange={show} />
		</div>

		{#key part}
			<div in:fly={{ x: from, duration }}>
				{#if part === 'pantry'}
					<PantryPart {kitchen} bar={bars.pantry} />
				{:else if part === 'recipes'}
					<RecipesPart {kitchen} oncook={cook} bar={bars.recipes} />
				{:else if part === 'plan'}
					<PlanPart {kitchen} oncook={cook} onadd={addMeal} />
				{:else}
					<ShopPart {kitchen} bar={bars.shop} {draft} bind:stage={shopStage} />
				{/if}
			</div>
		{/key}
	</div>
{/if}

<style>
	.wfd-kitchen__gone {
		margin: 0;
		color: var(--wfd-color-text-muted);
	}

	/*
	 * The Larder look: paper, cards, and ink. Olive, amber, and tomato are rare, so that they keep
	 * their meaning. Each class has the prefix "wfd", because Obsidian has its own rules for names
	 * such as "card". The tokens are in tokens.css.
	 */
	:global(.wfd) {
		background: var(--wfd-color-bg);
		color: var(--wfd-color-text);
		font-family: var(--wfd-font-body);
		font-size: var(--wfd-font-size-text);
		font-weight: 500;
	}

	/* The parts set their own space, so that Cook Mode can fill the tab. */
	:global(.workspace-leaf-content .view-content.wfd) {
		padding: 0;
	}

	/* Names and titles: the few words that you must find at a glance. */
	:global(.wfd-display) {
		font-family: var(--wfd-font-display);
		font-weight: 700;
		line-height: var(--wfd-line-height-display);
		letter-spacing: -0.02em;
	}

	/* The one number of a row. The unit stays as you wrote it: "500 g", not "500 G". */
	:global(.wfd-number) {
		font-family: var(--wfd-font-display);
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: var(--wfd-line-height-display);
		letter-spacing: -0.02em;
	}

	/* A label names a thing. It is small, heavy, and in capitals. */
	:global(.wfd-label) {
		font-size: var(--wfd-font-size-label);
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	/* A check box is a square of ink. Obsidian draws the check, with these values. */
	:global(.wfd input[type='checkbox']) {
		--checkbox-size: 28px;
		--checkbox-radius: var(--wfd-radius-sticker);
		--checkbox-border-color: var(--wfd-color-border);
		--checkbox-border-color-hover: var(--wfd-color-border);
		--checkbox-color: var(--wfd-color-selected);
		--checkbox-color-hover: var(--wfd-color-selected);
		--checkbox-marker-color: var(--wfd-color-on-selected);

		margin: 0;
		border-width: var(--wfd-border);
	}

	:global(.wfd input[type='checkbox']:checked::after) {
		inset-block-start: -2px;
		inset-inline-start: -2px;
	}

	:global(.wfd input[type='checkbox']:focus-visible) {
		outline: var(--wfd-border) solid var(--wfd-color-focus);
		outline-offset: 2px;
		box-shadow: none;
	}

	/*
	 * The top of a part sticks under the nav, so it must know the height of the nav: its options
	 * and the edge on each side.
	 */
	.wfd-kitchen {
		--wfd-nav-size: calc(var(--wfd-control-min) + 2 * var(--wfd-border));

		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--wfd-space-section);
		padding: var(--wfd-space-page) var(--wfd-space-page)
			calc(max(var(--safe-area-inset-bottom, 0px), var(--wfd-space-section)) + var(--wfd-space-bar));
	}

	/* The paper above the nav hides the lines that scroll past the padding of the kitchen. */
	.wfd-kitchen__nav {
		position: sticky;
		inset-block-start: 0;
		z-index: 4;
		box-shadow: 0 calc(-1 * var(--wfd-space-page)) 0 var(--wfd-space-page) var(--wfd-color-bg);
	}
</style>
