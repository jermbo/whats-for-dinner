import { getFrontMatterInfo, parseYaml } from 'obsidian';

type Properties = Record<string, unknown>;

const isRecord = (value: unknown): value is Properties =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

// Divides the text of a note into its properties and the text below them.
export function readProperties(text: string): { properties: Properties; body: string } {
	const info = getFrontMatterInfo(text);
	if (!info.exists) return { properties: {}, body: text };

	const body = text.slice(info.contentStart);
	try {
		const properties: unknown = parseYaml(info.frontmatter);
		return { properties: isRecord(properties) ? properties : {}, body };
	} catch {
		// The properties can be incomplete while you type them.
		return { properties: {}, body };
	}
}
