<script>
	import SelectChip from '$lib/components/ui/SelectChip.svelte';
	import ToggleChip from '$lib/components/ui/ToggleChip.svelte';
	import { MEAL_TYPES, WEEKDAYS } from '$lib/domain/options';
	import { RANGES } from '$lib/domain/preferences';
	import CategorySequence from './CategorySequence.svelte';
	import PreferenceRow from './PreferenceRow.svelte';

	/**
	 * @typedef {import('$lib/domain/preferences').Preferences} Preferences
	 * @typedef {import('$lib/domain/preferences').PreferenceKey} PreferenceKey
	 * @typedef {import('$lib/types').MealType} MealType
	 * @typedef {keyof typeof RANGES} NumberKey
	 * @typedef {{ value: string, label: string }[]} Options
	 */

	/**
	 * The planning preferences: the rules for what the app proposes. Each one is a fact about
	 * the kitchen. See docs/settings/planning-preferences.md.
	 * @type {{
	 *   values: Preferences,
	 *   onchange: <K extends PreferenceKey>(key: K, value: Preferences[K]) => void,
	 *   onreset: (key: PreferenceKey) => void
	 * }}
	 */
	let { values, onchange, onreset } = $props();

	const uid = $props.id();

	/**
	 * Each number of a range, as the options of a select.
	 * @param {NumberKey} key
	 * @returns {Options}
	 */
	function numbers(key) {
		const [min, max] = RANGES[key];
		return Array.from({ length: max - min + 1 }, (_, index) => {
			const value = String(min + index);
			return { value, label: value };
		});
	}

	const weekdays = WEEKDAYS.map((day) => ({ value: String(day.value), label: day.label }));

	/**
	 * @param {MealType} type
	 * @param {boolean} on
	 */
	function setMealType(type, on) {
		const types = values.mealTypes.filter((value) => value !== type);
		onchange('mealTypes', on ? [...types, type] : types);
	}
</script>

{#snippet number(
	/** @type {NumberKey} */ key,
	/** @type {string} */ label,
	/** @type {Options} */ options
)}
	<PreferenceRow {label}>
		<SelectChip
			{label}
			{options}
			bind:value={() => String(values[key]), (value) => onchange(key, Number(value))}
		/>
	</PreferenceRow>
{/snippet}

<section class="stack stack--tight" aria-labelledby="{uid}-title">
	<h2 class="section-title" id="{uid}-title">Planning</h2>

	<div>
		<ul class="planning__rows">
			{@render number('mealsInWeek', 'Meals in a week', numbers('mealsInWeek'))}
			{@render number('weekStartsOn', 'First day of the week', weekdays)}
			{@render number('doubtDays', 'Days before a doubt', numbers('doubtDays'))}
			{@render number('recipeServings', 'Servings of a new recipe', numbers('recipeServings'))}

			<PreferenceRow label="Meal types" group>
				{#each MEAL_TYPES as type (type.value)}
					{@const on = values.mealTypes.includes(type.value)}
					<!-- One type stays on: with none, Menu has nothing to propose. -->
					<ToggleChip
						label={type.label}
						disabled={on && values.mealTypes.length === 1}
						bind:checked={() => on, (next) => setMealType(type.value, next)}
					/>
				{/each}
			</PreferenceRow>
		</ul>

		<CategorySequence
			order={values.categoryOrder}
			onchange={(order) => onchange('categoryOrder', order)}
			onreset={() => onreset('categoryOrder')}
		/>
	</div>
</section>

<style>
	.planning__rows {
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
