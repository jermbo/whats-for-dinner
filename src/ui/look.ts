// The settings of the look, as values for the style of the kitchen tab. A value of null means
// that the Larder look keeps its own value.

import type { Settings } from '../settings';

export function lookOf({ font, fontName, accent }: Settings): Record<string, string | null> {
	// A font name is text that you type. These characters can end a style value.
	const name = fontName.replace(/["'\;{}<>]/g, '').trim();
	const fonts = {
		bricolage: null,
		obsidian: 'var(--font-interface)',
		// A device that does not have the font shows the font of the plugin.
		device: name ? `"${name}", 'Bricolage Grotesque Variable', var(--font-interface)` : null
	};
	const fromObsidian = accent === 'obsidian';

	return {
		'--wfd-display': fonts[font],
		'--wfd-olive': fromObsidian ? 'var(--interactive-accent)' : null,
		'--wfd-on-olive': fromObsidian ? 'var(--text-on-accent)' : null
	};
}
