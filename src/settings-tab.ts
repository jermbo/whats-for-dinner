// The settings screen of the plugin, in the settings of Obsidian. It has the look of Obsidian and
// not the look of the kitchen, so that it is the same as each other settings screen.

import { AbstractInputSuggest, PluginSettingTab, Setting, type App, type Plugin } from 'obsidian';
import { Alarm, type Sound } from './cook/alarm';
import type { Kitchen } from './kitchen-state.svelte';
import { addPlace, removePlace, renamePlace } from './pantry/places';
import type { Settings } from './settings';

// Proposes paths of the vault, or other texts, while you type.
class TextSuggest extends AbstractInputSuggest<string> {
	private texts: () => string[];

	constructor(app: App, field: HTMLInputElement, texts: () => string[]) {
		super(app, field);
		this.texts = texts;
	}

	protected getSuggestions(query: string): string[] {
		const words = query.toLowerCase();
		return this.texts().filter((text) => text.toLowerCase().includes(words));
	}

	renderSuggestion(text: string, el: HTMLElement) {
		el.setText(text);
	}
}

type TextKey =
	| 'recipesFolder'
	| 'pantryFolder'
	| 'planNote'
	| 'shoppingFolder'
	| 'itemsFolder'
	| 'newPlace'
	| 'fontName';
type NumberKey = 'volume' | 'soonDays' | 'lowPercent';
type SwitchKey = 'vibrate' | 'keepScreenOn';

const days = (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`;

export class KitchenSettingTab extends PluginSettingTab {
	private kitchen: Kitchen;
	// The sound of the "Test" button.
	private alarm = new Alarm();

	constructor(app: App, plugin: Plugin, kitchen: Kitchen) {
		super(app, plugin);
		this.kitchen = kitchen;
	}

	display() {
		const { containerEl, kitchen } = this;
		const { vault } = this.app;
		const folders = () => vault.getAllFolders().map((folder) => folder.path);
		const notes = () => vault.getMarkdownFiles().map((file) => file.path);
		containerEl.empty();

		// Setup is for a new vault. A vault with notes of the kitchen goes on from here.
		if (kitchen.screen === 'notes') {
			this.heading('Setup');
			new Setting(containerEl)
				.setName('Use these notes')
				.setDesc(
					'This vault has notes of the kitchen already, so the kitchen does not run setup. Check the folders below, and then open the kitchen with the notes that are there.'
				)
				.addButton((button) =>
					button
						.setButtonText('Use these notes')
						.setCta()
						.onClick(async () => {
							await kitchen.useNotes();
							this.display();
						})
				);
		}

		this.heading('Notes');
		this.text(
			'recipesFolder',
			'Recipes folder',
			'Only the notes in this folder are recipes. With no folder, the plugin tries each note of the vault.',
			'All notes',
			folders
		);
		this.text(
			'pantryFolder',
			'Pantry folder',
			'Each note in this folder is a food item.',
			'Larder/Pantry',
			folders
		);
		this.text(
			'planNote',
			'Meal plan note',
			'The note with the meals of the week.',
			'Larder/Meal plan.md',
			notes
		);
		this.text(
			'shoppingFolder',
			'Shopping folder',
			'The note of each shopping trip is in this folder.',
			'Larder/Shopping',
			folders
		);
		this.text(
			'itemsFolder',
			'Items folder',
			'An item of your own that no note has links to a note of this folder. The plugin makes no note there.',
			'Larder/Shopping/Items',
			folders
		);
		this.text(
			'newPlace',
			'Place for new food',
			'Food from a shopping trip goes to this place, when the pantry does not have that food item yet.',
			'Kitchen',
			() => kitchen.places
		);

		this.heading('Places');
		this.placeList();

		this.heading('Look');
		new Setting(containerEl)
			.setName('Font for titles and numbers')
			.setDesc('All other text has the font of Obsidian.')
			.addDropdown((list) =>
				list
					.addOptions({
						bricolage: 'Bricolage Grotesque',
						obsidian: 'Font of Obsidian',
						device: 'A font of this device'
					})
					.setValue(kitchen.settings.font)
					.onChange((value) => {
						this.change({ font: value as Settings['font'] });
						// The field for the name of the font shows only for a font of the device.
						this.display();
					})
			);
		if (kitchen.settings.font === 'device') {
			this.text(
				'fontName',
				'Font name',
				'The name of a font that is on this device. A device that does not have the font shows Bricolage Grotesque.',
				'Georgia'
			);
		}
		new Setting(containerEl)
			.setName('Accent colour')
			.setDesc(
				'The colour of "ready", "done", and the current step. The accent colour of Obsidian comes from your theme, or from the Appearance settings.'
			)
			.addDropdown((list) =>
				list
					.addOptions({ olive: 'Larder olive', obsidian: 'Accent colour of Obsidian' })
					.setValue(kitchen.settings.accent)
					.onChange((value) => this.change({ accent: value as Settings['accent'] }))
			);

		this.heading('Cook Mode');
		new Setting(containerEl)
			.setName('Timer sound')
			.setDesc('The sound when a timer ends. It repeats until you tap "OK".')
			.addDropdown((list) =>
				list
					.addOptions({ beeps: 'Beeps', chime: 'Chime', off: 'No sound' })
					.setValue(kitchen.settings.sound)
					.onChange((value) => this.change({ sound: value as Sound }))
			)
			.addButton((button) =>
				button.setButtonText('Test').onClick(() => this.alarm.once(kitchen.settings))
			);
		this.slider('volume', 'Volume', (value) => `${value} of 10.`, 1, 10, 1);
		this.switch('vibrate', 'Vibrate', 'A phone that can vibrate does so when a timer ends.');
		this.switch(
			'keepScreenOn',
			'Keep the screen on',
			'The screen does not go dark while Cook Mode is open.'
		);

		this.heading('Pantry');
		this.slider(
			'soonDays',
			'Use soon',
			(value) => `Food with a use-by date in ${days(value)} or less is food to use soon.`,
			1,
			14,
			1
		);
		this.slider(
			'lowPercent',
			'Low line',
			(value) => `A food item with no low line of its own is low below ${value}% of its full amount.`,
			5,
			50,
			5
		);
	}

	hide() {
		this.alarm.close();
	}

	private change(change: Partial<Settings>) {
		void this.kitchen.changeSettings(change);
	}

	private heading(name: string) {
		new Setting(this.containerEl).setName(name).setHeading();
	}

	// A text field. With a list of texts, the field proposes them while you type.
	private text(key: TextKey, name: string, desc: string, hint: string, texts?: () => string[]) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc)
			.addText((field) => {
				field
					.setPlaceholder(hint)
					.setValue(this.kitchen.settings[key])
					.onChange((value) => this.change({ [key]: value } as Partial<Settings>));
				if (!texts) return;

				const suggest = new TextSuggest(this.app, field.inputEl, texts);
				suggest.onSelect((text) => {
					field.setValue(text);
					this.change({ [key]: text } as Partial<Settings>);
					suggest.close();
				});
			});
	}

	// One field for each place of the list, and a field for a new place. Add food, the filters of the
	// pantry, and put away show each of them, also before a row has the place.
	private placeList() {
		const list = this.kitchen.settings.places;
		for (const name of list) {
			new Setting(this.containerEl)
				.addText((field) => {
					field.setValue(name);
					// A rename counts when you leave the field, and not at each letter.
					field.inputEl.addEventListener('change', () =>
						this.setPlaces(renamePlace(list, name, field.getValue()))
					);
				})
				.addExtraButton((button) =>
					button
						.setIcon('trash-2')
						.setTooltip(`Remove ${name}`)
						.setDisabled(list.length === 1)
						.onClick(() => this.setPlaces(removePlace(list, name)))
				);
		}

		let added = '';
		new Setting(this.containerEl)
			.setName('A new place')
			.setDesc('The list keeps one place at the minimum. A change here does not change a note.')
			.addText((field) => field.setPlaceholder('Garage freezer').onChange((value) => (added = value)))
			.addButton((button) =>
				button.setButtonText('Add').onClick(() => this.setPlaces(addPlace(list, added)))
			);
	}

	// The fields show the list as it is after the change.
	private async setPlaces(places: string[]) {
		await this.kitchen.changeSettings({ places });
		this.display();
	}

	// The description gives the value, because a slider shows no number.
	private slider(
		key: NumberKey,
		name: string,
		desc: (value: number) => string,
		min: number,
		max: number,
		step: number
	) {
		const setting = new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc(this.kitchen.settings[key]));
		setting.addSlider((slider) =>
			slider
				.setLimits(min, max, step)
				.setValue(this.kitchen.settings[key])
				.setDynamicTooltip()
				.onChange((value) => {
					setting.setDesc(desc(value));
					this.change({ [key]: value } as Partial<Settings>);
				})
		);
	}

	private switch(key: SwitchKey, name: string, desc: string) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(desc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.kitchen.settings[key])
					.onChange((value) => this.change({ [key]: value } as Partial<Settings>))
			);
	}
}
