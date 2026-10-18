import { makeStock } from '../pantry/food-item';
import { entryIn } from '../pantry/unit-system';
import type { Stock } from '../pantry/types';
import type { Settings } from '../settings';
import { folderPath } from '../settings';
import { homeFolders, homeOf, homePaths } from '../setup/home';
import type { Setup } from '../setup/screen';

export type SetupActionsHost = {
	settings: Settings;
	foodCount: number;
	exists(path: string): boolean;
	createFolder(path: string): Promise<void>;
	createFile(path: string, text: string): Promise<void>;
	changeSettings(change: Partial<Settings>): Promise<void>;
	goTo(setup: Setup): Promise<void>;
	addStock(name: string, stock: Stock): Promise<void>;
	trash(path: string): Promise<void>;
	forgetAll(): Promise<void>;
};

async function makeFolder(host: SetupActionsHost, path: string) {
	if (!host.exists(path)) await host.createFolder(path);
}

// The folder can be in the vault already, or new.
export async function chooseRecipesFolder(host: SetupActionsHost, text: string) {
	const recipesFolder = folderPath(text);
	await makeFolder(host, recipesFolder);
	await host.changeSettings({ recipesFolder });
	await host.goTo('home');
}

// A folder or a note that is there already stays as it is.
export async function makeHome(host: SetupActionsHost, name: string) {
	const home = folderPath(name);
	for (const folder of homeFolders(home)) await makeFolder(host, folder);
	const paths = homePaths(home);
	if (!host.exists(paths.planNote)) await host.createFile(paths.planNote, '');
	await host.changeSettings(paths);
	await host.goTo('places');
}

export async function choosePlaces(host: SetupActionsHost, places: string[], newPlace: string) {
	await host.changeSettings({ places, newPlace });
	await host.goTo('food');
}

// For a test of setup: the plugin home goes to the trash of the vault, where you can get it back,
// and the data file starts as on a new install. The recipes folder stays.
export async function startAgain(host: SetupActionsHost) {
	const home = homeOf(host.settings.pantryFolder);
	if (home && host.exists(home)) await host.trash(home);
	await host.forgetAll();
}

// Each staple with an amount gets its note in "Place for new food". The vault reports a new note
// later, so the count of the food items does not show the notes of this call yet. False: the
// pantry has no food item, and setup stays open.
export async function finishSetup(
	host: SetupActionsHost,
	staples: Map<string, string>
): Promise<boolean> {
	const given = [...staples].flatMap(([name, typed]) => {
		const amount = entryIn(host.settings.units, typed);
		return amount ? [[name, amount] as const] : [];
	});
	for (const [name, amount] of given) {
		await host.addStock(name, makeStock(host.settings.newPlace, amount, ''));
	}
	if (!given.length && !host.foodCount) return false;
	await host.goTo('done');
	return true;
}
