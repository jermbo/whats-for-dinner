import { ItemView } from 'obsidian';
import { mount, unmount } from 'svelte';
import Kitchen from './Kitchen.svelte';

export const KITCHEN_VIEW = 'whats-for-dinner-kitchen';

// The Obsidian tab that holds the kitchen screen. It gives the screen the notes of the vault.
export class KitchenView extends ItemView {
	private notes = $state<string[]>([]);
	private screen: ReturnType<typeof mount> | undefined;

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
		const { vault, workspace } = this.app;
		const read = () => {
			this.notes = vault
				.getMarkdownFiles()
				.map((file) => file.path)
				.sort();
		};

		// At the start of the app, the vault is empty until the layout is ready.
		workspace.onLayoutReady(() => {
			read();
			this.registerEvent(vault.on('create', read));
			this.registerEvent(vault.on('delete', read));
			this.registerEvent(vault.on('rename', read));
		});

		const view = this;
		this.screen = mount(Kitchen, {
			target: this.contentEl,
			props: {
				get notes() {
					return view.notes;
				}
			}
		});
	}

	async onClose() {
		if (this.screen) await unmount(this.screen);
	}
}
