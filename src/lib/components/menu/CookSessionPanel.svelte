<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import RatingInput from '$lib/components/ui/RatingInput.svelte';
	import SuccessMark from '$lib/components/ui/SuccessMark.svelte';
	import { setLeftovers, undoCook, updateSession } from '$lib/data/cooking';
	import { db } from '$lib/db/db';
	import { live } from '$lib/live.svelte';
	import { status } from '$lib/status.svelte';
	import { indexBy } from '$lib/util/collections';
	import { formatQuantity, plural } from '$lib/util/format';
	import FinishedPhotoField from '$lib/components/cook/FinishedPhotoField.svelte';
	import CookDeduction from './CookDeduction.svelte';

	/** A session that is this new shows the change of the pantry as it occurs, in milliseconds. */
	const FRESH_MS = 20_000;
	const MINUTE = 60 * 1000;

	/**
	 * The screen after "Cooked": what the pantry lost, plus the optional photo of the finished
	 * meal, rating, note, leftovers, and undo.
	 * A session from Cook mode also tells how long the cook took.
	 * @type {{ id: string }}
	 */
	let { id } = $props();

	const uid = $props.id();

	const session = live(() => db.sessions.get(id), undefined);
	const ingredients = live(() => db.ingredients.toArray(), []);
	const pantry = live(() => db.pantry.toArray(), undefined);
	const recipe = live(async () => {
		const current = await db.sessions.get(id);
		return current && db.recipes.get(current.recipeId);
	}, undefined);

	const ingredientsById = $derived(indexBy(ingredients.current, 'id'));
	const pantryByIngredient = $derived(indexBy(pantry.current ?? [], 'ingredientId'));

	// An old session shows only the amounts: the pantry of today is not the pantry of that day.
	const opened = Date.now();
	const fresh = $derived(
		session.current !== undefined && Date.parse(session.current.cookedAt) > opened - FRESH_MS
	);

	/** The ingredients of the meal that have only a state. "Cooked" does not change them. */
	const uncounted = $derived(
		session.current?.kind === 'recipe'
			? (recipe.current?.ingredients ?? [])
					.map((row) => ingredientsById.get(row.ingredientId))
					.filter((ingredient) => ingredient?.tracking === 'state')
					.map((ingredient) => ingredient?.name)
			: []
	);

	/** The minutes from the start of Cook mode to "Cooked". Zero: the session has no start. */
	const minutes = $derived.by(() => {
		const current = session.current;
		if (!current?.startedAt || !current.cookedAt) return 0;
		return Math.round((Date.parse(current.cookedAt) - Date.parse(current.startedAt)) / MINUTE);
	});

	/** @param {import('$lib/types').CookSession} current */
	async function undo(current) {
		await undoCook(current);
		status.say('Undone. The meal is back on the menu.');
		goto(resolve('/'));
	}
</script>

{#if session.current && !session.current.cookedAt}
	<!-- An open session: Cook mode started, and "Cooked" did not occur yet. -->
	<PageHeader title={session.current.recipeName} />
	<p class="muted">This meal is not cooked yet.</p>
	<div>
		<a class="button button--primary" href={resolve('/cook/[id]', { id })}>Continue to cook</a>
	</div>
{:else if session.current}
	{@const current = session.current}

	<SuccessMark />

	<PageHeader
		title="Cooked: {current.recipeName}"
		heading={current.recipeName}
		eyebrow={minutes > 0
			? `Cooked in ${plural(minutes, 'minute')}. Nice work.`
			: 'Cooked. Nice work.'}
	/>

	<section class="stack stack--tight" aria-labelledby="{uid}-pantry">
		<h2 id="{uid}-pantry">Pantry update</h2>
		{#if current.deductions.length === 0}
			<p class="muted">The pantry did not change.</p>
		{:else if fresh}
			{#if pantry.current}
				<p class="muted">The pantry has less now. Slide a row if you used a different amount.</p>
				<ul class="gauges">
					{#each current.deductions as deduction, index (index)}
						{@const ingredient = ingredientsById.get(deduction.ingredientId)}
						{@const item = pantryByIngredient.get(deduction.ingredientId)}
						{#if ingredient && item}
							<CookDeduction {deduction} {ingredient} {item} {index} />
						{/if}
					{/each}
				</ul>
			{/if}
		{:else}
			<ul class="list">
				{#each current.deductions as deduction, index (index)}
					{@const ingredient = ingredientsById.get(deduction.ingredientId)}
					{#if ingredient}
						<li class="list__item cluster cluster--between">
							<span>{ingredient.name}</span>
							<span>−{formatQuantity(deduction.amount, ingredient.unit)}</span>
						</li>
					{/if}
				{/each}
			</ul>
		{/if}

		{#if uncounted.length > 0}
			<p class="muted">
				Not counted: {uncounted.join(', ')}. The app does not measure them.
			</p>
		{/if}
	</section>

	<section class="stack stack--tight" aria-labelledby="{uid}-photo">
		<h2 id="{uid}-photo">Photo (optional)</h2>
		<FinishedPhotoField session={current} />
	</section>

	<RatingInput
		legend="Rating (optional)"
		value={current.rating}
		onchange={(rating) => updateSession(id, { rating })}
	/>

	<div class="field">
		<label class="field__label" for="{uid}-note">Note for the next time (optional)</label>
		<textarea
			class="field__control"
			id="{uid}-note"
			value={current.note}
			onchange={(event) => updateSession(id, { note: event.currentTarget.value })}></textarea>
	</div>

	{#if current.kind === 'recipe'}
		<label class="field field--inline">
			<input
				type="checkbox"
				checked={current.leftoverMenuId !== null}
				onchange={(event) => setLeftovers(current, event.currentTarget.checked)}
			/>
			<span>There are leftovers. Add them to the menu.</span>
		</label>
	{/if}

	<div class="cluster">
		<a class="button button--primary" href={resolve('/')}>Done</a>
		<button class="button" type="button" onclick={() => undo(current)}>Undo "Cooked"</button>
	</div>
{:else}
	<PageHeader title="Cooked" />
	<p class="muted">This cook session is not on this device.</p>
{/if}
