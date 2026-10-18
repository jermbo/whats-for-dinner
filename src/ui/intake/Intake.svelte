<script lang="ts">
	import type { ConvertedNote } from '../../intake/convert';
	import { tagsOf, titleInUse } from '../../intake/known';
	import { foodsOf, readLine } from '../../intake/line';
	import { whyNotSave, type IntakeDraft, type IntakeIngredient } from '../../intake/recipe-text';
	import type { Kitchen } from '../../kitchen-state.svelte';
	import type { FoodNote } from '../../note';
	import Button from '../parts/Button.svelte';
	import PartHead from '../parts/PartHead.svelte';
	import IngredientResult from './IngredientResult.svelte';
	import IntakeLines, { linesOf, type Line } from './IntakeLines.svelte';
	import NewFood from './NewFood.svelte';
	import SourcePhotos from './SourcePhotos.svelte';
	import TagsField from './TagsField.svelte';

	type Props = {
		kitchen: Kitchen;
		// "Convert" starts with the text of a note that is not a recipe, and replaces that note.
		convert?: { path: string; note: ConvertedNote };
		onclose: (saved: boolean) => void;
	};
	let { kitchen, convert, onclose }: Props = $props();

	const uid = $props.id();
	// The fields start once, with the note to convert or empty.
	const start = (() => convert?.note)();

	let title = $state(start?.title ?? '');
	let tags = $state<string[]>(start?.tags ?? []);
	let yields = $state('');
	let source = $state(start?.source ?? '');
	let description = $state(start?.description ?? '');
	let photos = $state<Blob[]>([]);
	let ingredients = $state<Line[]>(linesOf(start?.ingredients ?? []));
	let steps = $state<Line[]>(linesOf(start?.steps ?? []));
	let saving = $state(false);
	// What you selected for a line with no food item, by the id of the line: a food item of the
	// pantry, or a name for the new food. It is for the text of that moment: when you change the
	// text, the line finds its food item again.
	type Choice = { text: string } & ({ is: 'food'; path: string } | { is: 'new'; name: string });
	let chosen = $state<Record<number, Choice>>({});

	const recipes = $derived(kitchen.recipes.map((entry) => entry.recipe));
	const knownTags = $derived(tagsOf(recipes));
	const inUse = $derived(titleInUse(title, recipes));

	const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
	const foodAt = (path: string) => kitchen.foods.find((food) => food.path === path);

	const choiceOf = (line: Line) => (chosen[line.id]?.text === line.text ? chosen[line.id] : null);

	// The food items of a line: the one that you selected, or the ones of its name.
	function foodsOfLine(line: Line): FoodNote[] {
		const choice = choiceOf(line);
		if (choice?.is === 'new') return [];
		const picked = choice?.is === 'food' ? foodAt(choice.path) : undefined;
		return picked ? [picked] : foodsOf(readLine(line.text), kitchen.foodIndex);
	}

	// The name of the stub: the name that you typed, or the name of the line.
	function newNameOf(line: Line): string {
		const choice = choiceOf(line);
		return choice?.is === 'new' ? choice.name : capital(readLine(line.text).name);
	}

	// One food item: a link. Two or more: no link, and Cook Mode selects one. None: a stub.
	function ingredientOf(line: Line): IntakeIngredient {
		const foods = foodsOfLine(line);
		if (foods.length === 1) return { text: line.text, link: foods[0].path, isNew: false };
		if (foods.length > 1) return { text: line.text, link: null, isNew: false };
		const name = newNameOf(line);
		if (!name) return { text: line.text, link: null, isNew: false };
		return { text: line.text, link: kitchen.newFoodPath(name), isNew: true };
	}

	const draft = $derived<Omit<IntakeDraft, 'sourcePhotos'>>({
		title,
		tags,
		yields,
		source,
		description,
		ingredients: ingredients.map(ingredientOf),
		steps: steps.map((line) => line.text)
	});
	const problem = $derived(whyNotSave(draft));

	async function save() {
		if (problem || saving) return;
		saving = true;
		// When the write fails, intake stays open with each field, and a notice tells why.
		const saved = convert
			? await kitchen.convertRecipe(convert.path, start?.properties ?? '', draft, photos)
			: await kitchen.saveRecipe(draft, photos);
		saving = false;
		if (saved) onclose(true);
	}
</script>

<!-- No form: Enter in a field gives the next line, and only the button saves. -->
<section class="wfd-intake" aria-label={convert ? 'Convert' : 'Add recipe'}>
	<PartHead title={convert ? 'Convert' : 'Add recipe'}>
		{#snippet side()}
			<Button kind="link" onclick={() => onclose(false)}>Close</Button>
		{/snippet}
	</PartHead>

	<label class="wfd-intake__field" for="{uid}-title">
		<span class="wfd-label">Title</span>
		<input id="{uid}-title" type="text" autocomplete="off" bind:value={title} />
		{#if inUse}
			<span class="wfd-intake__note" aria-live="polite">
				The vault has the recipe "{inUse}". "Save" makes a second one.
			</span>
		{/if}
	</label>

	<TagsField known={knownTags} bind:tags />

	<div class="wfd-intake__field">
		<label class="wfd-label" for="{uid}-source">Source</label>
		<textarea
			id="{uid}-source"
			rows="1"
			placeholder="One Pan Wonders, page 46"
			bind:value={source}
		></textarea>
		<SourcePhotos bind:photos />
	</div>

	{#if convert}
		<!-- Each text of the old note that has no field is here, so that nothing is lost. -->
		<label class="wfd-intake__field" for="{uid}-description">
			<span class="wfd-label">Description</span>
			<textarea id="{uid}-description" rows="4" bind:value={description}></textarea>
		</label>
	{/if}

	<label class="wfd-intake__field" for="{uid}-yields">
		<span class="wfd-label">Yield</span>
		<input
			id="{uid}-yields"
			type="text"
			autocomplete="off"
			placeholder="4 servings"
			bind:value={yields}
		/>
	</label>

	<IntakeLines label="Ingredients" hint="200 g flour" bind:lines={ingredients}>
		{#snippet result(line)}
			{@const read = readLine(line.text)}
			{@const foods = foodsOfLine(line)}
			{#if foods.length}
				<IngredientResult line={read} {foods} />
			{:else}
				<NewFood
					name={newNameOf(line)}
					foods={kitchen.foods}
					onpick={(path) => (chosen[line.id] = { text: line.text, is: 'food', path })}
					onname={(name) => (chosen[line.id] = { text: line.text, is: 'new', name })}
				/>
			{/if}
		{/snippet}
	</IntakeLines>

	<IntakeLines label="Steps" hint="Mix the flour and the milk." bind:lines={steps} />

	<div class="wfd-intake__end">
		<!-- An empty title only turns "Save" off: a new intake starts with no title, and that is no problem. -->
		{#if problem && title.trim()}
			<p class="wfd-intake__note" aria-live="polite">{problem}</p>
		{/if}
		<Button kind="main" disabled={Boolean(problem) || saving} onclick={save}>
			{saving ? 'One moment' : 'Save'}
		</Button>
	</div>
</section>

<style>
	.wfd-intake {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 18px;
		max-inline-size: 40rem;
	}

	.wfd-intake__field {
		display: grid;
		gap: 6px;
		color: var(--wfd-ink-2);
	}

	.wfd-intake__field :global(:is(input, textarea)) {
		inline-size: 100%;
	}

	.wfd-intake__end {
		display: grid;
		gap: 8px;
		padding-block-start: 8px;
		border-block-start: var(--wfd-rule-4) solid var(--wfd-ink);
	}

	.wfd-intake__note {
		margin: 0;
		color: var(--wfd-ink-2);
		font-size: 14px;
	}
</style>
