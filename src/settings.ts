// The settings of the plugin: where your notes are, the look, Cook Mode, and one rule of the
// pantry. The values are in the data file of the plugin.

import type { AlarmOptions } from './cook/alarm';

export type Settings = AlarmOptions & {
	// Only the notes in this folder are recipes. With no folder, the plugin tries each note that is
	// not in the pantry folder, the shopping folder, or the items folder.
	recipesFolder: string;
	// Each note in this folder is a food item.
	pantryFolder: string;
	// The note with the plan of the week.
	planNote: string;
	// The note of each shopping trip is in this folder.
	shoppingFolder: string;
	// An item of your own that no note has links to a note of this folder. The plugin makes no note
	// there.
	itemsFolder: string;
	// The place of food that is new in the pantry, until you change it.
	newPlace: string;
	// The names of the places of the kitchen, also the places that no row has yet.
	places: string[];

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
	// The last place that the weekly audit finished. The next audit starts at the place after it.
	auditDone: string;
};

export const DEFAULT_SETTINGS: Settings = {
	recipesFolder: '',
	pantryFolder: 'Larder/Pantry',
	planNote: 'Larder/Meal plan.md',
	shoppingFolder: 'Larder/Shopping',
	itemsFolder: 'Larder/Shopping/Items',
	newPlace: 'Kitchen',
	places: [],
	font: 'bricolage',
	fontName: '',
	accent: 'olive',
	sound: 'beeps',
	volume: 7,
	vibrate: true,
	keepScreenOn: true,
	soonDays: 5,
	auditDone: ''
};

// The path of a folder as the vault has it: "Recipes/" and " Recipes " are "Recipes".
export const folderPath = (text: string) => text.trim().replace(/^\/+|\/+$/g, '');

// The path of a note as the vault has it: "Meal plan" is "Meal plan.md".
export function notePath(text: string): string {
	const path = folderPath(text);
	return !path || path.endsWith('.md') ? path : `${path}.md`;
}
