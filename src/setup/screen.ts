// What the kitchen shows: setup at its step, the four parts, or the screen for a vault that had
// notes of the kitchen before setup. Setup is for a new vault, and it moves no note.

export type SetupStep = 'recipes' | 'home' | 'places' | 'food';
// What the data file keeps: the step of setup, or "done". With no value, setup did not start.
export type Setup = SetupStep | 'done';

export type Screen = SetupStep | 'kitchen' | 'notes';

// The paths where the kitchen looks for its notes.
type Where = { pantry: string; plan: string; shopping: string };

// A food item, the meal plan note, or a note of the shopping folder.
export function hasKitchenNotes(paths: string[], { pantry, plan, shopping }: Where): boolean {
	return paths.some(
		(path) => path === plan || path.startsWith(`${pantry}/`) || path.startsWith(`${shopping}/`)
	);
}

// After the first step, setup makes notes of its own. So only a vault in which setup did not start
// can show the screen for notes. Null: the kitchen did not read the vault yet.
export function screenOf(setup: Setup | null, hasNotes: boolean | null): Screen | null {
	if (setup === 'done') return 'kitchen';
	if (setup) return setup;
	if (hasNotes === null) return null;
	return hasNotes ? 'notes' : 'recipes';
}
