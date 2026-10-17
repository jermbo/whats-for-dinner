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

// The four path settings in the home.
export const homePaths = (home: string) => ({
	pantryFolder: `${home}/Pantry`,
	shoppingFolder: `${home}/Shopping`,
	itemsFolder: `${home}/Shopping/Items`,
	planNote: `${home}/Meal plan.md`
});

export const isInFolder = (path: string, folder: string) =>
	path === folder || path.startsWith(`${folder}/`);

// The recipes folder and the home are two folders, and neither is in the other.
export const areApart = (recipes: string, home: string) =>
	Boolean(recipes && home) && !isInFolder(recipes, home) && !isInFolder(home, recipes);
