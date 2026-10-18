import type { Vault } from 'obsidian';

// The disk of a Mac or a phone can ignore capital letters: with "pancakes.md" in the vault,
// "Pancakes.md" is in use also, and a new file with that name fails.
export function pathInUse(vault: Vault, path: string): boolean {
	if (vault.getAbstractFileByPath(path)) return true;
	const cut = path.lastIndexOf('/');
	const folder = cut === -1 ? vault.getRoot() : vault.getFolderByPath(path.slice(0, cut));
	const name = path.slice(cut + 1).toLowerCase();
	return Boolean(folder?.children.some((child) => child.name.toLowerCase() === name));
}
