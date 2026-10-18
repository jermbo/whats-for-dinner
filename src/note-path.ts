// Where the note of a name is: in a folder of the settings, with a name that is safe for a note.
// The shopping note links to this path before the note is there. Put away makes the note of a
// food item at the same path.

export const notePathIn = (folder: string, name: string) => `${folder}/${noteName(name)}.md`;

// A name that is safe as the name of a note, with a capital first letter.
function noteName(name: string): string {
	const clean = name.replace(/[\\/:*?"<>|#^[\]]/g, ' ').replace(/\s+/g, ' ').trim();
	return clean.charAt(0).toUpperCase() + clean.slice(1);
}

// The first path that the vault does not have, as Obsidian names a copy: "Pancakes.md", then
// "Pancakes 1.md". A new note or photo never writes over a file.
export function availablePath(base: string, extension: string, exists: (path: string) => boolean) {
	let path = `${base}.${extension}`;
	for (let number = 1; exists(path); number++) path = `${base} ${number}.${extension}`;
	return path;
}
