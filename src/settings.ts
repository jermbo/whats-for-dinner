// The settings of the plugin: where your notes are, the look, Cook Mode, and two rules of the
// pantry. The values are in the data file of the plugin.

import type { AlarmOptions } from './cook/alarm';

export type Settings = AlarmOptions & {
	// Only the notes in this folder are recipes. With no folder, the plugin tries each note that is
	// not in the pantry.
	recipesFolder: string;
	// Each note in this folder is a food item.
	pantryFolder: string;
	// The note with the plan of the week.
	planNote: string;
	// The place of food that is new in the pantry, until you change it.
	newPlace: string;

	// The font of titles, names, and numbers: the font of the plugin, the font of Obsidian, or a
	// font of the device with the name `fontName`.
	font: 'bricolage' | 'obsidian' | 'device';
	fontName: string;
	// The colour of "ready", "done", and the current step: the olive of the plugin, or the accent
	// colour of Obsidian, which comes from your theme.
	accent: 'olive' | 'obsidian';

	keepScreenOn: boolean;

	// Food with a use-by date in this number of days, or less, is food to use soon.
	soonDays: number;
	// With no low line of its own, a food item is low below this percentage of its full amount.
	lowPercent: number;
};

export const DEFAULT_SETTINGS: Settings = {
	recipesFolder: '',
	pantryFolder: 'Pantry',
	planNote: 'Meal plan.md',
	newPlace: 'Kitchen',
	font: 'bricolage',
	fontName: '',
	accent: 'olive',
	sound: 'beeps',
	volume: 7,
	vibrate: true,
	keepScreenOn: true,
	soonDays: 5,
	lowPercent: 25
};

// The path of a folder as the vault has it: "Recipes/" and " Recipes " are "Recipes".
export const folderPath = (text: string) => text.trim().replace(/^\/+|\/+$/g, '');

// The path of a note as the vault has it: "Meal plan" is "Meal plan.md".
export function notePath(text: string): string {
	const path = folderPath(text);
	return !path || path.endsWith('.md') ? path : `${path}.md`;
}
