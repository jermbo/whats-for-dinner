// The parts of a recipe, with the names of the RecipeMD specification.

export type Amount = {
	factor: number;
	unit: string | null;
	// The amount as the note has it, for example "1 1/2 cups".
	text: string;
};

export type Ingredient = {
	name: string;
	amount: Amount | null;
	// The destination of the link, when the name is a link to a different recipe.
	link: string | null;
};

export type IngredientGroup = {
	title: string;
	ingredients: Ingredient[];
	groups: IngredientGroup[];
};

export type Recipe = {
	title: string;
	description: string | null;
	tags: string[];
	yields: Amount[];
	ingredients: Ingredient[];
	groups: IngredientGroup[];
	instructions: string | null;
};

export type RecipeResult = { ok: true; recipe: Recipe } | { ok: false; reason: string };
