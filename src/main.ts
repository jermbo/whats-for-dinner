import { Plugin } from 'obsidian';
import { Kitchen } from './kitchen-state.svelte';
import { KITCHEN_VIEW, KitchenView } from './kitchen-view.svelte';

export default class WhatsForDinnerPlugin extends Plugin {
	async onload() {
		const kitchen = new Kitchen(
			this.app,
			{ load: () => this.loadData(), save: (data) => this.saveData(data) },
			(ref) => this.registerEvent(ref)
		);

		this.registerView(KITCHEN_VIEW, (leaf) => new KitchenView(leaf, kitchen));
		this.addRibbonIcon('utensils', "Open What's for Dinner", () => this.openKitchen());
		this.addCommand({
			id: 'open-kitchen',
			name: 'Open the kitchen',
			callback: () => this.openKitchen()
		});
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
