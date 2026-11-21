// The property `serve` of an occasion note, as hour:minute in quotes. The quotes stop YAML from
// reading 17:00 as a number. The plugin changes only this one line of the properties.

const SERVE = /^serve\s*:/;

// With a time, the line is there with the new time. With null, the line is gone. A note with no
// properties gets a block at the top, and nothing else of the note changes.
export function setServe(text: string, time: string | null): string {
	const lines = text.split(/\r?\n/);
	const end = lines[0] === '---' ? lines.indexOf('---', 1) : -1;

	if (end === -1) return time === null ? text : `---\nserve: "${time}"\n---\n${text}`;

	const at = lines.findIndex((line, index) => index > 0 && index < end && SERVE.test(line));
	if (time === null) return at === -1 ? text : lines.filter((_, index) => index !== at).join('\n');
	if (at === -1) lines.splice(end, 0, `serve: "${time}"`);
	else lines[at] = `serve: "${time}"`;
	return lines.join('\n');
}
