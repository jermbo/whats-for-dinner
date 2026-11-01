// The plugin home: the one folder with each note of the plugin, but the recipes. You delete it to
// remove the notes of the plugin, so the recipes must not be in it.

export const HOME = 'Larder';

// The folders that setup makes in the home, parent first.
export const homeFolders = (home: string) => [
	home,
	`${home}/Pantry`,
	`${home}/Shopping`,
	`${home}/Shopping/Items`
];

// The path settings in the home. The first occasion makes its folder, so setup does not.
export const homePaths = (home: string) => ({
	pantryFolder: `${home}/Pantry`,
	shoppingFolder: `${home}/Shopping`,
	itemsFolder: `${home}/Shopping/Items`,
	occasionsFolder: `${home}/Occasions`,
	planNote: `${home}/Meal plan.md`
});

// The home of a pantry folder that setup made, or no home: a pantry folder at the root of the
// vault, as in a vault from before setup, has none.
export function homeOf(pantryFolder: string): string {
	const end = '/Pantry';
	return pantryFolder.endsWith(end) ? pantryFolder.slice(0, -end.length) : '';
}

export const isInFolder = (path: string, folder: string) =>
	path === folder || path.startsWith(`${folder}/`);

// The recipes folder and the home are two folders, and neither is in the other.
export const areApart = (recipes: string, home: string) =>
	Boolean(recipes && home) && !isInFolder(recipes, home) && !isInFolder(home, recipes);
