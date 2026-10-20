import { describe, expect, it } from 'vitest';
import { readRecipe } from '../../src/recipemd/parse';
import type { Recipe } from '../../src/recipemd/types';

const OMELETTE = `# Spinach omelette

*breakfast, vegetarian, fast*

**1 serving**

---

- *3* eggs
- *50 g* spinach
- *30 g* cheddar cheese, grated
- *1 tbsp* butter
- salt
- black pepper

---

1. Beat the eggs with salt and pepper.
2. Melt the butter in a small pan with medium heat. Cook the spinach for 1 minute.
3. Add the eggs. Cook for 2 minutes, and move the edges to the center.
4. Put the cheese on one half. Fold the omelette and serve.
`;

function recipeOf(markdown: string): Recipe {
	const result = readRecipe(markdown);
	if (!result.ok) throw new Error(result.reason);
	return result.recipe;
}

function reasonOf(markdown: string): string {
	const result = readRecipe(markdown);
	if (result.ok) throw new Error('The note is a recipe.');
	return result.reason;
}

describe('the parts of a recipe note', () => {
	it('the spinach omelette has the title "Spinach omelette"', () => {
		expect(recipeOf(OMELETTE).title).toBe('Spinach omelette');
	});

	it('the spinach omelette has the tags "breakfast", "vegetarian", and "fast"', () => {
		expect(recipeOf(OMELETTE).tags).toEqual(['breakfast', 'vegetarian', 'fast']);
	});

	it('the spinach omelette has the yield "1 serving"', () => {
		expect(recipeOf(OMELETTE).yields).toMatchObject([{ factor: 1, unit: 'serving' }]);
	});

	it('the spinach omelette has 6 ingredients, and the second is 50 g of spinach', () => {
		const { ingredients } = recipeOf(OMELETTE);
		expect(ingredients).toHaveLength(6);
		expect(ingredients[1]).toMatchObject({ name: 'spinach', amount: { factor: 50, unit: 'g' } });
	});

	it('the properties above the title do not change the recipe', () => {
		const withProperties = `---\nrating: 4\ntags:\n  - 05-Recipe/breakfast\n---\n${OMELETTE}`;
		expect(recipeOf(withProperties)).toEqual(recipeOf(OMELETTE));
	});

	it('the heading "Filling" before the spinach puts the spinach and the 4 ingredients after it in the group "Filling"', () => {
		const recipe = recipeOf(OMELETTE.replace('- *50 g* spinach', '## Filling\n\n- *50 g* spinach'));
		expect(recipe.ingredients.map((one) => one.name)).toEqual(['eggs']);
		expect(recipe.groups.map((group) => [group.title, group.ingredients.length])).toEqual([
			['Filling', 5]
		]);
	});
});

describe('a bad recipe note', () => {
	it('the spinach omelette with no title gives a reason, and no recipe', () => {
		expect(reasonOf(OMELETTE.replace('# Spinach omelette\n', ''))).toContain('title');
	});

	it('the spinach omelette with no rule `---` gives a reason, and no recipe', () => {
		expect(reasonOf(OMELETTE.replaceAll('---\n', ''))).toContain('rule');
	});

	it('the amount "*a pinch*" on the salt gives a reason with the text "a pinch"', () => {
		expect(reasonOf(OMELETTE.replace('- salt', '- *a pinch* salt'))).toContain('"a pinch"');
	});

	it('an empty note gives a reason, and no recipe', () => {
		expect(readRecipe('').ok).toBe(false);
	});
});
