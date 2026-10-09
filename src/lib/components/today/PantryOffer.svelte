<script>
	import { resolve } from '$app/paths';
	import RecipePhoto from '$lib/components/recipes/RecipePhoto.svelte';
	import { hasPhoto } from '$lib/domain/recipe-photo';
	import { isUrgent } from '$lib/domain/use-by';
	import { soonText } from '$lib/domain/use-up';
	import { photoMorph } from '$lib/motion/photo-morph';

	/**
	 * One meal that the pantry can make now, as a card. It is an offer, and not a plan: the
	 * sticker has a dashed rule. "Cook this" puts the meal on the menu and starts Cook mode.
	 * "Add to menu" keeps it for another night.
	 * @type {{
	 *   idea: import('$lib/domain/use-up').UseUpIdea,
	 *   oncook: (recipe: import('$lib/types').Recipe) => void,
	 *   onadd: (recipe: import('$lib/types').Recipe) => void
	 * }}
	 */
	let { idea, oncook, onadd } = $props();

	const recipe = $derived(idea.recipe);
	const photo = $derived(hasPhoto(recipe));
	/** The food that the meal uses up, the food that spoils first. */
	const first = $derived(idea.uses.toSorted((a, b) => a.left - b.left)[0]);
</script>

<article class={['card', 'pack', !photo && 'pack--plain']} use:photoMorph>
	{#if photo}
		<!-- The title below is the link for the keyboard and for screen readers. -->
		<a
			class="pack__media"
			href={resolve('/recipes/[id]', { id: recipe.id })}
			tabindex="-1"
			aria-hidden="true"
		>
			{#key recipe.id}
				<RecipePhoto {recipe} />
			{/key}
		</a>
	{/if}

	<div class="pack__band">
		<p class="pack__flag"><span class="sticker sticker--dashed">From the pantry</span></p>
		<h3 class="pack__name">
			<a href={resolve('/recipes/[id]', { id: recipe.id })}>{recipe.name}</a>
		</h3>
	</div>

	<div class="pack__foot">
		<div class="pack__line">
			<p>
				<span class="label">
					{first ? `Uses the ${first.ingredient.name.toLowerCase()}` : 'In the pantry'}
				</span>
				<span class={['pack__sub', first && isUrgent(first.left) && 'pack__sub--urgent']}>
					{first ? soonText(first) : 'All ingredients are here.'}
				</span>
			</p>
			<p class="count">
				<span aria-hidden="true">
					{idea.count.have}<span class="count__total">/{idea.count.need}</span>
				</span>
				<span class="visually-hidden">
					The pantry has {idea.count.have} of {idea.count.need} ingredients.
				</span>
			</p>
		</div>

		<div class="pack__actions">
			<button class="button button--strong pack__main" type="button" onclick={() => oncook(recipe)}>
				Cook this <span class="visually-hidden">: {recipe.name}</span>
			</button>
			<button class="button" type="button" onclick={() => onadd(recipe)}>
				Add to menu <span class="visually-hidden">: {recipe.name}</span>
			</button>
		</div>
	</div>
</article>
