// A backup as a file: its name, its text, and the download.

/** @typedef {import('./backup').BackupFile} BackupFile */

/**
 * The name of the file of an export, for example "meal-planner-all-2026-10-03.json".
 * @param {BackupFile} backup
 * @param {string} [label] The name of the one recipe in the file.
 */
export function fileName(backup, label = backup.scope) {
	const slug = label
		.toLowerCase()
		.replace(/[^\p{L}\d]+/gu, '-')
		.replace(/^-|-$/g, '');
	return `meal-planner-${slug || backup.scope}-${backup.exportedAt.slice(0, 10)}.json`;
}

/**
 * The text of the file. A recipe file is for a different device, so it has no line breaks:
 * it is smaller.
 * @param {BackupFile} backup
 */
export function fileText(backup) {
	return JSON.stringify(backup, null, backup.scope === 'all' ? '\t' : undefined);
}

/**
 * Gives the file to the browser as a download.
 * @param {BackupFile} backup
 * @param {string} [name]
 */
export function download(backup, name = fileName(backup)) {
	const blob = new Blob([fileText(backup)], { type: 'application/json' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = name;
	link.click();
	// The browser needs the URL until the download starts.
	setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
