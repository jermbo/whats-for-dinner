import type { Settings } from '../settings';
import type { Setup } from '../setup/screen';
import type { Stock } from '../pantry/types';

export type CookResult = {
	// The new rows of each food item that the meal used, by the path of its note.
	stocks: Map<string, Stock[]>;
	// The food items that the meal could not take food from, by the path of the note.
	check: string[];
	rating: number | null;
	note: string;
	photo: Blob | null;
};

// A page that covers the four parts of the kitchen.
export type KitchenPage =
	| { is: 'intake' }
	| { is: 'convert'; path: string }
	| { is: 'edit'; path: string }
	| { is: 'gallery'; path: string };

export type Part = 'pantry' | 'recipes' | 'plan' | 'shop';

// What the plugin keeps in its data file: the paths of the food items whose suggestion you skipped
// for this trip, the settings, and the step of setup. The cart is not here. It is in the note of
// the trip, which Obsidian moves to your other device.
export type Saved = { skipped: string[]; settings: Settings; setup?: Setup };

export type Disk = {
	load: () => Promise<Partial<Saved> | null>;
	save: (data: Saved) => Promise<void>;
};
