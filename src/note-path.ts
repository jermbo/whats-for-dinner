// Where the note of a name is: in a folder of the settings, with a name that is safe for a note.
// The shopping note links to this path before the note is there. Put away makes the note of a
// food item at the same path.

export const notePathIn = (folder: string, name: string) => `${folder}/${noteName(name)}.md`;

// A name that is safe as the name of a note, with a capital first letter.
function noteName(name: string): string {
	const clean = name.replace(/[\\/:*?"<>|#^[\]]/g, ' ').replace(/\s+/g, ' ').trim();
	return clean.charAt(0).toUpperCase() + clean.slice(1);
}
