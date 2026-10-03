import { download, exportRecipes, fileName, fileText } from './backup';

/**
 * Makes the recipe file of one recipe and gives it to the owner.
 * On a phone, the share function of the phone opens: the owner sends the file to a different
 * device or saves it to a drive. A browser that cannot share a file downloads it.
 * @param {import('$lib/types').Recipe} recipe
 * @returns {Promise<'shared' | 'downloaded' | 'cancelled'>}
 */
export async function shareRecipe(recipe) {
	const backup = await exportRecipes([recipe.id]);
	const name = fileName(backup, recipe.name);
	const file = new File([fileText(backup)], name, { type: 'application/json' });

	if (navigator.canShare?.({ files: [file] })) {
		try {
			await navigator.share({ files: [file], title: recipe.name });
			return 'shared';
		} catch (error) {
			// The owner closed the share panel.
			if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
		}
	}

	download(backup, name);
	return 'downloaded';
}
