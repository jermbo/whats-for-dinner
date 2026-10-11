import { ItemView, TFile, type TAbstractFile } from 'obsidian';
import { mount, unmount } from 'svelte';
import Kitchen from './Kitchen.svelte';
import type { FoodNote, Note } from './note';
import { readFoodItem } from './pantry/food-item';
import { readProperties } from './read-properties';
import { readRecipe } from './recipemd/parse';

export const KITCHEN_VIEW = 'whats-for-dinner-kitchen';

// The notes in this folder are food items. All other notes are read as recipes.
const PANTRY_FOLDER = 'Pantry/';

// The Obsidian tab that holds the kitchen screen. It reads the notes of the vault for the screen.
export class KitchenView extends ItemView {
	private notes = $state<Note[]>([]);
	private foods = $state<FoodNote[]>([]);
	private notesByPath = new Map<string, Note>();
	private foodsByPath = new Map<string, FoodNote>();
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

		// At the start of the app, the vault is empty until the layout is ready.
		workspace.onLayoutReady(async () => {
			await Promise.all(vault.getMarkdownFiles().map((file) => this.read(file)));
			this.show();

			this.registerEvent(vault.on('create', (file) => this.update(file)));
			this.registerEvent(vault.on('modify', (file) => this.update(file)));
			this.registerEvent(vault.on('delete', (file) => this.forget(file.path)));
			this.registerEvent(
				vault.on('rename', (file, oldPath) => {
					this.forget(oldPath);
					this.update(file);
				})
			);
		});

		const view = this;
		this.screen = mount(Kitchen, {
			target: this.contentEl,
			props: {
				get notes() {
					return view.notes;
				},
				get foods() {
					return view.foods;
				}
			}
		});
	}

	async onClose() {
		if (this.screen) await unmount(this.screen);
	}

	private async read(file: TAbstractFile) {
		if (!(file instanceof TFile) || file.extension !== 'md') return;
		const text = await this.app.vault.cachedRead(file);
		// A rename can occur during the read, so the path comes after it.
		const { path } = file;

		if (path.startsWith(PANTRY_FOLDER)) {
			const { properties, body } = readProperties(text);
			this.foodsByPath.set(path, { path, item: readFoodItem(file.basename, properties, body) });
		} else {
			this.notesByPath.set(path, { path, result: readRecipe(text) });
		}
	}

	private async update(file: TAbstractFile) {
		await this.read(file);
		this.show();
	}

	private forget(path: string) {
		const wasNote = this.notesByPath.delete(path);
		const wasFood = this.foodsByPath.delete(path);
		if (wasNote || wasFood) this.show();
	}

	private show() {
		this.notes = [...this.notesByPath.values()];
		this.foods = [...this.foodsByPath.values()];
	}
}
