import { ItemView, type WorkspaceLeaf } from 'obsidian';
import { mount, unmount } from 'svelte';
import type { Kitchen } from './kitchen-state.svelte';
import KitchenScreen from './ui/Kitchen.svelte';

export const KITCHEN_VIEW = 'whats-for-dinner-kitchen';

// The Obsidian tab that holds the kitchen screen.
export class KitchenView extends ItemView {
	private kitchen: Kitchen;
	private screen: ReturnType<typeof mount> | undefined;

	constructor(leaf: WorkspaceLeaf, kitchen: Kitchen) {
		super(leaf);
		this.kitchen = kitchen;
	}

	getViewType() {
		return KITCHEN_VIEW;
	}

	getDisplayText() {
		return "What's for Dinner";
	}

	getIcon() {
		return 'utensils';
	}

	async onOpen() {
		// At the start of the app, the vault is empty until the layout is ready.
		this.app.workspace.onLayoutReady(() => void this.kitchen.start());
		// The styles of the plugin apply only below this class.
		this.contentEl.addClass('wfd');
		this.screen = mount(KitchenScreen, {
			target: this.contentEl,
			props: { kitchen: this.kitchen }
		});
	}

	async onClose() {
		if (this.screen) await unmount(this.screen);
	}
}
