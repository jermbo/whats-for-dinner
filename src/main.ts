import { Notice, Plugin } from 'obsidian';
import { Kitchen } from './kitchen-state.svelte';
import { KITCHEN_VIEW, KitchenView } from './kitchen-view.svelte';
import { KitchenSettingTab } from './settings-tab';
import './ui/callout.css';

export default class WhatsForDinnerPlugin extends Plugin {
	async onload() {
		const kitchen = new Kitchen(
			this.app,
			{ load: () => this.loadData(), save: (data) => this.saveData(data) },
			(ref) => this.registerEvent(ref)
		);

		// The settings are in the data file. The tab and the settings screen need them from the start.
		await kitchen.loadSaved();

		this.registerView(KITCHEN_VIEW, (leaf) => new KitchenView(leaf, kitchen));
		this.addSettingTab(new KitchenSettingTab(this.app, this, kitchen));
		this.addRibbonIcon('utensils', "Open What's for Dinner", () => this.openKitchen());
		this.addCommand({
			id: 'open-kitchen',
			name: 'Open the kitchen',
			callback: () => this.openKitchen()
		});
		this.addCommand({
			id: 'add-recipe',
			name: 'Add recipe',
			callback: async () => {
				kitchen.openPage({ is: 'intake' });
				await this.openKitchen();
			}
		});
		this.addCommand({
			id: 'edit-recipe',
			name: 'Edit recipe',
			checkCallback: (checking) => {
				const path = this.app.workspace.getActiveFile()?.path;
				const entry = kitchen.recipes.find((recipe) => recipe.path === path);
				if (!entry) return false;
				if (!checking) {
					kitchen.openPage({ is: 'edit', path: entry.path });
					void this.openKitchen();
				}
				return true;
			}
		});
		this.addCommand({
			id: 'open-gallery',
			name: 'Open the gallery',
			checkCallback: (checking) => {
				const path = this.app.workspace.getActiveFile()?.path;
				const entry = kitchen.recipes.find((recipe) => recipe.path === path);
				if (!entry?.photo) return false;
				if (!checking) {
					kitchen.openPage({ is: 'gallery', path: entry.path });
					void this.openKitchen();
				}
				return true;
			}
		});
		// Only the development build has it, so that a test of setup can start again many times.
		if (import.meta.env.MODE === 'development') {
			this.addCommand({
				id: 'start-setup-again',
				name: 'Start setup again (deletes the plugin home)',
				callback: async () => {
					await kitchen.startSetupAgain();
					new Notice('Setup starts again. The plugin home is in the trash of the vault.');
					await this.openKitchen();
				}
			});
		}
	}

	// One kitchen is sufficient: a second call shows the tab that is open.
	private async openKitchen() {
		const { workspace } = this.app;
		let leaf = workspace.getLeavesOfType(KITCHEN_VIEW)[0];
		if (!leaf) {
			leaf = workspace.getLeaf('tab');
			await leaf.setViewState({ type: KITCHEN_VIEW, active: true });
		}
		await workspace.revealLeaf(leaf);
	}
}
